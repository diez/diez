import {pathToArray, pathToCrumb} from '@/utils/navigation';

describe('utils/navigation', () => {
  describe('pathToCrumb', async () => {
    test('handles basic paths', () => {
      expect(pathToCrumb('/DesignLanguage/Palette/red', '/Palette')).toBe('/DesignLanguage/Palette');
      expect(pathToCrumb('/DesignLanguage/Palette/red', '/red')).toBe('/DesignLanguage/Palette/red');
    });

    test('handles paths with hashes', () => {
      expect(pathToCrumb('/DesignLanguage/Collection/Measures#primitive', '/Measures'))
        .toBe('/DesignLanguage/Collection/Measures');
      expect(pathToCrumb('/DesignLanguage/Collection/Measures#primitive', '#primitive'))
        .toBe('/DesignLanguage/Collection/Measures#primitive');
    });
  });

  describe('pathToArray', async () => {
    test('handles basic paths', () => {
      expect(pathToArray('/DesignLanguage/Palette/red')).toEqual(['DesignLanguage', 'Palette', 'red']);
      expect(pathToArray('/DesignLanguage/Collection/Measures#primitive'))
        .toEqual(['DesignLanguage', 'Collection', 'Measures#primitive']);
    });

    test('handles malformed paths', () => {
      expect(pathToArray('//DesignLanguage/'))
        .toEqual(['DesignLanguage']);
    });
  });
});
