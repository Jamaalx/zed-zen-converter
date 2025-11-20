const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const { PDFDocument, rgb } = require('pdf-lib');
const mammoth = require('mammoth');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

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
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    frame: true,
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

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

// IPC Handlers

ipcMain.handle('open-folder', async (event, folderPath) => {
  if (folderPath && fs.existsSync(folderPath)) {
    shell.openPath(folderPath);
    return { success: true };
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
  const stats = fs.statSync(filePath);
  return {
    name: path.basename(filePath),
    size: stats.size,
    path: filePath,
    ext: path.extname(filePath).toLowerCase()
  };
});

// ============= IMAGE CONVERSION =============
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
        sharpInstance = sharpInstance.toFormat('bmp');
        break;
      case 'svg':
        throw new Error('Cannot convert raster image to SVG');
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
function convertVideo(inputPath, outputPath, format, quality) {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const crf = Math.round(51 - (quality / 100) * 51);

    let command = ffmpeg(inputPath);

    switch (format.toLowerCase()) {
      case 'mp4':
        command = command.outputOptions(['-c:v libx264', `-crf ${crf}`, '-preset medium', '-c:a aac', '-b:a 128k']);
        break;
      case 'webm':
        command = command.outputOptions(['-c:v libvpx-vp9', `-crf ${crf}`, '-b:v 0', '-c:a libopus', '-b:a 128k']);
        break;
      case 'avi':
        command = command.outputOptions(['-c:v mpeg4', `-q:v ${Math.round((100 - quality) / 10) + 1}`, '-c:a mp3', '-b:a 128k']);
        break;
      case 'mkv':
        command = command.outputOptions(['-c:v libx264', `-crf ${crf}`, '-preset medium', '-c:a aac', '-b:a 128k']);
        break;
      case 'mov':
        command = command.outputOptions(['-c:v libx264', `-crf ${crf}`, '-preset medium', '-c:a aac', '-b:a 128k']);
        break;
      case 'gif':
        command = command.outputOptions(['-vf fps=15,scale=480:-1:flags=lanczos', '-c:v gif']);
        break;
      default:
        return reject(new Error(`Unsupported video format: ${format}`));
    }

    command
      .output(outputPath)
      .on('end', () => resolve({ success: true }))
      .on('error', (err) => reject(err))
      .run();
  });
}

// ============= PDF CONVERSIONS =============
async function convertPdfToDocx(inputPath, outputPath) {
  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    let fullText = `Converted from PDF: ${path.basename(inputPath)}\n\n`;
    fullText += `[PDF has ${pages.length} pages - text extraction limited]\n\n`;
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [new Paragraph({ children: [new TextRun({ text: fullText, size: 24 })] })],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    return { success: true };
  } catch (error) {
    throw new Error(`PDF to DOCX conversion failed: ${error.message}`);
  }
}

async function convertDocxToPdf(inputPath, outputPath) {
  try {
    const result = await mammoth.extractRawText({ path: inputPath });
    const text = result.value;
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { height } = page.getSize();
    
    const lines = text.split('\n');
    let yPosition = height - 50;
    
    for (const line of lines) {
      if (yPosition < 50) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = newPage.getSize().height - 50;
      }
      
      page.drawText(line.substring(0, 80), {
        x: 50,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 20;
    }
    
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    return { success: true };
  } catch (error) {
    throw new Error(`DOCX to PDF conversion failed: ${error.message}`);
  }
}

async function convertTxtToPdf(inputPath, outputPath) {
  try {
    const text = fs.readFileSync(inputPath, 'utf8');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { height } = page.getSize();
    
    const lines = text.split('\n');
    let yPosition = height - 50;
    
    for (const line of lines) {
      if (yPosition < 50) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = newPage.getSize().height - 50;
      }
      
      page.drawText(line.substring(0, 80), { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
      yPosition -= 20;
    }
    
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    return { success: true };
  } catch (error) {
    throw new Error(`TXT to PDF conversion failed: ${error.message}`);
  }
}

// ============= MAIN CONVERSION HANDLER =============
ipcMain.handle('convert-file', async (event, options) => {
  const { inputPath, outputFolder, format, quality, resize } = options;

  try {
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputFolder, `${baseName}.${format}`);
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
      await convertVideo(inputPath, outputPath, format, quality);
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
    console.error('Conversion error:', error);
    return { success: false, error: error.message || 'Conversion failed' };
  }
});