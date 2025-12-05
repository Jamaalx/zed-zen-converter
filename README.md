# ZED-ZEN Media Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-32.2.5-47848F?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![Security](https://img.shields.io/badge/Security-Audited-brightgreen)](./SECURITY.md)
[![No Tracking](https://img.shields.io/badge/Tracking-None-blue)](./SECURITY.md)
[![Offline](https://img.shields.io/badge/Works-100%25%20Offline-orange)](./SECURITY.md)

Professional media conversion tool powered by FFmpeg and Sharp.

**100% Offline | No Data Collection | Open Source**

---

## Features

- Image Conversion (JPG, PNG, WebP, AVIF, BMP, SVG)
- Video Conversion (MP4, AVI, WebM, MKV, MOV, GIF)
- Document Conversion (PDF, DOCX, TXT)
- Drag & Drop Interface
- Batch Processing
- Quality Control Slider
- Quick Presets for Restaurants & Delivery Apps
- Modern Dark UI

---

## Security & Privacy

> **This application is 100% safe and does NOT contain malware.**

| Feature | Status |
|---------|--------|
| Network requests | **None** - Works completely offline |
| Data collection | **None** - No analytics, no tracking |
| File access | **Only files you select** via native dialogs |
| Open source | **Yes** - Full code audit available |

### For detailed security information, see [SECURITY.md](./SECURITY.md)

### Why Antivirus May Flag This App

Some antivirus software may flag this application because:
- It's not signed with a paid code signing certificate (~$300/year)
- Electron apps are sometimes flagged heuristically
- New applications lack "reputation"

**This is a false positive.** You can:
1. Build from source yourself (see below)
2. Check the code - it's all open source
3. Monitor network traffic - zero external connections

---

## Tech Stack

| Component | Library | Purpose |
|-----------|---------|---------|
| Desktop | [Electron](https://www.electronjs.org/) 32.2.5 | Cross-platform framework |
| UI | [React](https://react.dev/) 18.3.1 | User interface |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3.4.17 | Modern CSS |
| Images | [Sharp](https://sharp.pixelplumbing.com/) 0.33.5 | Image processing |
| Video | [FFmpeg](https://ffmpeg.org/) | Video processing |
| PDF | [pdf-lib](https://pdf-lib.js.org/) 1.17.1 | PDF manipulation |
| Documents | [mammoth](https://github.com/mwilliamson/mammoth.js), [docx](https://docx.js.org/) | Document conversion |

All dependencies are open source, actively maintained, and used by millions of developers.

---

## Installation

### Prerequisites

- Node.js v18 or higher
- FFmpeg installed on your system

### From Source

```bash
# Clone repository
git clone https://github.com/Jamaalx/zed-zen-converter.git
cd zed-zen-converter

# Install dependencies
npm install

# Start development mode
npm start

# Build installer
npm run make
```

The installer will be in `out/make/squirrel.windows/x64/`.

---

## Usage

1. **Add Files** - Drag and drop or click to browse
2. **Select Format** - Choose output format (WebP, JPG, PNG, MP4, etc.)
3. **Adjust Quality** - Use slider (1-100%)
4. **Select Output Folder** - Choose destination
5. **Convert** - Click the convert button

### Quick Presets

| Preset | Format | Quality | Use Case |
|--------|--------|---------|----------|
| Restaurant Menu | WebP | 85% | Menu photos |
| Delivery App | WebP | 75% | Delivery platforms |
| Social Media | JPG | 90% | Instagram, Facebook |
| Archive | PNG | 100% | Lossless backup |

---

## Building Installers

```bash
# Windows installer
npm run make

# Output location
out/make/squirrel.windows/x64/ZedZen-Media-Converter-Setup.exe
```

For code signing instructions, see [BUILD.md](./BUILD.md).

---

## Project Structure

```
zed-zen-converter/
├── src/
│   ├── main.js           # Electron main process
│   ├── preload.js        # Secure bridge to renderer
│   ├── renderer.jsx      # React entry point
│   ├── App.jsx           # Main React component
│   ├── components/       # UI components
│   └── utils/            # Helper functions
├── forge.config.js       # Electron Forge config
├── SECURITY.md           # Security documentation
├── BUILD.md              # Build instructions
└── LICENSE               # MIT License
```

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Fortitudo Vincit SRL**

**Version**: 1.0.0 | **Author**: Alex Mantello
