import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';

// ESLint 10 tracks JSX references itself (core no-undef / no-unused-vars see
// <Component />), so the jsx-uses-vars / jsx-no-undef shims are not needed.
export default [
  {
    ignores: ['node_modules/**', 'out/**', 'dist/**', '.webpack/**', '.vite/**', '.wolf/**', '.claude/**'],
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
    ...eslintReact.configs.recommended,
    languageOptions: {
      ...eslintReact.configs.recommended.languageOptions,
      sourceType: 'module',
    },
    rules: {
      ...eslintReact.configs.recommended.rules,
      // eslint-plugin-react's recommended set had these; @eslint-react keeps
      // them outside its recommended preset
      '@eslint-react/dom-no-unknown-property': 'error',
      '@eslint-react/dom-no-unsafe-target-blank': 'error',
      '@eslint-react/no-missing-component-display-name': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$', caughtErrors: 'none' }],
    },
  },
];
