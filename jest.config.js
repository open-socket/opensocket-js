module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true
      }
    }]
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/index.ts',
    '!packages/*/src/**/*.test.ts',
    '!packages/*/src/**/*.spec.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@open-socket/core$': '<rootDir>/packages/core/src',
    '^@open-socket/testing-utils$': '<rootDir>/packages/testing-utils/src'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/*/dist'
  ],
  clearMocks: true,
  restoreMocks: true
};