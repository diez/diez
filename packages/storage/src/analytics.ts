import nodeFetch, {Response} from 'node-fetch';
import {arch, platform} from 'os';
import {v4} from 'uuid';
import {DiezDiagnostics} from './api';
import {Registry} from './registry';

/**
 * Creates a diagnostics payload for Diez analytics.
 * @internal
 */
const getDiagnosticsPayload = async (
  eventType: string,
  diezVersion: string,
  extra?: any,
): Promise<DiezDiagnostics> => {
  const [uuid, analyticsEnabled] = await Promise.all([Registry.get('uuid'), Registry.get('analyticsEnabled')]);
  if (!analyticsEnabled || !uuid) {
    throw new Error('Analytics are disabled.');
  }

  return {
    eventType,
    uuid,
    properties: {
      diezVersion,
      platform: platform(),
      arch: arch(),
      nodeVersion: process.version,
      ...extra,
    },
  };
};

/**
 * Enables analytics.
 * @ignore
 */
export const enableAnalytics = () => Registry.set({
  analyticsEnabled: true,
  uuid: v4(),
});

/**
 * Disables analytics.
 * @ignore
 */
export const disableAnalytics = () => Promise.all([
  Registry.set({analyticsEnabled: false}),
  Registry.delete('uuid'),
]);

/**
 * Emits a diagnostic payload.
 */
export const emitDiagnostics = async (
  eventType: string,
  diezVersion: string,
  extra?: any,
): Promise<Response> => nodeFetch('https://analytics.diez.org/ping', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(await getDiagnosticsPayload(eventType, diezVersion, extra)),
});
