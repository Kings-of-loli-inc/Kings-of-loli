/* eslint-disable unicorn/prefer-module */
module.exports = {
  root: true,
  extends: ['eslint-config-base/base.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
};
