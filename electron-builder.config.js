/**
 * Electron Builder Configuration
 * Creates a professional NSIS installer for Windows
 */

module.exports = {
  appId: 'com.zedzen.mediaconverter',
  productName: 'ZED-ZEN Media Converter',
  copyright: 'Copyright 2024 Fortitudo Vincit SRL',

  directories: {
    output: 'dist',
  },

  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    icon: 'assets/icon.ico',
    artifactName: '${productName}-Setup-${version}.${ext}',
  },

  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
    ],
    icon: 'assets/icon.png',
    artifactName: '${productName}-${version}-${arch}.${ext}',
    category: 'public.app-category.utilities',
  },

  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
    window: {
      width: 540,
      height: 380,
    },
  },

  linux: {
    target: ['AppImage', 'deb'],
    icon: 'assets/icon.png',
    category: 'Utility',
  },

  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    allowElevation: true,
    installerIcon: 'assets/icon.ico',
    uninstallerIcon: 'assets/icon.ico',
    installerHeaderIcon: 'assets/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'ZED-ZEN Media Converter',
    uninstallDisplayName: 'ZED-ZEN Media Converter',

    // License agreement
    license: 'LICENSE',
  },

  // Files to include
  files: [
    '**/*',
    '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
    '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
    '!**/node_modules/*.d.ts',
    '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
    '!.editorconfig',
    '!**/._*',
    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
  ],

  // Include native modules unpacked
  asarUnpack: [
    '**/node_modules/sharp/**/*',
    '**/node_modules/@img/**/*',
  ],

  // Compression
  compression: 'normal',

  // Don't publish automatically
  publish: null,
};
