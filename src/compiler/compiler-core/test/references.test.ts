import {createParserForFixture} from './helpers';

describe('references', () => {
  test('correct reference tracking', async () => {
    const parser = await createParserForFixture('References');
    expect(parser.components.size).toBe(5);

    const references = parser.components.get('References')!;
    const bar = references.properties[0];
    const baz = references.properties[1];
    const bat = references.properties[2];

    // References at two levels.
    expect(bar.references).toEqual([
      {
        path: ['grandchild', 'foo'],
        parentType: 'Strings',
        name: 'bar',
      },
      {
        path: ['foo'],
        parentType: 'Strings',
        name: 'bar',
      },
    ]);

    expect(baz.references).toEqual([
      {
        path: ['grandchild', 'foo'],
        parentType: 'Strings',
        name: 'baz',
      },
      {
        path: ['foo'],
        parentType: 'Strings',
        name: 'baz',
      },
    ]);

    expect(bat.references).toEqual([
      {
        path: [],
        parentType: 'Children',
        name: 'bat',
      },
    ]);
  });
});
