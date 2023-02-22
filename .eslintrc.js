const RULES = {
  OFF: 'off',
  WARN: 'warn',
  ERROR: 'error'
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'prettier',
    'plugin:cypress/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', '@next/eslint-plugin-next'],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    'react/react-in-jsx-scope': RULES.OFF,
    'react/prop-types': RULES.OFF,
    'no-use-before-define': RULES.OFF,
    'react/no-unescaped-entities': RULES.OFF,
    'multiline-ternary': RULES.OFF,
    'no-unused-vars': RULES.OFF,
    '@typescript-eslint/no-unused-vars': RULES.ERROR,
    'react/display-name': RULES.OFF,
    'prefer-const': RULES.OFF,
    'dot-notation': RULES.OFF,
    'no-unneeded-ternary': RULES.OFF,
    indent: RULES.OFF,
    camelcase: RULES.OFF
  },
  globals: {
    google: 'readonly'
  }
}
