/**
 * Generate installer assets for NSIS installer
 * Run this before building the installer: node scripts/generate-installer-assets.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIDEBAR_WIDTH = 164;
const SIDEBAR_HEIGHT = 314;
const PURPLE_COLOR = { r: 127, g: 90, b: 240 }; // ZED-ZEN purple

async function generateInstallerSidebar() {
  const outputDir = path.join(__dirname, '..', 'build-resources');
  const logoPath = path.join(__dirname, '..', 'src', 'assets', 'logo.png');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Create a purple background with the logo (PNG format - will be converted)
    const logoBuffer = await sharp(logoPath)
      .resize(120, 120, { fit: 'contain', background: { r: 127, g: 90, b: 240, alpha: 1 } })
      .toBuffer();

    // Create sidebar with purple background and centered logo as PNG
    await sharp({
      create: {
        width: SIDEBAR_WIDTH,
        height: SIDEBAR_HEIGHT,
        channels: 3,
        background: PURPLE_COLOR
      }
    })
      .composite([
        {
          input: logoBuffer,
          top: 40,
          left: Math.floor((SIDEBAR_WIDTH - 120) / 2)
        }
      ])
      .png()
      .toFile(path.join(outputDir, 'installerSidebar.png'));

    console.log('Generated installerSidebar.png');

    // Copy as uninstaller sidebar too
    fs.copyFileSync(
      path.join(outputDir, 'installerSidebar.png'),
      path.join(outputDir, 'uninstallerSidebar.png')
    );

    console.log('Generated uninstallerSidebar.png');
    console.log('\nInstaller assets generated successfully!');
    console.log('Note: NSIS will use default sidebar styling (PNG sidebars not directly supported)');

  } catch (error) {
    console.error('Error generating installer assets:', error.message);
    console.log('Continuing without custom sidebar images...');
  }
}

generateInstallerSidebar();
