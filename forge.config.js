const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

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
    force: false, // Nu forța rebuild
  },
  makers: [
    // Squirrel Windows Installer - cu suport code signing
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ZedZenConverter',
        authors: 'Fortitudo Vincit SRL',
        description: 'Free media converter for images, videos, and documents',
        setupExe: 'ZedZen-Media-Converter-Setup.exe',
        setupIcon: './src/assets/icon.ico',
        // Code signing pentru Squirrel (dacă e configurat)
        ...(isCodeSigningEnabled && {
          certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
          certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
          signWithParams: '/tr http://timestamp.digicert.com /td sha256 /fd sha256',
        }),
      },
    },
    // ZIP pentru distribuție manuală (portabil, fără instalare)
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
        devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
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