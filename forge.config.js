const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: false,
    name: 'ZED-ZEN Media Converter',
    executableName: 'ZedZen-Converter',
  },
  rebuildConfig: {
    onlyModules: ['sharp']
  },
  hooks: {
    packageAfterCopy: async (config, buildPath) => {
      const fs = require('fs');

      // List of modules to copy (Sharp + its runtime dependencies)
      const modulesToCopy = [
        'sharp',
        'detect-libc',
        'color',
        'color-string',
        'color-name',
        'simple-swizzle',
        'is-arrayish',
        'semver'
      ];

      console.log('Copying Sharp and dependencies...');

      for (const moduleName of modulesToCopy) {
        const srcModule = path.join(__dirname, 'node_modules', moduleName);
        const destModule = path.join(buildPath, 'node_modules', moduleName);

        if (fs.existsSync(srcModule)) {
          fs.cpSync(srcModule, destModule, { recursive: true });
          console.log(`✓ Copied ${moduleName}`);
        } else {
          console.log(`⚠ ${moduleName} not found, skipping`);
        }
      }

      console.log('Sharp and dependencies copied successfully');
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ZedZenConverter',
        authors: 'Fortitudo Vincit SRL',
        description: 'Free media converter for images, videos, and documents',
        noMsi: true,
        setupExe: 'ZedZen-Media-Converter-Setup.exe',
      },
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