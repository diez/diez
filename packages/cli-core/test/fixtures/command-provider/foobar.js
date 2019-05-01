const mocks = require('../mocks');

module.exports = {
  name: 'foobar',
  description: 'Do stuff.',
  action: mocks.mockAction,
  preinstall: mocks.mockPreinstall,
};
