import {
  findAvailableTypes,
  findComponentFromPath,
  findExampleFromSelection,
  getDocumentationLinkForType,
  hasExamples,
  isBagOfComponents,
} from '@/utils/component';
import {ParsedExampleTree} from '@diez/docs';
import {join} from 'path';
import {singletonComponent} from '../fixtures/components/singleton';
import {buildRoot} from '../helpers';

const componentWithoutExamples = Object.assign({}, singletonComponent, {
  examples: {},
  name: 'componentWithoutExamples',
});

const tree = require(join(buildRoot, 'tree.json'));

describe('hasExamples', () => {
  test('returns true when the component has usage examples', () => {
    expect(hasExamples(singletonComponent)).toBe(true);
  });

  test('returns true when the component has usage examples', () => {
    expect(hasExamples(componentWithoutExamples)).toBe(false);
  });
});

describe('findExampleFromSelection', () => {
  test('returns null if it cant find usage examples', () => {
    expect(findExampleFromSelection(['ios'])).toBeNull();
    expect(findExampleFromSelection(['ios'], componentWithoutExamples)).toBeNull();
  });

  test('finds usage examples defined at the root level', () => {
    const examples = findExampleFromSelection(['ios'], singletonComponent) as ParsedExampleTree;
    expect(examples).toBeDefined();
    expect(examples).toEqual(singletonComponent.examples!.ios);
  });

  test('finds nested usage examples', () => {
    const examples = findExampleFromSelection(['android', 'Programmatic'], singletonComponent) as ParsedExampleTree;
    expect(examples).toBeDefined();
    expect(examples).toEqual((singletonComponent.examples!.android as ParsedExampleTree).Programmatic);
  });
});

describe('isBagOfComponents', () => {
  test('returns true when a component is just a component holder', () => {
    expect(isBagOfComponents(Object.assign({}, singletonComponent, {isPrimitive: false, binding: null}))).toBe(true);
  });

  test('', () => {
    expect(isBagOfComponents(singletonComponent)).toBe(false);
    expect(isBagOfComponents(Object.assign({}, singletonComponent, {isPrimitive: true}))).toBe(false);
  });
});

describe('findComponentFromPath', () => {
  test('returns undefined if cannot find a component', () => {
    expect(findComponentFromPath([], tree)).toBeUndefined();
    expect(findComponentFromPath(['/'], tree)).toBeUndefined();
    expect(findComponentFromPath(['asdf'], tree)).toBeUndefined();
    expect(findComponentFromPath(['DocsApp', 'PaLeTte', 'primary'], tree)).toBeUndefined();
  });

  test('is able to find a component at root level', () => {
    const component = findComponentFromPath(['DocsApp'], tree);
    expect(component).toBeDefined();
    expect(component!.name).toBe('DocsApp');
    expect(component!.id).toBe('/DocsApp');
  });

  test('is able to find a nested component', () => {
    const primary = findComponentFromPath(['DocsApp', 'palette', 'primary'], tree);
    expect(primary).toBeDefined();
    expect(primary!.name).toBe('primary');
    expect(primary!.id).toBe('/DocsApp/palette/primary');
  });
});

describe('findAvailableTypes', () => {
  test('only finds types present in the provided tree', () => {
    const types = findAvailableTypes([Object.assign({}, singletonComponent, {properties: [singletonComponent]})]);
    expect(types.size).toBe(1);
    expect(types.has('Color')).toBe(true);
  });

  test('finds types in an arbitrarily nested tree', () => {
    const types = findAvailableTypes(tree);
    expect(types.has('Color')).toBe(true);
    expect(types.has('Size2D')).toBe(true);
    expect(types.has('Lottie')).toBe(true);
  });

  test('only finds types with bindings', () => {
    const types = findAvailableTypes(tree);
    expect(types.has('Palette')).toBe(false);
  });
});

describe('getDocumentationLinkForType', () => {
  test('Returns an URL that has the correct shape', () => {
    const component = findComponentFromPath(['DocsApp', 'palette', 'primary'], tree);
    const link = getDocumentationLinkForType(component!.type);
    expect(link).toContain('diez.org');
    expect(link).toContain('color');
  });
});
