module.exports = {
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        // Relax rules for test files
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/require-await': 'warn',
      },
    },
  ],
};