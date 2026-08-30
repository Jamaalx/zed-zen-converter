# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions **CI** (`.github/workflows/ci.yml`): lint, `electron-forge package` on Linux, 20 s boot smoke test under Xvfb, packaged app uploaded as a 7-day artifact.
- GitHub Actions **Release** (`.github/workflows/release.yml`): on every `v*` tag builds Windows (Squirrel installer + zip), macOS arm64 (dmg) and Linux (AppImage + deb) and attaches them to a **draft** GitHub Release; can also be run manually.
- Dependabot for npm (weekly, grouped, Electron majors ignored) and GitHub Actions.
- ESLint 9 flat config (`eslint.config.js`) so `npm run lint` actually runs.
- `scripts/dist.js`: `electron-forge package` followed by `electron-builder --prepackaged` for the current platform/arch (used by `make:mac`, `make:linux`, `dist`).
- "Download" section in the README and a CI/release chapter in BUILD.md (builds are unsigned).
- This changelog.

### Changed
- **Electron 32.2.5 -> 44.0.0** (32 has been end-of-life since early 2025).
- **sharp 0.33.5 -> 0.35.4** (libvips security fixes).
- Electron Forge 7.5/7.10 -> 7.11, `@electron/rebuild` 3 -> 4, electron-builder 25 -> 26, electron-winstaller 5.4.4, webpack-dev-server 5 -> 6.
- `make:mac` / `make:linux` now package with Forge first (they used to call electron-builder on a tree without `.webpack/` and failed).
- `npm run generate-icon` writes a 512x512 `assets/icon.png` (electron-builder needs >= 512 px for dmg/AppImage icons); generated icons are git-ignored.
- `to-ico` replaced by `png-to-ico` in `scripts/generate-icon.js` (to-ico dragged in the abandoned `request`/`jimp 0.2` chain).
- `.deb` maintainer set in `electron-builder.config.js` (required by electron-builder).

### Removed
- Unused `vite` and `@vitejs/plugin-react` dev dependencies (the app is built with Forge's webpack plugin).
- `make:all` script (cross-platform builds cannot use `--prepackaged`; the release workflow builds per OS instead).

### Security
- `npm audit`: **84 advisories (8 critical, 57 high) -> 0**. Root causes were node-tar, tmp, extract-zip, webpack-dev-server, the `request`/`form-data`/`minimist` chain under `to-ico`, Electron 32 itself and sharp 0.33; fixed via upgrades and `overrides` in `package.json` (tar, tmp, webpack-dev-server, sockjs>uuid, extract-zip -> `@electron-internal/extract-zip`).

## [1.0.0] - 2025-12-16

Initial public state of the repository (Electron 32.2.5, React 18, sharp 0.33.5).

### Added
- Image conversion (JPG, PNG, WebP, AVIF, BMP, SVG) via sharp.
- Video conversion (MP4, AVI, WebM, MKV, MOV, GIF) via FFmpeg (`@ffmpeg-installer/ffmpeg` + fluent-ffmpeg).
- Document conversion (PDF, DOCX, TXT) via pdf-lib, pdf-parse, mammoth and docx.
- PDF split.
- Drag & drop, batch processing, quality slider, presets for restaurant/delivery/social/archive.
- Windows Squirrel installer and portable zip via Electron Forge; NSIS/dmg/AppImage configs via electron-builder.
- SECURITY.md and BUILD.md (code signing guide, in Romanian).

[Unreleased]: https://github.com/Jamaalx/zed-zen-converter/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Jamaalx/zed-zen-converter/releases/tag/v1.0.0
