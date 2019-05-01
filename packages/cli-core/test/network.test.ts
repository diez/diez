import {EventEmitter} from 'events';
import {findOpenPort, getCandidatePortRange} from '../src/network';

class MockServer extends EventEmitter {
  listen (port: number) {
    if (port === 8999) {
      throw new Error('Anything but that!');
    } else if (port === 9001) {
      setImmediate(() => this.emit('listening'));
    } else {
      setImmediate(() => this.emit('error'));
    }
  }

  close () {
    this.emit('close');
  }

  destroy () {}
}

jest.mock('server-destroy', () => () => {});
jest.mock('http', () => ({
  createServer () {
    return new MockServer();
  },
}));

describe('network', () => {
  test('port scanning', async () => {
    await expect(findOpenPort([1])).rejects.toThrow();
    expect(await findOpenPort(getCandidatePortRange(8999, 3))).toBe(9001);
  });
});
