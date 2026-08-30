# ZED-ZEN Media Converter

[![CI](https://github.com/Jamaalx/zed-zen-converter/actions/workflows/ci.yml/badge.svg)](https://github.com/Jamaalx/zed-zen-converter/actions/workflows/ci.yml)
[![Release](https://github.com/Jamaalx/zed-zen-converter/actions/workflows/release.yml/badge.svg)](https://github.com/Jamaalx/zed-zen-converter/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Professional media conversion tool powered by FFmpeg and Sharp.

**100% Offline | No Data Collection | Open Source**

---

## Download

Pre-built packages are published on the **[Releases page](https://github.com/Jamaalx/zed-zen-converter/releases)**:

| Platform | File |
|----------|------|
| Windows (x64) | `ZedZen-Media-Converter-Setup.exe` (installer) or `ZED-ZEN Media Converter-win32-x64.zip` (portable) |
| macOS (Apple Silicon) | `ZED-ZEN Media Converter-<version>-arm64.dmg` |
| Linux (x64) | `.AppImage` or `.deb` |

> **The builds are not code-signed.** Windows SmartScreen will show "Windows protected your PC"
> (click *More info -> Run anyway*) and macOS Gatekeeper will refuse to open the app the first time
> (right-click the app -> *Open*, or run `xattr -d com.apple.quarantine "/Applications/ZED-ZEN Media Converter.app"`).
> This is expected for an unsigned open-source app - see [Why Antivirus May Flag This App](#why-antivirus-may-flag-this-app).
> If you prefer, [build from source](#build-from-source) yourself.

Every release is built automatically from a git tag by [GitHub Actions](https://github.com/Jamaalx/zed-zen-converter/actions/workflows/release.yml), so the binaries match the source in this repository.

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
| Desktop | [Electron](https://www.electronjs.org/) 44 | Cross-platform framework |
| UI | [React](https://react.dev/) 18.3.1 | User interface |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3.4.17 | Modern CSS |
| Images | [Sharp](https://sharp.pixelplumbing.com/) 0.35 | Image processing |
| Video | [FFmpeg](https://ffmpeg.org/) | Video processing |
| PDF | [pdf-lib](https://pdf-lib.js.org/) 1.17.1 | PDF manipulation |
| Documents | [mammoth](https://github.com/mwilliamson/mammoth.js), [docx](https://docx.js.org/) | Document conversion |

All dependencies are open source, actively maintained, and used by millions of developers.

---

## Build from Source

### Prerequisites

- Node.js 20 or newer (CI uses Node 22)
- FFmpeg is bundled via `@ffmpeg-installer/ffmpeg`, no system install needed

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

The installer will be in `out/make/squirrel.windows/x64/` (Windows). On macOS use `npm run make:mac` (dmg in `dist/`), on Linux `npm run make:linux` (AppImage + deb in `dist/`).

For the full build matrix, code signing and how releases are cut, see [BUILD.md](./BUILD.md).

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
# Windows: Squirrel installer + portable zip -> out/make/
npm run make

# macOS: dmg -> dist/
npm run make:mac

# Linux: AppImage + deb -> dist/
npm run make:linux
```

The same commands run in [`.github/workflows/release.yml`](./.github/workflows/release.yml) on every `v*` tag.
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
├── .github/workflows/    # CI (lint + package) and Release (tag -> draft release)
├── forge.config.js       # Electron Forge config (package / Windows makers)
├── electron-builder.config.js # dmg / AppImage / deb / NSIS wrappers
├── SECURITY.md           # Security documentation
├── BUILD.md              # Build instructions
├── CHANGELOG.md          # Release notes
└── LICENSE               # MIT License
```

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Fortitudo Vincit SRL**

**Version**: 1.0.0 | **Author**: Alex Mantello
