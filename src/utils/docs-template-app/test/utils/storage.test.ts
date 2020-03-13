import {storage} from '@/utils/storage';

describe('storage', () => {
  const key = 'diez';
  const stringValue = 'diez-value';
  const jsonValue = {my: 'value'};

  afterEach(() => {
    storage.clear();
  });

  test('allows to set/get values', () => {
    storage.set(key, stringValue);
    expect(storage.get(key)).toBe(stringValue);
  });

  test('allows to set/get JSON values', () => {
    storage.setJson(key, jsonValue);
    expect(storage.get(key)).toEqual(JSON.stringify(jsonValue));
    expect(storage.getJson(key)).toEqual(jsonValue);
  });

  test('allows to clear values', () => {
    storage.set(key, stringValue);
    expect(storage.get(key)).toBeDefined();
    storage.clear();
    expect(storage.get(key)).toBeNull();
  });
});
