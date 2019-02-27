module.exports = Object.assign(
  require('./jest.config'),
  {
    reporters: [[
      'jest-tap-reporter',
      {
        showInternalStackTraces: true,
        filePath: 'test-result.tap',
      },
    ]],
    collectCoverage: true,
    coverageDirectory: '.',
    coverageReporters: ['istanbul-reporter-cobertura-haiku'],
  },
);
