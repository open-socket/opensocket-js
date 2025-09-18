module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      extends: ['eslint:recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: null,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        // Only basic ESLint rules for test files
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};