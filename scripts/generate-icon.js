/**
 * Generate icon.ico from logo.png
 * Run: node scripts/generate-icon.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const toIco = require('to-ico');

const ICON_SIZES = [16, 24, 32, 48, 64, 72, 96, 128, 256, 512];

async function generateIcon() {
  const logoPath = path.join(__dirname, '..', 'src', 'assets', 'logo.png');
  const outputDir = path.join(__dirname, '..', 'assets');
  const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');
  const iconsDir = path.join(outputDir, 'icons');

  // Ensure output directories exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('Generating icons from logo.png...');

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

        // Save individual PNG files
        const pngPath = path.join(iconsDir, `icon-${size}.png`);
        fs.writeFileSync(pngPath, buffer);
        console.log(`  Generated ${size}x${size} PNG -> assets/icons/icon-${size}.png`);

        return buffer;
      })
    );

    // Convert to ICO (only sizes up to 256 for ICO format)
    const icoSizes = ICON_SIZES.filter(s => s <= 256);
    const icoBuffers = pngBuffers.slice(0, icoSizes.length);
    const icoBuffer = await toIco(icoBuffers);

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

    console.log('\n✅ Icon generation complete!');
    console.log(`Generated ${ICON_SIZES.length} PNG icons in assets/icons/`);

  } catch (error) {
    console.error('Error generating icon:', error);
    process.exit(1);
  }
}

generateIcon();
