const mocks = require('../mocks');

module.exports = {
  names: ['foobar'],
  options: [
    {
      longName: 'stringParam',
      shortName: 's',
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
