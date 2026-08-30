/**
 * Build a distributable for the CURRENT platform/arch:
 *   1. `electron-forge package`  -> out/ZED-ZEN Media Converter-<platform>-<arch>
 *   2. `electron-builder --prepackaged <that dir>` -> dist/ (dmg on macOS, AppImage + deb on Linux, nsis on Windows)
 *
 * Run: node scripts/dist.js [extra electron-builder args]
 * Used by `npm run make:mac`, `npm run make:linux` and the Release workflow.
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const isWindows = process.platform === 'win32';
const bin = (name) => path.join(root, 'node_modules', '.bin', isWindows ? `${name}.cmd` : name);

const platformFlag = { darwin: '--mac', linux: '--linux', win32: '--win' }[process.platform];
if (!platformFlag) {
  console.error(`Unsupported platform: ${process.platform}`);
  process.exit(1);
}

const packagedDir = path.join(root, 'out', `ZED-ZEN Media Converter-${process.platform}-${process.arch}`);

function run(cmd, args) {
  console.log(`\n> ${path.basename(cmd)} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: isWindows });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

run(bin('electron-forge'), ['package']);

if (!fs.existsSync(packagedDir)) {
  console.error(`Packaged app not found at ${packagedDir}`);
  process.exit(1);
}

run(bin('electron-builder'), [
  '--config', 'electron-builder.config.js',
  platformFlag,
  `--${process.arch}`,
  '--prepackaged', packagedDir,
  ...process.argv.slice(2),
]);
