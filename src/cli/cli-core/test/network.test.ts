import {EventEmitter} from 'events';
import {findOpenPort, getCandidatePortRange, socketTrap} from '../src/network';

jest.mock('package-json', () => () => {});

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

class MockSocket extends EventEmitter {
  static mockDestroy = jest.fn();
  static mockRemoveAllListeners = jest.fn();

  destroy () {
    MockSocket.mockDestroy();
  }

  removeAllListeners () {
    MockSocket.mockRemoveAllListeners();
    return this;
  }
}

jest.doMock('net', () => {
  return {Socket: MockSocket};
});

import {Socket} from 'net';

describe('network', () => {
  test('port scanning', async () => {
    await expect(findOpenPort([1])).rejects.toThrow();
    expect(await findOpenPort(getCandidatePortRange(8999, 3))).toBe(9001);
  });
});

describe('socket trap', () => {
  test('teardown on failures', () => {
    const socket = new Socket();
    socketTrap(socket);
    socket.emit('disconnect');
    expect(MockSocket.mockDestroy).toHaveBeenCalledTimes(1);
    expect(MockSocket.mockRemoveAllListeners).toHaveBeenCalledTimes(1);
    socket.emit('error');
    expect(MockSocket.mockDestroy).toHaveBeenCalledTimes(2);
    expect(MockSocket.mockRemoveAllListeners).toHaveBeenCalledTimes(2);
    process.emit('exit', 0);
    expect(MockSocket.mockDestroy).toHaveBeenCalledTimes(3);
  });
});
