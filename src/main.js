const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Load sharp with proper path for packaged app
let sharp;
try {
  // Try loading from unpacked resources first (packaged app)
  const resourcesPath = process.resourcesPath;
  const sharpPath = path.join(resourcesPath, 'sharp');
  if (fs.existsSync(sharpPath)) {
    sharp = require(sharpPath);
  } else {
    sharp = require('sharp');
  }
} catch (error) {
  console.log('Loading sharp from default location');
  sharp = require('sharp');
}
const { spawn } = require('child_process');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// Handle Squirrel events on Windows
if (process.platform === 'win32') {
  const handleSquirrelEvent = () => {
    if (process.argv.length === 1) {
      return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = (command, args) => {
      let spawnedProcess;
      try {
        spawnedProcess = require('child_process').spawn(command, args, { detached: true });
      } catch (error) {
        console.error('Error spawning process:', error);
      }
      return spawnedProcess;
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
        // Create desktop and start menu shortcuts
        spawn(updateDotExe, ['--createShortcut', exeName]);
        setTimeout(app.quit, 1000);
        return true;

      case '--squirrel-uninstall':
        // Remove desktop and start menu shortcuts
        spawn(updateDotExe, ['--removeShortcut', exeName]);
        setTimeout(app.quit, 1000);
        return true;

      case '--squirrel-obsolete':
        app.quit();
        return true;
    }

    return false;
  };

  if (handleSquirrelEvent()) {
    // Squirrel event handled, exit early
    process.exit(0);
  }
}

// FFmpeg comes from ffmpeg-static (static GPL build downloaded for the host
// platform at npm install time). ffmpeg-static honours FFMPEG_BIN; the packaged
// app always runs the binary it ships with.
if (app.isPackaged) delete process.env.FFMPEG_BIN;
const ffmpegStaticPath = require('ffmpeg-static');
// In the packaged app the binary is unpacked next to app.asar (see
// forge.config.js); a path inside app.asar cannot be spawned.
const ffmpegPath = ffmpegStaticPath
  ? ffmpegStaticPath.replace(`app.asar${path.sep}`, `app.asar.unpacked${path.sep}`)
  : null;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#141414',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: 'default',
    frame: true,
  });

  // The window only ever shows our own bundle. Links that try to open a new
  // window go to the system browser (https only); in-page navigation away from
  // the app is blocked.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalSafe(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) event.preventDefault();
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ============= IPC INPUT VALIDATION =============
// The renderer is our own code, but treat everything it sends as untrusted:
// a renderer compromise (e.g. a malicious file name rendered somewhere) must
// not turn into arbitrary file writes or program execution.

const IMAGE_OUTPUT_FORMATS = ['webp', 'jpg', 'jpeg', 'png', 'avif', 'bmp', 'svg', 'gif', 'tiff'];
const VIDEO_OUTPUT_FORMATS = ['mp4', 'webm', 'avi', 'mkv', 'mov', 'gif'];
const DOC_OUTPUT_FORMATS = ['pdf', 'docx', 'txt'];
const ALLOWED_OUTPUT_FORMATS = new Set([...IMAGE_OUTPUT_FORMATS, ...VIDEO_OUTPUT_FORMATS, ...DOC_OUTPUT_FORMATS]);

function isTrustedSender(event) {
  const url = event.senderFrame && event.senderFrame.url;
  if (!url) return false;
  try {
    const sender = new URL(url);
    const app = new URL(MAIN_WINDOW_WEBPACK_ENTRY);
    // packaged: file:// (origin is the opaque "null"), so compare the file itself
    if (app.protocol === 'file:') return sender.protocol === 'file:' && sender.pathname === app.pathname;
    return sender.origin === app.origin;
  } catch {
    return false;
  }
}

function assertTrustedSender(event) {
  if (!isTrustedSender(event)) throw new Error('Untrusted IPC sender');
}

function requireAbsolutePath(value, what) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\0') || !path.isAbsolute(value)) {
    throw new Error(`Invalid ${what}`);
  }
  return path.resolve(value);
}

function requireExistingFile(value, what = 'input file') {
  const resolved = requireAbsolutePath(value, what);
  let stats;
  try {
    stats = fs.statSync(resolved);
  } catch {
    throw new Error(`${what} does not exist`);
  }
  if (!stats.isFile()) throw new Error(`${what} is not a file`);
  return resolved;
}

function clampQuality(value) {
  const q = Math.round(Number(value));
  if (!Number.isFinite(q)) return 80;
  return Math.min(100, Math.max(1, q));
}

function sanitizeResize(resize) {
  if (!resize || typeof resize !== 'object') return null;
  const dim = (v) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) && n >= 1 && n <= 16384 ? n : null;
  };
  const width = dim(resize.width);
  const height = dim(resize.height);
  if (!width && !height) return null;
  return { width, height, maintainAspectRatio: Boolean(resize.maintainAspectRatio) };
}

// Only web links and mail drafts go to the OS; never file:, smb:, custom
// protocol handlers etc., which can launch local programs.
function openExternalSafe(url) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'mailto:') return false;
  shell.openExternal(parsed.toString());
  return true;
}

// IPC Handlers

ipcMain.handle('open-external', async (event, url) => {
  assertTrustedSender(event);
  return { success: openExternalSafe(url) };
});

ipcMain.handle('open-folder', async (event, folderPath) => {
  assertTrustedSender(event);
  // shell.openPath() on a file would *run* it (e.g. an .exe), so only
  // existing directories are accepted here.
  try {
    const resolved = requireAbsolutePath(folderPath, 'folder');
    if (fs.statSync(resolved).isDirectory()) {
      const error = await shell.openPath(resolved);
      return error ? { success: false, error } : { success: true };
    }
  } catch {
    // fall through
  }
  return { success: false, error: 'Folder does not exist' };
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'] },
      { name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'] },
      { name: 'Documents', extensions: ['pdf', 'docx', 'doc', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('get-file-info', async (event, filePath) => {
  assertTrustedSender(event);
  const resolved = requireExistingFile(filePath, 'file');
  const stats = fs.statSync(resolved);
  return {
    name: path.basename(resolved),
    size: stats.size,
    path: resolved,
    ext: path.extname(resolved).toLowerCase()
  };
});

ipcMain.handle('get-system-info', async () => {
  const os = require('os');

  return {
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    chromiumVersion: process.versions.chrome,
    platform: os.platform(),
    arch: os.arch(),
    osVersion: os.release(),
    ffmpegPath,
    sharpVersion: `libvips ${sharp.versions.vips}`,
  };
});

// ============= IMAGE CONVERSION =============
// sharp/libvips cannot write BMP, so encode a plain 24-bit BMP from raw RGB.
async function writeBmp(sharpInstance, outputPath) {
  const { data, info } = await sharpInstance
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelBytes = rowSize * height;
  const out = Buffer.alloc(54 + pixelBytes);
  out.write('BM', 0, 'ascii');
  out.writeUInt32LE(54 + pixelBytes, 2);
  out.writeUInt32LE(54, 10);
  out.writeUInt32LE(40, 14);
  out.writeInt32LE(width, 18);
  out.writeInt32LE(height, 22); // positive height = bottom-up rows
  out.writeUInt16LE(1, 26);
  out.writeUInt16LE(24, 28);
  out.writeUInt32LE(pixelBytes, 34);
  out.writeInt32LE(2835, 38); // 72 dpi
  out.writeInt32LE(2835, 42);
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * width * 3;
    const dst = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      out[dst + x * 3] = data[src + x * 3 + 2];
      out[dst + x * 3 + 1] = data[src + x * 3 + 1];
      out[dst + x * 3 + 2] = data[src + x * 3];
    }
  }
  fs.writeFileSync(outputPath, out);
}

async function convertImage(inputPath, outputPath, format, quality, resize = null) {
  try {
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const ext = path.extname(inputPath).toLowerCase();

    if (ext === '.svg') {
      if (format === 'svg') {
        fs.copyFileSync(inputPath, outputPath);
        return { success: true };
      }
      const svgBuffer = fs.readFileSync(inputPath);
      let sharpInstance = sharp(svgBuffer, { density: 300 });

      // Apply resize if enabled
      if (resize && (resize.width || resize.height)) {
        const resizeOptions = {
          width: resize.width || null,
          height: resize.height || null,
          fit: resize.maintainAspectRatio ? 'inside' : 'fill'
        };
        sharpInstance = sharpInstance.resize(resizeOptions);
      }

      switch (format.toLowerCase()) {
        case 'png':
          await sharpInstance.png({ quality }).toFile(outputPath);
          break;
        case 'jpg':
        case 'jpeg':
          await sharpInstance.jpeg({ quality }).toFile(outputPath);
          break;
        case 'webp':
          await sharpInstance.webp({ quality }).toFile(outputPath);
          break;
        case 'bmp':
          await writeBmp(sharpInstance, outputPath);
          break;
        default:
          await sharpInstance.toFile(outputPath);
      }
      return { success: true };
    }

    let sharpInstance = sharp(inputPath);

    // Apply resize if enabled
    if (resize && (resize.width || resize.height)) {
      const resizeOptions = {
        width: resize.width || null,
        height: resize.height || null,
        fit: resize.maintainAspectRatio ? 'inside' : 'fill'
      };
      sharpInstance = sharpInstance.resize(resizeOptions);
    }

    switch (format.toLowerCase()) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
      case 'jpg':
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({
          compressionLevel: Math.floor((100 - quality) / 10),
          quality
        });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality });
        break;
      case 'bmp':
        await writeBmp(sharpInstance, outputPath);
        return { success: true };
      case 'gif':
        sharpInstance = sharpInstance.gif();
        break;
      case 'tiff':
        sharpInstance = sharpInstance.tiff({ quality });
        break;
      case 'svg':
        throw new Error('Cannot convert raster images (PNG, JPG, etc.) to vector SVG format. SVG can only be created from vector sources or through manual tracing.');
      default:
        throw new Error(`Unsupported image format: ${format}`);
    }

    await sharpInstance.toFile(outputPath);
    return { success: true };
  } catch (error) {
    console.error('Image conversion error:', error);
    throw error;
  }
}

// ============= VIDEO CONVERSION =============
// ffmpeg is spawned directly (argument array, no shell). Input files are
// untrusted, so the demuxers and protocols ffmpeg may use are restricted to
// the container formats the app accepts: a renamed HLS playlist or concat list
// cannot make ffmpeg open URLs or other local files.
const FFMPEG_INPUT_FORMATS = 'mov,mp4,matroska,webm,avi,flv,asf';

// ffmpeg processes that are still running, so they can be cancelled
const activeFfmpeg = new Set();

function videoCodecArgs(format, quality) {
  const crf = Math.round(51 - (quality / 100) * 51);
  const preset = 'veryfast';
  const threads = '0'; // 0 = auto-detect CPU cores

  switch (format) {
    case 'mp4':
    case 'mkv':
    case 'mov':
      return ['-c:v', 'libx264', '-crf', String(crf), '-preset', preset, '-threads', threads,
        '-c:a', 'aac', '-b:a', '128k'];
    case 'webm':
      return ['-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-threads', threads,
        '-speed', '4', '-c:a', 'libopus', '-b:a', '128k'];
    case 'avi':
      return ['-c:v', 'mpeg4', '-q:v', String(Math.round((100 - quality) / 10) + 1), '-threads', threads,
        '-c:a', 'libmp3lame', '-b:a', '128k'];
    case 'gif':
      return ['-vf', 'fps=15,scale=480:-1:flags=lanczos', '-c:v', 'gif'];
    default:
      return null;
  }
}

function parseTimestamp(h, m, s) {
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

function convertVideo(inputPath, outputPath, format, quality, onProgress) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) return reject(new Error('FFmpeg is not available for this platform'));
    const codecArgs = videoCodecArgs(format.toLowerCase(), quality);
    if (!codecArgs) return reject(new Error(`Unsupported video format: ${format}`));

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const args = [
      '-hide_banner', '-nostdin', '-nostats', '-y',
      '-protocol_whitelist', 'file',
      '-format_whitelist', FFMPEG_INPUT_FORMATS,
      // file: keeps names like "C:\..." or "x:y" from being read as protocols
      '-i', `file:${inputPath}`,
      ...codecArgs,
      '-progress', 'pipe:1',
      `file:${outputPath}`,
    ];

    const child = spawn(ffmpegPath, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    activeFfmpeg.add(child);

    let durationSec = 0;
    let lastPercent = -1;
    let stderrTail = '';
    let stdoutBuf = '';

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => {
      stderrTail = (stderrTail + chunk).slice(-4000);
      if (!durationSec) {
        const m = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(stderrTail);
        if (m) durationSec = parseTimestamp(m[1], m[2], m[3]);
      }
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdoutBuf += chunk;
      const lines = stdoutBuf.split('\n');
      stdoutBuf = lines.pop();
      for (const line of lines) {
        const [key, value] = line.trim().split('=');
        if (key === 'out_time_us' && durationSec > 0) {
          const us = Number(value);
          if (!Number.isFinite(us) || us < 0) continue;
          const percent = Math.min(99, Math.floor((us / 1e6 / durationSec) * 100));
          if (percent !== lastPercent) {
            lastPercent = percent;
            if (onProgress) onProgress(percent);
          }
        }
      }
    });

    child.on('error', (err) => {
      activeFfmpeg.delete(child);
      reject(err);
    });

    child.on('close', (code, signal) => {
      activeFfmpeg.delete(child);
      if (child.cancelled) {
        fs.rm(outputPath, { force: true }, () => {});
        const err = new Error('Conversion cancelled');
        err.cancelled = true;
        return reject(err);
      }
      if (code === 0) {
        if (onProgress) onProgress(100);
        return resolve({ success: true });
      }
      fs.rm(outputPath, { force: true }, () => {});
      const lastLines = stderrTail.trim().split('\n').slice(-3).join('\n');
      reject(new Error(`ffmpeg exited with ${signal || `code ${code}`}: ${lastLines}`));
    });
  });
}

function cancelAllFfmpeg() {
  let count = 0;
  for (const child of activeFfmpeg) {
    child.cancelled = true;
    child.kill('SIGKILL');
    count++;
  }
  return count;
}

ipcMain.handle('cancel-conversion', async (event) => {
  assertTrustedSender(event);
  return { cancelled: cancelAllFfmpeg() };
});

app.on('before-quit', cancelAllFfmpeg);

// ============= PDF CONVERSIONS =============
async function convertPdfToDocx(inputPath, outputPath) {
  try {
    const pdfBytes = fs.readFileSync(inputPath);

    // Extract text from PDF using pdf-parse (v2, current pdf.js)
    const parser = new PDFParse({ data: pdfBytes });
    let extractedText;
    try {
      const result = await parser.getText({ pageJoiner: '' });
      extractedText = result.text.trim() || 'No text could be extracted from this PDF';
    } finally {
      await parser.destroy();
    }

    // Create DOCX with extracted text
    const paragraphs = extractedText.split('\n\n').map(para =>
      new Paragraph({
        children: [new TextRun({ text: para.trim() })],
        spacing: { after: 200 }
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    return { success: true };
  } catch (error) {
    throw new Error(`PDF to DOCX conversion failed: ${error.message}`, { cause: error });
  }
}

// Lay plain text out on A4 pages. Wraps long lines instead of cutting them,
// starts a new page when the current one is full, and replaces characters the
// standard Helvetica font cannot encode (WinAnsi) instead of throwing.
async function textToPdf(text, outputPath) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const encodable = new Set(font.getCharacterSet());
  const fontSize = 12;
  const lineHeight = 20;
  const margin = 50;
  const pageSize = [595, 842];
  const maxWidth = pageSize[0] - 2 * margin;

  const clean = (line) => Array.from(line.replace(/\t/g, '    '))
    .map((ch) => (encodable.has(ch.codePointAt(0)) ? ch : '?'))
    .join('');

  const wrap = (line) => {
    const out = [];
    let current = '';
    for (const word of line.split(/(\s+)/)) {
      const candidate = current + word;
      if (current && font.widthOfTextAtSize(candidate, fontSize) > maxWidth) {
        out.push(current.trimEnd());
        current = word.trimStart();
      } else {
        current = candidate;
      }
      // a single word wider than the page: hard-break it
      while (font.widthOfTextAtSize(current, fontSize) > maxWidth && current.length > 1) {
        let cut = current.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(current.slice(0, cut), fontSize) > maxWidth) cut--;
        out.push(current.slice(0, cut));
        current = current.slice(cut);
      }
    }
    out.push(current);
    return out;
  };

  let page = pdfDoc.addPage(pageSize);
  let yPosition = page.getSize().height - margin;

  for (const rawLine of text.split(/\r\n|\r|\n/)) {
    for (const line of wrap(clean(rawLine))) {
      if (yPosition < margin) {
        page = pdfDoc.addPage(pageSize);
        yPosition = page.getSize().height - margin;
      }
      if (line) {
        page.drawText(line, { x: margin, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
      }
      yPosition -= lineHeight;
    }
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

async function convertDocxToPdf(inputPath, outputPath) {
  try {
    const result = await mammoth.extractRawText({ path: inputPath });
    await textToPdf(result.value, outputPath);
    return { success: true };
  } catch (error) {
    throw new Error(`DOCX to PDF conversion failed: ${error.message}`, { cause: error });
  }
}

async function convertTxtToPdf(inputPath, outputPath) {
  try {
    const text = fs.readFileSync(inputPath, 'utf8');
    await textToPdf(text, outputPath);
    return { success: true };
  } catch (error) {
    throw new Error(`TXT to PDF conversion failed: ${error.message}`, { cause: error });
  }
}

// ============= PDF SPLIT =============
async function splitPdf(inputPath, outputFolder, pagesPerSplit) {
  try {
    pagesPerSplit = Number(pagesPerSplit);
    if (!Number.isInteger(pagesPerSplit) || pagesPerSplit < 1) {
      // 0 / NaN would make the loop below never advance
      throw new Error('Pages per part must be a whole number of at least 1');
    }
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const baseName = path.basename(inputPath, '.pdf');
    const results = [];

    let partNumber = 1;
    for (let startPage = 0; startPage < totalPages; startPage += pagesPerSplit) {
      const endPage = Math.min(startPage + pagesPerSplit, totalPages);

      // Create a new PDF for this part
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc,
        Array.from({ length: endPage - startPage }, (_, i) => startPage + i)
      );

      pages.forEach(page => newPdf.addPage(page));

      const outputPath = path.join(outputFolder, `${baseName}_part${partNumber}.pdf`);
      const newPdfBytes = await newPdf.save();
      fs.writeFileSync(outputPath, newPdfBytes);

      results.push({
        part: partNumber,
        pages: `${startPage + 1}-${endPage}`,
        path: outputPath
      });

      partNumber++;
    }

    return {
      success: true,
      totalPages,
      partsCreated: results.length,
      parts: results
    };
  } catch (error) {
    console.error('PDF split error:', error);
    throw new Error(`PDF split failed: ${error.message}`, { cause: error });
  }
}

// Get PDF page count
async function getPdfPageCount(inputPath) {
  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return { success: true, pageCount: pdfDoc.getPageCount() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============= MAIN CONVERSION HANDLER =============
ipcMain.handle('convert-file', async (event, options) => {
  try {
    assertTrustedSender(event);
    if (!options || typeof options !== 'object') throw new Error('Invalid options');
    const inputPath = requireExistingFile(options.inputPath);
    const outputFolder = requireAbsolutePath(options.outputFolder, 'output folder');
    const format = String(options.format || '').toLowerCase();
    // The format ends up in the output file name: a whitelist keeps values
    // like "../../x" from writing outside the chosen folder.
    if (!ALLOWED_OUTPUT_FORMATS.has(format)) throw new Error(`Unsupported output format: ${format}`);
    const quality = clampQuality(options.quality);
    const resize = sanitizeResize(options.resize);

    const baseName = path.basename(inputPath, path.extname(inputPath));
    let outputPath = path.join(outputFolder, `${baseName}.${format}`);
    // Same folder + same format (e.g. JPG -> JPG to compress/resize): never
    // write over the source file. sharp refuses it and ffmpeg would truncate
    // the input it is still reading.
    if (path.resolve(outputPath).toLowerCase() === path.resolve(inputPath).toLowerCase()) {
      outputPath = path.join(outputFolder, `${baseName}_converted.${format}`);
    }
    const ext = path.extname(inputPath).toLowerCase();

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.svg'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv'];
    const docExtensions = ['.pdf', '.docx', '.doc', '.txt'];

    if (imageExtensions.includes(ext)) {
      await convertImage(inputPath, outputPath, format, quality, resize);
      const stats = fs.statSync(outputPath);
      return { success: true, outputPath, outputSize: stats.size };
    } 
    else if (videoExtensions.includes(ext)) {
      const sender = event.sender;
      await convertVideo(inputPath, outputPath, format, quality, (percent) => {
        if (!sender.isDestroyed()) sender.send('conversion-progress', { inputPath, percent });
      });
      const stats = fs.statSync(outputPath);
      return { success: true, outputPath, outputSize: stats.size };
    }
    else if (docExtensions.includes(ext)) {
      if (ext === '.pdf' && format === 'docx') await convertPdfToDocx(inputPath, outputPath);
      else if (ext === '.docx' && format === 'pdf') await convertDocxToPdf(inputPath, outputPath);
      else if (ext === '.txt' && format === 'pdf') await convertTxtToPdf(inputPath, outputPath);
      else return { success: false, error: `Conversion from ${ext} to ${format} not supported` };
      
      const stats = fs.statSync(outputPath);
      return { success: true, outputPath, outputSize: stats.size };
    }
    else {
      return { success: false, error: 'Unsupported file type' };
    }
  } catch (error) {
    if (error.cancelled) return { success: false, cancelled: true, error: 'Cancelled' };
    console.error('Conversion error:', error);
    return { success: false, error: error.message || 'Conversion failed' };
  }
});

// ============= PDF SPLIT HANDLERS =============
ipcMain.handle('split-pdf', async (event, options) => {
  try {
    assertTrustedSender(event);
    if (!options || typeof options !== 'object') throw new Error('Invalid options');
    const inputPath = requireExistingFile(options.inputPath, 'PDF file');
    const outputFolder = requireAbsolutePath(options.outputFolder, 'output folder');
    const result = await splitPdf(inputPath, outputFolder, options.pagesPerSplit);
    return result;
  } catch (error) {
    console.error('PDF split error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-pdf-page-count', async (event, filePath) => {
  try {
    assertTrustedSender(event);
    return await getPdfPageCount(requireExistingFile(filePath, 'PDF file'));
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-pdf-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  });
  return result.filePaths[0];
});