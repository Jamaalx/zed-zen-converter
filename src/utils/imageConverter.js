import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function convertImage(inputPath, outputPath, format, quality) {
  try {
    const outputDir = path.dirname(outputPath);
    
    // Creează directorul dacă nu există
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let sharpInstance = sharp(inputPath);

    // Configurează conversie bazată pe format
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
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    await sharpInstance.toFile(outputPath);
    return { success: true };
  } catch (error) {
    console.error('Conversion error:', error);
    return { success: false, error: error.message };
  }
}

export function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'].includes(ext);
}