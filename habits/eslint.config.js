import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser'; // ✅ Import parser properly
import globals from 'globals';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting.js';
import airbnb from '@vue/eslint-config-airbnb';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@babel/eslint-parser',
        sourceType: 'module',
        ecmaVersion: 'latest',
        requireConfigFile: false,
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
