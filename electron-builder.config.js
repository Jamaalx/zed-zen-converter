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

    // Wizard style installer
    installerSidebar: 'build-resources/installerSidebar.bmp',

    // Custom messages
    uninstallDisplayName: 'ZED-ZEN Media Converter',
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

  // Include native modules
  asarUnpack: [
    '**/node_modules/sharp/**/*',
    '**/node_modules/@img/**/*',
  ],

  // Compression
  compression: 'maximum',

  // Don't publish automatically
  publish: null,
};
