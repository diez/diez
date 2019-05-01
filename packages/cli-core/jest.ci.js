module.exports = Object.assign(
  require('./jest.config'),
  {
    reporters: [
      'default',
      [
        'jest-tap-reporter',
        {
          showInternalStackTraces: true,
          filePath: 'test-result.tap',
        },
      ],
    ],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: '.',
    coverageReporters: ['istanbul-reporter-cobertura-haiku'],
  },
);
