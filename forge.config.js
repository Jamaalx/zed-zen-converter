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

      console.log('Copying Sharp and ALL its dependencies...');

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

      // Get all Sharp dependencies recursively
      const allModules = getAllDependencies('sharp');

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