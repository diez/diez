import {MediaQuery} from '../src/media-query';

describe('MediaQuery', () => {
  test('basic functionality', () => {
    const breakpoint = MediaQuery.minWidth(300);
    expect(breakpoint.serialize()).toEqual({queries: [{type: 'screen', minWidth: 300}]});
  });
});
