# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed (2026-11-01, lint)
- ESLint 9 -> 10. `eslint-plugin-react` (peer range stops at ESLint 9) replaced by `@eslint-react/eslint-plugin` 5 (recommended preset plus `dom-no-unknown-property`, `dom-no-unsafe-target-blank`, `no-missing-component-display-name`); ESLint 10 tracks JSX references itself, which replaces `jsx-uses-vars`/`jsx-no-undef`. Config is now `eslint.config.mjs`. This also fixes `npm ci` on `main`, which failed with ERESOLVE after Dependabot bumped `@eslint/js` to 10 while `eslint` was held on 9.
- Rethrown conversion errors keep the original error as `cause` (`preserve-caught-error`, new in `@eslint/js` 10).

### Security (2026-11-01)
- IPC hardening: `openExternal` goes through the main process and only opens `https:`/`mailto:` URLs; `open-folder` only opens directories (`shell.openPath` on a file runs it); conversion/split handlers require absolute paths to existing files, whitelist the output format (it was used in the output file name, allowing `../` paths) and clamp quality/resize; privileged handlers check the sender frame.
- `BrowserWindow`: `sandbox`/`webSecurity` explicit, `window.open` denied (links go to the system browser), navigation away from the app blocked.
- Packaged builds no longer contain the `.env` file (with an npm token) that `@ffmpeg-installer/ffmpeg` publishes.
- Electron 44.4.5 -> 44.10.1 (eMudhra intermediate certificates, pointer-lock permission frame attribution), sharp 0.35.5 (librsvg CVE), lockfile refresh for fast-uri, undici, launch-editor, shell-quote, source-map-js, body-parser, qs, ip-address, postcss-selector-parser.

### Fixed (2026-11-01)
- Video conversion never worked in the packaged app: the ffmpeg binary was inside `app.asar` and could not be spawned; it is now asar-unpacked.
- Drag & drop added no files since Electron 32 (`File.path` removed); uses `webUtils.getPathForFile()`.
- BMP output always failed (libvips has no BMP writer); BMP is now encoded directly. Compress mode works for GIF and TIFF.
- PDF -> DOCX failed with "Invalid PDF structure" on PDFs with compressed object streams (pdf-parse 1.x bundled pdf.js 1.10); now pdf-parse 2.
- Release workflow: Windows job generates the icon, and one `release` job attaches all artifacts (the 2026-09-24 entry below described this, but it had not been committed).

### Changed (2026-11-01)
- React 19.3, Babel 8, Electron Forge 8 (`main` is `.webpack/main/index.cjs`, `@electron/fuses` 2), pdf-parse 2.4, mammoth 1.13, electron-builder 26.18, webpack-dev-server 6.1.
- GitHub Actions: checkout v7, setup-node v7, upload-artifact v7, download-artifact v8, action-gh-release v3.0.3.

### Removed (2026-11-01)
- Unused dependencies `@electron/remote`, `officegen`, `pdf2pic`.

### Fixed (2026-09-24)
- TXT/DOCX -> PDF: text after the first page was drawn over page 1 and the extra pages stayed blank; lines were cut at 80 characters; any character outside WinAnsi (e.g. Romanian `ș`/`ț`) made the conversion fail. Now wraps, paginates and substitutes unencodable characters.
- Converting into the source folder with the same format no longer targets the input file itself (writes `<name>_converted.<ext>`).
- PDF split: `pagesPerSplit` of 0/NaN no longer hangs the main process; missing output folder is created.
- Release workflow: Windows job generates the (git-ignored) icon before `npm run make`; a single `release` job attaches all artifacts so the matrix jobs cannot create duplicate draft releases.

### Changed (2026-09-24)
- Electron 44.0.0 -> 44.4.5; patch/minor refresh of the lockfile (`npm audit`: 4 -> 0 - postcss-selector-parser, qs).
- `docx` held at `~9.5.3` (9.6+ cannot be bundled by webpack); Dependabot ignores `docx >= 9.6` and runs monthly.

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
