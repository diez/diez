import {performGetRequest} from '../src/utils.network';

jest.mock('request', () => (_: never, callback: any) => {
  callback({message: 'catastrophic failure'}, {statusCode: 500});
});

describe('request.error', () => {
  test('failure', async () => {
    await expect(performGetRequest<never>('')).rejects.toThrowError('catastrophic failure');
  });
});
