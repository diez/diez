import {getTrue} from '../src';

describe('index', () => {
  test('the truth is true', () => {
    expect(getTrue()).toBe(true);
  });
});
