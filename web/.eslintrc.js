module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  settings: {
    react: {
      "pragma": "React",
      "version": "detect"
    }
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/ban-types': [
    'error',
    {
      'extendDefaults': true,
      'types': {
        '{}': false
      }
    }
  ]
  }
}
