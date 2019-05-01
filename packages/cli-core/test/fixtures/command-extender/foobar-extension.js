const mocks = require('../mocks');

module.exports = {
  name: 'foobar',
  options: [
    {
      longName: 'stringParam',
      valueName: 'stringParam',
      description: 'String param.',
      validator: mocks.mockStringValidator,
    },
    {
      longName: 'booleanParam',
      description: 'Boolean param.',
      validator: mocks.mockBooleanValidator,
    },
    {
      longName: 'unusedParam',
      description: 'Unused param.',
    },
  ],
};
