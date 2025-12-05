const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

// ============================================================================
// CODE SIGNING CONFIGURATION
// Pentru a elimina avertismentele de virus, trebuie să semnezi aplicația!
//
// OPȚIUNI:
// 1. Certificat EV Code Signing (~300-500€/an) - Recomandat
//    - DigiCert, Sectigo, GlobalSign
//    - Elimină COMPLET avertismentele SmartScreen
//
// 2. Certificat OV Code Signing (~100-200€/an)
//    - Mai ieftin, dar necesită "reputație" (mai multe instalări)
//
// SETUP:
// 1. Cumpără certificat de la DigiCert/Sectigo
// 2. Setează variabilele de mediu:
//    - WINDOWS_CERTIFICATE_FILE = calea către fișierul .pfx
//    - WINDOWS_CERTIFICATE_PASSWORD = parola certificatului
//
// SAU pentru certificat pe USB token (EV):
//    - CSC_LINK = calea către certificat
//    - CSC_KEY_PASSWORD = parola
// ============================================================================

const isCodeSigningEnabled = process.env.WINDOWS_CERTIFICATE_FILE && process.env.WINDOWS_CERTIFICATE_PASSWORD;

module.exports = {
  packagerConfig: {
    asar: true, // ASAR activat pentru securitate mai bună
    name: 'ZED-ZEN Media Converter',
    executableName: 'ZedZen-Converter',
    icon: './src/assets/icon',
    // Code signing pentru Windows
    ...(isCodeSigningEnabled && {
      windowsSign: {
        certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
        certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
      }
    }),
    // Informații despre companie (ajută la reputație)
    appCopyright: 'Copyright © 2024 Fortitudo Vincit SRL',
    appVersion: '1.0.0',
    win32metadata: {
      CompanyName: 'Fortitudo Vincit SRL',
      FileDescription: 'ZED-ZEN Media Converter - Professional media conversion tool',
      ProductName: 'ZED-ZEN Media Converter',
      OriginalFilename: 'ZedZen-Converter.exe',
    },
  },
  rebuildConfig: {
    onlyModules: ['sharp']
  },
  hooks: {
    packageAfterCopy: async (config, buildPath) => {
      const fs = require('fs');

      console.log('Copying Sharp, FFmpeg, and PDF dependencies...');

      // Also copy ffmpeg and pdf-parse dependencies explicitly
      const criticalModules = ['sharp', '@ffmpeg-installer', 'pdf-parse'];

      // Function to recursively get all dependencies from package.json
      const getAllDependencies = (moduleName, visited = new Set()) => {
        if (visited.has(moduleName)) return visited;
        visited.add(moduleName);

        const pkgPath = path.join(__dirname, 'node_modules', moduleName, 'package.json');
        if (!fs.existsSync(pkgPath)) return visited;

        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          const deps = {
            ...pkg.dependencies,
            ...pkg.optionalDependencies
          };

          for (const dep in deps) {
            getAllDependencies(dep, visited);
          }
        } catch (err) {
          console.log(`⚠ Error reading ${moduleName}/package.json:`, err.message);
        }

        return visited;
      };

      // Get all dependencies for critical modules
      const allModules = new Set();
      for (const moduleName of criticalModules) {
        const deps = getAllDependencies(moduleName);
        deps.forEach(dep => allModules.add(dep));
      }

      console.log(`Found ${allModules.size} modules to copy`);

      // Copy all modules
      let copiedCount = 0;
      for (const moduleName of allModules) {
        const srcModule = path.join(__dirname, 'node_modules', moduleName);
        const destModule = path.join(buildPath, 'node_modules', moduleName);

        if (fs.existsSync(srcModule)) {
          fs.cpSync(srcModule, destModule, { recursive: true });
          copiedCount++;
        }
      }

      console.log(`✓ Copied ${copiedCount} modules for Sharp`);
    }
  },
  makers: [
    // NSIS Installer - Mai bine recunoscut de antivirusuri
    {
      name: '@electron-forge/maker-nsis',
      config: {
        name: 'ZedZenConverter',
        displayName: 'ZED-ZEN Media Converter',
        // Icon pentru installer
        installerIcon: './src/assets/icon.ico',
        uninstallerIcon: './src/assets/icon.ico',
        // Opțiuni instalare
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        // License
        license: './LICENSE',
        // Code signing (dacă e configurat)
        ...(isCodeSigningEnabled && {
          signWithParams: `/f "${process.env.WINDOWS_CERTIFICATE_FILE}" /p "${process.env.WINDOWS_CERTIFICATE_PASSWORD}" /tr http://timestamp.digicert.com /td sha256 /fd sha256`,
        }),
      },
    },
    // Squirrel - Backup/alternativă
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ZedZenConverter',
        authors: 'Fortitudo Vincit SRL',
        description: 'Free media converter for images, videos, and documents',
        setupExe: 'ZedZen-Media-Converter-Setup.exe',
        setupIcon: './src/assets/icon.ico',
        // Code signing pentru Squirrel
        ...(isCodeSigningEnabled && {
          certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
          certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
          signWithParams: '/tr http://timestamp.digicert.com /td sha256 /fd sha256',
        }),
      },
    },
    // ZIP pentru distribuție manuală
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
        renderer: {
          config: './webpack.renderer.config.js',
          nodeIntegration: false,
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.jsx',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};