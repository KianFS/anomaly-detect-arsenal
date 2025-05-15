# File System Attack Detector

A web-based tool for monitoring file system changes and detecting potentially malicious files. This application helps identify suspicious files and modifications in your selected directories through baseline comparison and risk assessment.

## Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd anomaly-detect-arsenal
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install
   # OR using bun
   bun install
   ```

3. **Run the Application**
   ```bash
   # Using npm
   npm run dev
   # OR using bun
   bun run dev
   ```

4. **Access the Application**
   - Open your browser
   - Navigate to link diplayed in the termial for local server
   - The web interface should now be running

## How to Use

1. **Initial Setup**
   - Open the web application
   - You'll see a text input field for the directory path
   - Enter any path (this is just for reference)
   - Click "Create Baseline"
   - The system will prompt you for directory access permission
   - Select the directory you want to monitor
   - Grant the necessary permissions when prompted

2. **Creating a Baseline**
   - After selecting your directory, the system creates a baseline
   - The baseline is a snapshot of all files in your selected directory
   - This baseline will be used to detect any future changes


3. **Testing the Detection System**
   For a quick demo of the system's capabilities:
   - Add a new file to your monitored directory
   - For example, create a file named "mimikatz_copy.exe" 
     (This is a known malicious file pattern that the system will detect as HIGH risk)
   - Or add "update_installer.exe" 
     (This will be detected as MEDIUM risk due to suspicious naming patterns)

4. **Scanning for Changes**
   - Click "Scan Directory"
   - Select the same directory when prompted
   - The system will analyze all changes since the baseline
   - You'll see:
     - A pie chart showing the distribution of risk levels (HIGH, MEDIUM, LOW)
     - A detailed list of all detected changes

5. **Understanding the Results**
   - Each detection shows:
     - File path
     - Type of change (ADDED, MODIFIED, DELETED)
     - Risk level (color-coded: RED for HIGH, YELLOW for MEDIUM, GREEN for LOW)
     - File details (size, modification time, hash)
   - The statistics section shows:
     - Total number of detections
     - Distribution of risk levels
     

## Risk Levels

- **HIGH**: Known malicious patterns, suspicious double extensions, system file masquerading
- **MEDIUM**: Potentially suspicious names, unusual locations, script files
- **LOW**: Common file modifications, standard executables

The system uses pattern matching and contextual analysis to determine risk levels, helping you identify potential security threats in your file system.



**Build and Development**
   - Vite (v5.4.1) - Build tool and development server
   - TypeScript (v5.5.3) - Type checking and compilation
   - SWC (via @vitejs/plugin-react-swc) - Fast JavaScript/TypeScript compiler

**Styling Tools**
   - Tailwind CSS (v3.4.11) - Utility-first CSS framework
   - PostCSS (v8.4.47) - CSS processing