import { Detection } from '../types';

const BASELINE_FILE = '.fs_baseline.json';

const SUSPICIOUS_EXTS = new Set([
  '.exe', '.dll', '.scr', '.sys',     // Windows binaries
  '.bat', '.cmd', '.ps1', '.vbs',     // Windows scripts
  '.js', '.jse', '.hta',              // Script engines
  '.jar', '.class',                   // Java
  '.apk', '.ipa',                     // Mobile packages
  '.elf', '.bin', '.sh',              // Linux / generic
  '.img', '.iso',                     // Bootable images
]);

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
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  const baseName = fileName.toLowerCase();
  
  if (SUSPICIOUS_NAMES.has(baseName)) {
    return 'HIGH';
  }
  if (SUSPICIOUS_EXTS.has(ext)) {
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
              severity: 'LOW',
              ...current[entryPath]
            });
          } else if (baseline[entryPath].sha256 !== hash) {
            detections.push({
              path: entryPath,
              type: 'MODIFIED',
              timestamp: new Date().toISOString(),
              severity: 'MEDIUM',
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