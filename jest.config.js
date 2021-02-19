module.exports = {
  roots: ['.'],
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  testEnvironment: 'node',
  clearMocks: true,
  maxWorkers: 1,
  coverageDirectory: 'coverage',
  collectCoverage: false, // When set to true, coverage is performed even if coverage flag isn't provided
  collectCoverageFrom: [
    'app/**/*.ts',
    '!src/routes/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
};
