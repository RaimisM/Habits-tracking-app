/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

const path = require('node:path')

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-airbnb',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  rules: {
    'no-use-before-define': ['error', { functions: false }],
    'import/extensions': 'off',
  },
  settings: {
    'import/resolver': {
      [require.resolve('eslint-import-resolver-node')]: {},
      [require.resolve('eslint-import-resolver-custom-alias')]: {
        alias: {
          '@': `${path.resolve(__dirname, './src')}`,
        },
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx'],
      },
    },
  },
}
