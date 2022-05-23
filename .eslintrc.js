module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  env: { es6: true },
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['simple-import-sort', 'import', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
