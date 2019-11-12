import {createParserForFixture} from './helpers';

describe('anonymous types', () => {
  test('basic functionality', async () => {
    const parser = await createParserForFixture('Anonymous');
    expect(parser.components.size).toBe(4);
    const designLanguage = parser.components.get('DesignLanguage')!;
    expect(designLanguage.properties.length).toBe(1);
    expect(designLanguage.properties[0].type).toBe('Colors');
    const colors = parser.components.get('Colors')!;
    expect(colors.properties.length).toBe(2);
    expect(colors.properties[0].type).toBe('Color');
    expect(colors.properties[0].references).toEqual([{
      path: [],
      parentType: 'Palette',
      name: 'red',
    }]);

    expect(parser.getMetadataForTypeOrThrow('DesignLanguage')).toEqual(expect.objectContaining({
      symbolName: 'designLanguage',
    }));

    expect(() => parser.getMetadataForTypeOrThrow('does-not-exist')).toThrow();
  });
});
