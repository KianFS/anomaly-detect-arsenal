import { Detection } from '../types';

const BASELINE_FILE = '.fs_baseline.json';

const SUSPICIOUS_PATTERNS = {
  HIGH: [
    // Known malware patterns
    /mimikatz/i,
    /mimi/i,
    /procdump/i,
    /lsass.*dump/i,
    /beacon/i,
    /stageless/i,
    /ransom/i,
    /decrypt/i,
    /remcos/i,
    /njrat/i,
    /quasar/i,
    // Suspicious double extensions
    /\.(pdf|doc|docx|xls|xlsx|txt)\.(exe|scr|bat|ps1|vbs)$/i,
    // Suspicious naming patterns
    /copy.*of.*\.(exe|dll)$/i,
    /backup.*\.(exe|dll)$/i,
    /temp.*\.(exe|dll)$/i,
    /new.*\.(exe|dll)$/i,
    // Common RAT names
    /rat\.(exe|dll)$/i,
    /trojan/i,
    /backdoor/i,
    /keylog/i,
    /stealer/i
  ],
  MEDIUM: [
    // Potentially suspicious patterns
    /svc.*\.(exe|dll)$/i,
    /service.*\.(exe|dll)$/i,
    /update.*\.(exe|dll)$/i,
    /install.*\.(exe|dll)$/i,
    /setup.*\.(exe|dll)$/i,
    // Suspicious locations or contexts
    /temp.*\.(js|vbs|ps1|bat)$/i,
    /windows.*temp.*\.(exe|dll|bat|ps1)$/i,
    /system32.*copy/i,
    // Obfuscation attempts
    /[0-9a-f]{32}\.(exe|dll)$/i,  // MD5-like names
    /base64/i,
    /encoded/i,
    /encrypted/i,
    // Script-based threats
    /download.*\.(js|vbs|ps1|bat)$/i,
    /invoke.*\.(js|vbs|ps1|bat)$/i,
    /exec.*\.(js|vbs|ps1|bat)$/i
  ],
  LOW: [
    // Generally suspicious but might be legitimate
    /uninstall.*\.(exe|dll)$/i,
    /remove.*\.(exe|dll)$/i,
    /patch.*\.(exe|dll)$/i,
    /crack/i,
    /hack/i,
    /patch/i,
    // Unusual but not necessarily malicious
    /tool.*\.(exe|dll)$/i,
    /util.*\.(exe|dll)$/i,
    /helper.*\.(exe|dll)$/i
  ]
};

const SUSPICIOUS_EXTS_WITH_RISK = {
  HIGH: new Set([
    '.exe', '.dll', '.scr', '.sys'  // Native Windows binaries
  ]),
  MEDIUM: new Set([
    '.bat', '.cmd', '.ps1', '.vbs', // Windows scripts
    '.js', '.jse', '.hta',          // Script engines
    '.jar', '.class',               // Java
    '.apk', '.ipa'                  // Mobile packages
  ]),
  LOW: new Set([
    '.msi', '.msp',                 // Windows installers
    '.sh', '.bash',                 // Shell scripts
    '.py', '.pl', '.rb'            // Other scripts
  ])
};

const SUSPICIOUS_NAMES = new Set([
  'mimikatz.exe', 'procdump.exe', 'lsass_dump.dmp',
  'beacon.dll', 'stageless.bin',
  'ransom_note.txt', 'readme_decrypt.txt', 'how_to_recover_files.html',
  'remcos.exe', 'njrat.exe', 'quasar.exe',
  'invoice.pdf.exe', 'payment_details.doc.scr',
]);

interface FileMetadata {
  size: number;
  mtime: number;
  mode: string;
  sha256: string;
}

interface BaselineData {
  [key: string]: FileMetadata;
}

let directoryHandle: FileSystemDirectoryHandle | null = null;

// Function to request directory access
export const requestDirectoryAccess = async (): Promise<FileSystemDirectoryHandle> => {
  try {
    directoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite' // Request read and write permissions
    });
    // Verify we have permission
    const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
    if (permissionStatus !== 'granted') {
      throw new Error('Permission to access directory was denied');
    }
    return directoryHandle;
  } catch (error) {
    throw new Error(`Failed to get directory access: ${error.message}`);
  }
};

// Helper function to calculate file hash
const calculateHash = async (data: ArrayBuffer): Promise<string> => {
  // Use window.crypto.subtle instead of just crypto
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Helper function to read file as array buffer
const readFileAsArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
  return await file.arrayBuffer();
};

const classifySeverity = (fileName: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const lowerFileName = fileName.toLowerCase();
  const ext = lowerFileName.substring(lowerFileName.lastIndexOf('.')).toLowerCase();
  
  // Check for exact matches in SUSPICIOUS_NAMES first
  if (SUSPICIOUS_NAMES.has(lowerFileName)) {
    return 'HIGH';
  }

  // Check regex patterns
  for (const [severity, patterns] of Object.entries(SUSPICIOUS_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerFileName)) {
        return severity as 'HIGH' | 'MEDIUM' | 'LOW';
      }
    }
  }

  // Check file extensions
  for (const [severity, extensions] of Object.entries(SUSPICIOUS_EXTS_WITH_RISK)) {
    if (extensions.has(ext)) {
      return severity as 'HIGH' | 'MEDIUM' | 'LOW';
    }
  }

  // Additional contextual checks
  if (lowerFileName.includes('system32') || lowerFileName.includes('windows')) {
    // Files trying to masquerade as system files
    return 'HIGH';
  }

  if (lowerFileName.split('.').length > 2) {
    // Multiple extensions might be attempting to hide true file type
    return 'MEDIUM';
  }

  return 'LOW';
};

export const createBaseline = async (targetPath: string): Promise<void> => {
  try {
    // Request directory access
    const handle = await window.showDirectoryPicker();
    
    // Create baseline data
    const metadata = {};
    
    // Process files recursively
    const processDirectory = async (dirHandle: FileSystemDirectoryHandle, path = '') => {
      for await (const entry of dirHandle.values()) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'directory') {
          const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
          await processDirectory(subDirHandle, entryPath);
        } else if (entry.kind === 'file') {
          const file = await entry.getFile();
          const arrayBuffer = await file.arrayBuffer();
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          metadata[entryPath] = {
            size: file.size,
            mtime: file.lastModified / 1000,
            mode: '644',
            sha256: hash
          };
        }
      }
    };

    await processDirectory(handle);
    
    // Save baseline
    const baselineHandle = await handle.getFileHandle(BASELINE_FILE, { create: true });
    const writable = await baselineHandle.createWritable();
    await writable.write(JSON.stringify(metadata, null, 2));
    await writable.close();
    
  } catch (error) {
    throw new Error(`Failed to create baseline: ${error.message}`);
  }
};

export const scanDirectory = async (targetPath: string): Promise<Detection[]> => {
  try {
    const handle = await window.showDirectoryPicker();
    const detections: Detection[] = [];
    
    // Read baseline
    const baselineHandle = await handle.getFileHandle(BASELINE_FILE);
    const baselineFile = await baselineHandle.getFile();
    const baseline = JSON.parse(await baselineFile.text());
    
    // Current state
    const current = {};
    
    // Process files recursively
    const processDirectory = async (dirHandle: FileSystemDirectoryHandle, path = '') => {
      for await (const entry of dirHandle.values()) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'directory') {
          const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
          await processDirectory(subDirHandle, entryPath);
        } else if (entry.kind === 'file') {
          const file = await entry.getFile();
          const arrayBuffer = await file.arrayBuffer();
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          current[entryPath] = {
            size: file.size,
            mtime: file.lastModified / 1000,
            mode: '644',
            sha256: hash
          };
          
          if (!baseline[entryPath]) {
            detections.push({
              path: entryPath,
              type: 'ADDED',
              timestamp: new Date().toISOString(),
              severity: classifySeverity(entry.name),
              ...current[entryPath]
            });
          } else if (baseline[entryPath].sha256 !== hash) {
            detections.push({
              path: entryPath,
              type: 'MODIFIED',
              timestamp: new Date().toISOString(),
              severity: classifySeverity(entry.name),
              ...current[entryPath]
            });
          }
        }
      }
    };

    await processDirectory(handle);
    
    // Check for deleted files
    for (const path in baseline) {
      if (!current[path]) {
        detections.push({
          path,
          type: 'DELETED',
          timestamp: new Date().toISOString(),
          severity: 'HIGH',
          ...baseline[path]
        });
      }
    }
    
    return detections;
    
  } catch (error) {
    throw new Error(`Failed to scan directory: ${error.message}`);
  }
}; 