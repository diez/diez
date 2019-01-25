import {getPatcher} from '../src/platform';

describe('platform', () => {
  test('iOS detection', () => {
    const iOSPatcher = jest.fn();
    Object.assign(window, {
      webkit: {
        messageHandlers: {
          patch: {
            postMessage: iOSPatcher,
          },
        },
      },
    });
    getPatcher()({foo: 'bar'});
    expect(iOSPatcher.mock.calls).toEqual([['{"foo":"bar"}']]);
    // @ts-ignore
    delete window.webkit;
  });

  test('Android detection', () => {
    const androidPatcher = jest.fn();
    Object.assign(window, {
      puente: {
        patch: androidPatcher,
      },
    });
    getPatcher()({bat: 'baz'});
    expect(androidPatcher.mock.calls).toEqual([['{"bat":"baz"}']]);
    // @ts-ignore
    delete window.puente;
  });
});
