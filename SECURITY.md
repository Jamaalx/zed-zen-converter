# Security & Transparency Report

## Overview

ZED-ZEN Media Converter is a **100% local, offline application** that processes your files on your computer without sending any data to external servers.

This document explains the technology stack, security measures, and why this application is safe to use.

---

## Technology Stack

| Component | Library | Version | Purpose | Weekly Downloads |
|-----------|---------|---------|---------|------------------|
| **Desktop Framework** | [Electron](https://www.electronjs.org/) | 32.2.5 | Cross-platform desktop app | 3M+ |
| **UI Framework** | [React](https://react.dev/) | 18.3.1 | User interface | 25M+ |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | Modern styling | 10M+ |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) | 0.33.5 | Image conversion | 6M+ |
| **Video Processing** | [FFmpeg](https://ffmpeg.org/) via fluent-ffmpeg | 2.1.3 | Video conversion | 500K+ |
| **PDF Processing** | [pdf-lib](https://pdf-lib.js.org/) | 1.17.1 | PDF manipulation | 1M+ |
| **Document Processing** | [mammoth](https://github.com/mwilliamson/mammoth.js) | 1.11.0 | DOCX reading | 300K+ |
| **Document Creation** | [docx](https://docx.js.org/) | 9.5.1 | DOCX creation | 200K+ |

**All libraries are:**
- Open source with publicly auditable code
- Actively maintained by reputable developers
- Used by millions of developers worldwide
- Available on [npmjs.com](https://www.npmjs.com/)

---

## Security Architecture

### Electron Security Configuration

```javascript
// Our security settings (from main.js and forge.config.js)
{
  nodeIntegration: false,        // Renderer cannot access Node.js
  contextIsolation: true,        // Renderer is sandboxed
  RunAsNode: false,              // Cannot be run as Node script
  EnableNodeOptionsEnvironmentVariable: false,  // No env injection
  EnableCookieEncryption: true,  // Encrypted cookies
}
```

| Security Feature | Status | Description |
|-----------------|--------|-------------|
| Node Integration | **Disabled** | Web page cannot access Node.js APIs |
| Context Isolation | **Enabled** | Preload scripts run in isolated context |
| Sandbox | **Enabled** | Renderer process is sandboxed |
| Run as Node | **Disabled** | App cannot be hijacked as Node script |
| ASAR Packaging | **Enabled** | Source code is packaged securely |

### What the App CAN Do

| Capability | How It Works |
|------------|--------------|
| Read files you select | Only through native file picker dialog |
| Write converted files | Only to folder you explicitly choose |
| Open output folder | Opens in system file explorer |

### What the App CANNOT Do

| Capability | Why Not |
|------------|---------|
| Access files without permission | Uses native dialogs, no arbitrary file access |
| Send data to internet | No network requests, no analytics servers |
| Install other software | No download or execution capabilities |
| Run arbitrary commands | No shell access exposed to renderer |
| Access your browser data | Completely isolated from browsers |
| Run in background | Closes completely when you close the window |

---

## Data Privacy

### What We Collect

**Nothing.** Zero. Nada.

```javascript
// Our "analytics" (from analytics.js) - LOCAL ONLY
localStorage.setItem('zedzen_total_conversions', count);
localStorage.setItem('zedzen_premium', status);
```

- All data stays in your browser's localStorage
- No external servers
- No tracking pixels
- No cookies sent anywhere
- No user accounts required

### Network Activity

This application makes **ZERO network requests**:

- No telemetry
- No update checks (manual updates only)
- No license validation servers
- No cloud storage integration
- No crash reporting

You can verify this by monitoring network traffic with Wireshark or your firewall.

---

## Why Antivirus Software May Flag This App

### Common False Positive Triggers

| Trigger | Explanation |
|---------|-------------|
| **Unsigned executable** | Windows marks all unsigned apps as "unknown publisher" |
| **Electron framework** | Some malware uses Electron, so it's flagged heuristically |
| **File system access** | Any app that reads/writes files may be flagged |
| **Bundled binaries** | FFmpeg/Sharp natives trigger some scanners |
| **New/unknown app** | Reputation-based systems flag apps with few users |

### How We Address This

1. **Code Signing** - We support Windows code signing certificates
2. **Open Source** - All code is publicly auditable on GitHub
3. **Reputable Dependencies** - Only well-known, trusted libraries
4. **Minimal Permissions** - App requests only what it needs

### Verify It Yourself

1. **Scan on VirusTotal**: Upload the installer to [virustotal.com](https://www.virustotal.com/)
2. **Check network**: Monitor with Wireshark - zero external connections
3. **Read the code**: All source code is available in this repository
4. **Build from source**: `npm install && npm run make`

---

## Source Code Audit

### Main Process (main.js)

The main process handles:
- Window creation
- Native file dialogs
- File conversion (Sharp, FFmpeg, pdf-lib)
- IPC communication with renderer

**No suspicious code:**
- No `eval()` or `Function()` calls
- No dynamic code execution
- No obfuscated code
- No network requests
- No data exfiltration

### Preload Script (preload.js)

Only 5 functions exposed to the web page:

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  convertFile: (options) => ipcRenderer.invoke('convert-file', options),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
});
```

**No dangerous APIs exposed:**
- No `fs` (file system)
- No `child_process` (command execution)
- No `shell.exec` (shell commands)
- No `net` (networking)

---

## Comparison with Malware

| Characteristic | Malware | ZED-ZEN Converter |
|----------------|---------|-------------------|
| Network activity | Sends data to C&C servers | Zero network requests |
| File access | Accesses files silently | Only user-selected files |
| Persistence | Runs on startup, hides | No auto-start, visible window |
| Obfuscation | Encrypted/packed code | Open source, readable |
| Permissions | Requests admin rights | No elevated privileges |
| Background activity | Runs hidden processes | None when closed |

---

## Build Verification

You can verify the integrity of this application by building from source:

```bash
# Clone the repository
git clone https://github.com/Jamaalx/zed-zen-converter.git
cd zed-zen-converter

# Install dependencies
npm install

# Build the application
npm run make

# Your installer will be in: out/make/squirrel.windows/x64/
```

Compare the hash of your build with our releases:

```bash
# Windows PowerShell
Get-FileHash "out\make\squirrel.windows\x64\ZedZen-Media-Converter-Setup.exe" -Algorithm SHA256

# Linux/Mac
shasum -a 256 out/make/squirrel.windows/x64/ZedZen-Media-Converter-Setup.exe
```

---

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: [your-security-email@domain.com]
3. Include detailed steps to reproduce
4. Allow 90 days for fix before public disclosure

---

## Conclusion

ZED-ZEN Media Converter is a **safe, transparent, and privacy-respecting** application:

- **Open source** - Fully auditable code
- **Offline-only** - No internet required or used
- **Privacy-first** - Zero data collection
- **Secure architecture** - Follows Electron security best practices
- **Trusted dependencies** - Only reputable, widely-used libraries

**Your files stay on your computer. Period.**

---

*Last updated: December 2024*
*Version: 1.0.0*
*Author: Fortitudo Vincit SRL*
