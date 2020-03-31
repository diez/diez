const writersObjectMock = jest.fn();

jest.doMock('ts-morph', () => ({
  ...jest.requireActual('ts-morph'),
  Writers: {
    object: writersObjectMock,
  }
}));

const sourceFileMock = {
  addVariableStatement: jest.fn(),
  insertStatements: jest.fn(),
  addImportDeclaration: jest.fn(),
  save: jest.fn(),
  formatText: jest.fn(),
  fixUnusedIdentifiers: jest.fn(),
  getFullWidth: jest.fn(() => 1),
};

jest.doMock('@diez/compiler-core', () => {
  return {
    getProject () {
      return {
        createSourceFile: () => {
          return sourceFileMock;
        },
      };
    },
  };
});

import {VariableDeclarationKind} from 'ts-morph';
import {ExtractableAssetType} from '../src';
import {codegenDesignLanguage, objectToSource, UniqueNameResolver, quoteInvalidPropertyName} from '../src/utils';

describe('UniqueNameResolver', () => {
  test('provides conventional component names', () => {
    const resolver = new UniqueNameResolver();
    const name = resolver.getComponentName('my design_language');
    const name1 = resolver.getComponentName('my design_language');
    const name2 = resolver.getComponentName('some-other-design-language');

    expect(name).toBe('MyDesignLanguage');
    expect(name1).toBe('MyDesignLanguage1');
    expect(name2).toBe('SomeOtherDesignLanguage');
  });

  test('provides conventional property names', () => {
    const resolver = new UniqueNameResolver();
    const name = resolver.getPropertyName('foo bar', 'Baz');
    const name1 = resolver.getPropertyName('foo bar', 'Baz');
    const name2 = resolver.getPropertyName('foo bar', 'Bat');

    expect(name).toBe('fooBar');
    expect(name1).toBe('fooBar1');
    expect(name2).toBe('fooBar');
  });
});

describe('#codegenDesignLanguage', () => {
  const specMock = {
    assetsDirectory: '',
    designLanguageName: 'LoremIpsum',
    filename: 'LoremIpsum.sketch.ts',
    projectRoot: 'lorem-ipsum/design-language',
    colors: [
      {
        name: 'black',
        initializer: 'Color.rgba(255, 255, 255, 1)',
      },
      {
        name: '00 invalid name',
        initializer: 'Color.rgba(255, 255, 255, 1)',
      }
    ],
    gradients: [{
      name: 'masthead-gradient',
      initializer: 'new LinearGradient({stops: [GradientStop.make(0, Color.rgba(22, 11, 54, 1)), GradientStop.make(1, Color.rgba(0, 0, 16, 1))], start: Point2D.make(0.5, 0.004077454971923), end: Point2D.make(0.5, 0.808830439666012)})',
    }],
    shadows: [{
      initializer: 'new DropShadow({offset: Point2D.make(0, 1), radius: 16, color: Color.rgba(0, 0, 16, 0.41)})',
      name: 'avatar Drop Shadow',
    }],
    typographs: [{
      name: 'helvetica',
      initializer: 'new Typograph()',
    }, {
      name: '',
      initializer: 'new Typograph()',
    }],
    fonts: new Map(),
    assets: new Map([
      [ExtractableAssetType.Slice, new Map([['name', {src: 'asdf', width: 15, height: 15}]])],
      [ExtractableAssetType.Slice, new Map([['00 invalid slice name', {src: 'asdf', width: 15, height: 15}]])],
    ]),
  };

  test('Export tokens grouped by type', () => {
    codegenDesignLanguage(specMock);
    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(1, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumColors',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(2, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumGradients',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(3, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumShadows',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(4, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumTypography',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(5, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumImagesFiles',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(6, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      leadingTrivia: expect.stringContaining('This is provided for backward compatibility, please use `loremIpsumImagesFiles` instead.'),
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumSlicesFiles',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(7, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumImages',
      })]),
    }));

    expect(sourceFileMock.addVariableStatement).toHaveBeenNthCalledWith(8, expect.objectContaining({
      declarationKind: VariableDeclarationKind.Const,
      leadingTrivia: expect.stringContaining('This is provided for backward compatibility, please use `loremIpsumImages` instead.'),
      declarations: expect.arrayContaining([expect.objectContaining({
        name: 'loremIpsumSlices',
      })]),
    }));
  });

  test('Adds a notice to the file noting that is automatically generated', () => {
    codegenDesignLanguage(specMock);

    expect(sourceFileMock.insertStatements).toHaveBeenLastCalledWith(
      0,
      expect.stringContaining('This code was generated by Diez'),
    );
  });

  test('Quotes invalid property names', () => {
    codegenDesignLanguage(specMock);

    expect(writersObjectMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
      "'00InvalidName'": expect.anything(),
    }));

    expect(writersObjectMock).toHaveBeenNthCalledWith(6, expect.objectContaining({
      "'00InvalidSliceName'": expect.anything(),
    }));``
  });

  test('formats and saves the file when is done', () => {
    codegenDesignLanguage(specMock);
    expect(sourceFileMock.save).toHaveBeenCalled();
    expect(sourceFileMock.formatText).toHaveBeenCalled();
  });
});

describe('objectToSource', () => {
  test('converts an object to a string representation of JS source code', () => {
    const obj = {str: 'a', numb: 2, undef: undefined};
    expect(objectToSource(obj)).toEqual('{str: a, numb: 2, undef: undefined}');
  });
});


describe('quoteInvalidPropertyName', () => {
  test('wraps in quotes invalid TypeScript property names', () => {
    expect(quoteInvalidPropertyName('myProperty')).toBe('myProperty');
    expect(quoteInvalidPropertyName('π')).toBe('π');
    expect(quoteInvalidPropertyName('10')).toBe('10');
    expect(quoteInvalidPropertyName('12x')).toBe('\'12x\'');
    expect(quoteInvalidPropertyName('delete')).toBe('\'delete\'');
    expect(quoteInvalidPropertyName('\u0061')).toBe('a');
    expect(quoteInvalidPropertyName('00MyProperty')).toBe('\'00MyProperty\'');
    expect(quoteInvalidPropertyName('10SpOverline')).toBe('\'10SpOverline\'');
    expect(quoteInvalidPropertyName('foo bar')).toBe('\'foo bar\'');
    expect(quoteInvalidPropertyName('foo-bar')).toBe('\'foo-bar\'');
  });
});
