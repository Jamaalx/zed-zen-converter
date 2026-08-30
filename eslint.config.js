const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/**', 'out/**', 'dist/**', '.webpack/**', '.vite/**'],
  },
  js.configs.recommended,
  {
    // Node side: main process, preload, build scripts, configs
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.node,
        ...globals.browser,
        // injected by @electron-forge/plugin-webpack
        MAIN_WINDOW_WEBPACK_ENTRY: 'readonly',
        MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
  {
    // Renderer side (bundled by webpack as ES modules): React components + utils
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/main.js', 'src/preload.js'],
    languageOptions: { sourceType: 'module' },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$', caughtErrors: 'none' }],
    },
  },
];
