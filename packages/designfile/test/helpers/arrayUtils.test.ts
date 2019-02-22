import * as arrayUtils from '../../src/helpers/arrayUtils';

describe('arrayUtils', () => {
  describe('#chunk', () => {
    test('', () => {
      expect(arrayUtils.chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
      expect(arrayUtils.chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
      expect(arrayUtils.chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });
});
