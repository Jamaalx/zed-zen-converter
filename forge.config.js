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
      const srcSharp = path.join(__dirname, 'node_modules', 'sharp');
      const destSharp = path.join(buildPath, 'node_modules', 'sharp');

      console.log('Copying Sharp from:', srcSharp);
      console.log('Copying Sharp to:', destSharp);

      // Copy Sharp and all its dependencies
      fs.cpSync(srcSharp, destSharp, { recursive: true });

      console.log('Sharp copied successfully');
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