import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * ESLint v9+ Flat Configuration
 * This configures code style and safety rules for our React + TypeScript + Vite project.
 */
export default tseslint.config(
  // Ignore build/bundler output folder
  { ignores: ['dist'] },
  {
    // Apply recommended JS and TS rules to all TypeScript and TSX files
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Enforce React Hooks rules (dependency arrays, hook call orders)
      ...reactHooks.configs.recommended.rules,
      
      // Warn when React components are not exported properly (vital for HMR/Vite)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Custom TS rules for flexible project bootstrap
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
    },
  },
);
