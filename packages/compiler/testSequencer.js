const {default: Sequencer} = require('@jest/test-sequencer');

class HotLastSequencer extends Sequencer {
  sort (tests) {
    return Array.from(tests).sort((testA) => testA.path.endsWith('hot.e2e.test.ts') ? 1 : -1);
  }
}

module.exports = HotLastSequencer;
