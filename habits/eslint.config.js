import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting.js';
import airbnb from '@vue/eslint-config-airbnb';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginVue.configs['flat/essential'].rules,
      ...skipFormatting.rules,
      ...airbnb.rules,
      // Disable the no-unused-vars rule for parameters that start with underscore
      'no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
    },
    ignores: ['**/dist/**'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist-ssr/**', '**/coverage/**', '**/node_modules/**', '**/.gitignore'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];