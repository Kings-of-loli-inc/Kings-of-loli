/* eslint-disable unicorn/prefer-module */
module.exports = {
  extends: ['plugin:react/recommended', 'eslint-config-base/base.js'],
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
  },
};
