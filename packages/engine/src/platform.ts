import {AnySerializable, Patcher} from './api';

export interface IOSAdaptedWindow extends Window {
  webkit: {
    messageHandlers: {
      patch: {
        postMessage: Patcher;
      },
    },
  };
}

export interface AndroidAdaptedWindow extends Window {
  puente: {
    patch: Patcher;
  };
}

export type CrossPlatformWindow = IOSAdaptedWindow | AndroidAdaptedWindow;

const isIOS = (w: CrossPlatformWindow): w is IOSAdaptedWindow => w.hasOwnProperty('webkit');
const isAndroid = (w: CrossPlatformWindow): w is AndroidAdaptedWindow => w.hasOwnProperty('puente');

/**
 * Platform-sensitive Patcher retriever.
 *
 * TODO: allow alternative serialization formats than JSON.stringify() over the wire.
 * TODO: only wired components need a patcher; refactor accordingly?
 */
export const getPatcher = (): Patcher => {
  const w = window as CrossPlatformWindow;
  if (isIOS(w)) {
    return (payload: AnySerializable) => {
      w.webkit.messageHandlers.patch.postMessage(JSON.stringify(payload));
    };
  }

  if (isAndroid(w)) {
    return (payload: AnySerializable) => {
      w.puente.patch(JSON.stringify(payload));
    };
  }

  // TODO: web.
  return (payload: AnySerializable) => {
    console.log(payload);
  };
};
