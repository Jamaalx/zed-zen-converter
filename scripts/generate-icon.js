/**
 * Generate icon.ico from logo.png
 * Run: node scripts/generate-icon.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const toIco = require('to-ico');

const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256];

async function generateIcon() {
  const logoPath = path.join(__dirname, '..', 'src', 'assets', 'logo.png');
  const outputDir = path.join(__dirname, '..', 'assets');
  const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating icon from logo.png...');

  try {
    // Generate PNG files for each size
    const pngBuffers = await Promise.all(
      ICON_SIZES.map(async (size) => {
        const buffer = await sharp(logoPath)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 127, g: 90, b: 240, alpha: 1 }
          })
          .png()
          .toBuffer();

        console.log(`  Generated ${size}x${size} PNG`);
        return buffer;
      })
    );

    // Convert to ICO
    const icoBuffer = await toIco(pngBuffers);

    // Save to assets folder
    fs.writeFileSync(path.join(outputDir, 'icon.ico'), icoBuffer);
    console.log('Saved assets/icon.ico');

    // Also save to src/assets for consistency
    fs.writeFileSync(path.join(srcAssetsDir, 'icon.ico'), icoBuffer);
    console.log('Saved src/assets/icon.ico');

    // Generate icon.png (256x256) for other uses
    await sharp(logoPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 127, g: 90, b: 240, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon.png'));
    console.log('Saved assets/icon.png');

    console.log('\nIcon generation complete!');

  } catch (error) {
    console.error('Error generating icon:', error);
    process.exit(1);
  }
}

generateIcon();
