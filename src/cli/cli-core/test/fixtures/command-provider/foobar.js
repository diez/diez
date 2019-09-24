const mocks = require('../mocks');

module.exports = {
  name: 'foobar',
  description: 'Do stuff.',
  loadAction: () => mocks.mockAction,
  preinstall: mocks.mockPreinstall,
};
