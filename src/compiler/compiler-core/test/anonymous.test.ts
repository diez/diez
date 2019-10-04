import {createParserForFixture} from './helpers';

describe('anonymous types', () => {
  test('basic functionality', async () => {
    const parser = await createParserForFixture('Anonymous');
    expect(parser.components.size).toBe(3);
    const designSystem = parser.components.get('DesignSystem')!;
    expect(designSystem.properties.length).toBe(1);
    expect(designSystem.properties[0].type).toBe('Colors');
    const colors = parser.components.get('Colors')!;
    expect(colors.properties.length).toBe(2);
    expect(colors.properties[0].type).toBe('Color');
  });
});
