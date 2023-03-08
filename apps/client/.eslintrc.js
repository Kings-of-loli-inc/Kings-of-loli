/* eslint-disable unicorn/prefer-module */
module.exports = {
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['plugin:react/recommended', 'eslint-config-base/base.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
