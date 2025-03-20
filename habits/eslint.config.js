import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting.js'; //Corrected import
import airbnb from '@vue/eslint-config-airbnb';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    languageOptions: {
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
      ...airbnb.rules,
      ...skipFormatting.rules,
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