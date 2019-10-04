import {DiezComponent, PrimitiveType} from '../src/api';
import {createParserForFixture} from './helpers';

beforeAll(() => {
  // Allow 1 minute per test.
  jest.setTimeout(6e4);
});

/**
 * @internal
 */
const findProperty = (component: DiezComponent, name: string) =>
  component.properties.find((property) => property.name === name)!;

describe('parser', () => {
  test('valid project', async () => {
    const parser = await createParserForFixture('Valid');
    expect(parser.components.size).toBe(3);
    expect(Array.from(parser.rootComponentNames)).toEqual(['Valid']);

    const validComponent = parser.components.get('Valid')!;
    expect(validComponent).toBeDefined();
    expect(validComponent.isFixedComponent).toBe(true);
    expect(validComponent.sourceModule).toBe('.');
    expect(validComponent.sourceFile).toBe('src/index.ts');
    expect(validComponent.properties.length).toBe(10);

    expect(findProperty(validComponent, 'int').type).toBe(PrimitiveType.Int);
    expect(findProperty(validComponent, 'int').depth).toBe(0);
    expect(findProperty(validComponent, 'number').type).toBe(PrimitiveType.Float);
    expect(findProperty(validComponent, 'float').type).toBe(PrimitiveType.Float);
    expect(findProperty(validComponent, 'string').type).toBe(PrimitiveType.String);
    expect(findProperty(validComponent, 'boolean').type).toBe(PrimitiveType.Boolean);

    expect(findProperty(validComponent, 'stringEnum').type).toBe(PrimitiveType.String);
    expect(findProperty(validComponent, 'numberEnum').type).toBe(PrimitiveType.Float);

    expect(validComponent.description.body).toBe('This is a mock JSDoc comment on a class.');
    expect(findProperty(validComponent, 'string').description.body).toBe('This is a mock JSDoc\n_multiline comment_.');
    expect(
      findProperty(validComponent, 'boolean').description.body).toBe('This is a mock JSDoc comment on a property.',
    );

    const list1 = findProperty(validComponent, 'validListDepth1');
    const list2 = findProperty(validComponent, 'validListDepth2');
    expect(list1.type).toBe(PrimitiveType.Float);
    expect(list2.type).toBe(PrimitiveType.String);
    expect(list1.depth).toBe(1);
    expect(list2.depth).toBe(2);

    const warnings = validComponent.warnings;
    expect(warnings.ambiguousTypes.has('invalidEnum')).toBe(true);
    expect(warnings.ambiguousTypes.has('unknown')).toBe(true);
    expect(warnings.ambiguousTypes.has('any')).toBe(true);
    expect(warnings.ambiguousTypes.has('union')).toBe(true);
    expect(warnings.ambiguousTypes.has('invalidListUniformDepth')).toBe(true);
    expect(warnings.ambiguousTypes.has('invalidListUniformType')).toBe(true);

    const child = findProperty(validComponent, 'child');
    expect(child.type).toBe('ChildComponent');
    expect(child.isComponent).toBe(true);

    const childComponent = parser.components.get('ChildComponent')!;
    expect(childComponent.isRootComponent).toBe(false);
    expect(childComponent.isFixedComponent).toBe(true);
    expect(childComponent).toBeDefined();
    expect(childComponent.properties.length).toBe(1);
    expect(childComponent.warnings.ambiguousTypes.size).toBe(0);

    const grandchild = findProperty(childComponent, 'grandchild');
    expect(grandchild.type).toBe('GrandchildComponent');
    expect(grandchild.isComponent).toBe(true);

    const grandchildComponent = parser.components.get('GrandchildComponent')!;
    expect(grandchildComponent.isRootComponent).toBe(false);
    expect(grandchildComponent.isFixedComponent).toBe(true);
    expect(grandchildComponent).toBeDefined();
    expect(grandchildComponent.properties.length).toBe(1);
    expect(grandchildComponent.warnings.ambiguousTypes.size).toBe(0);

    const diez = findProperty(grandchildComponent, 'diez');
    expect(diez.type).toBe(PrimitiveType.String);
    expect(diez.isComponent).toBe(false);
  });
});
