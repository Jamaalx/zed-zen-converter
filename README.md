# ZED-ZEN Media Converter

Professional media conversion tool powered by FFmpeg and Sharp.

## Features

- ✅ Image Conversion (JPG, PNG, WebP, AVIF, BMP)
- ✅ Video Conversion (MP4, AVI, WebM, MKV)
- ✅ Drag & Drop Interface
- ✅ Batch Processing
- ✅ Quality Control
- ✅ Quick Presets for Restaurants
- ✅ Modern UI with ZedZen Branding

## Setup

### Prerequisites

- Node.js (v18 or higher)
- FFmpeg installed on your system

### Installation

```bash
# Install dependencies
npm install

# Start development
npm start

# Build for production
npm run make
```

## Usage

1. **Add Files**: Drag and drop files or click to browse
2. **Select Format**: Choose output format (WebP, JPG, PNG, etc.)
3. **Adjust Quality**: Use slider for quality settings
4. **Select Output Folder**: Choose where to save converted files
5. **Convert**: Click the convert button

## Quick Presets

- **Restaurant Menu**: WebP @ 85% quality - Perfect for menu photos
- **Delivery App**: WebP @ 75% quality - Optimized for delivery platforms

## Building Installer

```bash
# Create Windows installer
npm run make
```

The installer will be in the `out/make/squirrel.windows/x64/` folder.

## Tech Stack

- Electron
- React
- Tailwind CSS
- FFmpeg
- Sharp

## License

MIT © ZED-ZEN / Fortitudo Vincit SRL

---

**Version**: 1.0.0  
**Author**: Alex Damian  
**Company**: Fortitudo Vincit SRL
