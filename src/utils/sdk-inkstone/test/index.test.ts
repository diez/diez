import * as methods from '../src';
import {InvalidResponse} from '../src/api';
import * as transport from '../src/transport';

describe('index', () => {
  describe('#performActivation', () => {
    test('returns an empty object if the activation was valid', async () => {
      jest.spyOn(transport, 'post').mockReturnValueOnce(Promise.resolve({body: '', httpResponse: {statusCode: 200}}));
      const validActivation = await methods.performActivation({activationKey: 'validId'});
      expect(validActivation).toMatchObject({});
    });

    test('returns an error if seat was already activated', async () => {
      jest.spyOn(transport, 'post').mockReturnValueOnce(Promise.resolve({body: '', httpResponse: {statusCode: 409}}));
      const validActivation = await methods.performActivation({activationKey: 'alreadyActivatedId'});
      expect(validActivation).toHaveProperty('error');
      expect((validActivation as InvalidResponse).error).toBeInstanceOf(Error);
      expect((validActivation as InvalidResponse).error.message).toMatch('This device has already been activated');
    });

    test('returns an error if the activation id is invalid', async () => {
      jest.spyOn(transport, 'post').mockReturnValueOnce(Promise.resolve({body: '', httpResponse: {statusCode: 400}}));
      const validActivation = await methods.performActivation({activationKey: 'invalidactivationKey'});
      expect(validActivation).toHaveProperty('error');
      expect((validActivation as InvalidResponse).error).toBeInstanceOf(Error);
    });
  });

  describe('#checkActivation', () => {
    test('returns an org key if the activation is valid', async () => {
      jest.spyOn(transport, 'get').mockReturnValueOnce(
        Promise.resolve({body: 'validOrgKey', httpResponse: {statusCode: 200}}),
      );
      const response = await methods.checkActivation({activationKey: 'validId'});
      expect(response).toMatchObject({organizationKey: 'validOrgKey'});
    });

    test('returns an error if the activation is invalid', async () => {
      jest.spyOn(transport, 'get').mockReturnValueOnce(
        Promise.resolve({body: '', httpResponse: {statusCode: 400}}),
      );
      const response = await methods.checkActivation({activationKey: 'invalidId'});
      expect(response).toHaveProperty('error');
      expect((response as InvalidResponse).error).toBeInstanceOf(Error);
    });
  });

  describe('#getPackageUrls', () => {
    test('returns map of key/values', async () => {
      jest.spyOn(methods, 'checkActivation').mockReturnValue(Promise.resolve({organizationKey: '"orgCode"'}));
      const response = await methods.getPackageUrls({
        names: ['package1', 'package2'],
        version: '10.10.10',
        activationKey: 'xxxx',
      });

      expect(response).toMatchObject({
        packageUrls: {
          package1: 'https://inkstone.haiku.ai/v0/diez/package/orgCode/package1/10.10.10',
          package2: 'https://inkstone.haiku.ai/v0/diez/package/orgCode/package2/10.10.10',
        },
      });
    });

    test('throws an error if the activation id is invalid', async () => {
      jest.spyOn(methods, 'checkActivation').mockReturnValue(Promise.resolve({error: new Error()}));
      const response = await methods.getPackageUrls({
        names: ['validpackage'],
        version: '10.10.10',
        activationKey: '"invalid"',
      });

      expect(response).toHaveProperty('error');
      expect((response as InvalidResponse).error).toBeInstanceOf(Error);
    });
  });
});
