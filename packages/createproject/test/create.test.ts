import {assignMock, mockCliCoreFactory, registerExpectations} from '@diez/test-utils';
jest.doMock('@diez/cli-core', mockCliCoreFactory);

const downloadStreamMock = jest.fn();
jest.doMock('@diez/storage', () => ({
  ...jest.requireActual('@diez/storage'),
  downloadStream: downloadStreamMock,
}));

import {Readable, Writable} from 'stream';
const mockWriter = jest.fn();
jest.doMock('tar', () => ({
  x: jest.fn().mockImplementation(() => {
    const stream = new Writable();
    stream._write = (chunk) => {
      mockWriter(chunk.toString());
      stream.emit('close');
    };
    return stream;
  }),
}));

const mockPackageNameValidator = jest.fn();
jest.doMock('validate-npm-package-name', () => mockPackageNameValidator);

import {diezVersion} from '@diez/cli-core';
import {downloadStream} from '@diez/storage';
import {ensureFileSync, removeSync} from 'fs-extra';
import {basename, join} from 'path';
import {x} from 'tar';
import {ClassDeclaration, Project} from 'ts-morph';
import {createProject} from '../src/utils';

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', 'examples');
const myProjectRoot = join(workspaceExamplesRoot, 'my-project');

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e4);
  registerExpectations();
  removeSync(myProjectRoot);
});

beforeEach(() => {
  mockPackageNameValidator.mockImplementation(() => ({validForNewPackages: true}));
  assignMock(process, 'exit');
});

afterEach(() => {
  removeSync(myProjectRoot);
  mockPackageNameValidator.mockReset();
  downloadStreamMock.mockReset();
});

describe('create project', () => {
  test('invalid package name', async () => {
    mockPackageNameValidator.mockImplementationOnce(() => ({
      validForNewPackages: false,
      errors: ['error'],
      warnings: ['warning'],
    }));

    await expect(createProject('my-project', [], workspaceExamplesRoot)).rejects.toThrow();
  });

  test('existing project root - file', async () => {
    ensureFileSync(myProjectRoot);
    await expect(createProject('my-project', [], workspaceExamplesRoot)).rejects.toThrow();
  });

  test('existing project root - module', async () => {
    ensureFileSync(join(myProjectRoot, 'package.json'));
    await expect(createProject('my-project', [], workspaceExamplesRoot)).rejects.toThrow();
  });

  test('asset download failure', async () => {
    downloadStreamMock.mockResolvedValue(null);
    await expect(createProject('my-project', [], workspaceExamplesRoot)).rejects.toThrow();
  });

  test('project generation', async () => {
    downloadStreamMock.mockImplementation((path: string) => {
      const stream = new Readable();
      stream._read = () => {};
      stream.push(`${basename(path)} contents`);
      stream.push(null);
      return stream;
    });

    await createProject('my-project', ['android', 'ios', 'web'], workspaceExamplesRoot);
    const tsConfigFilePath = join(myProjectRoot, 'tsconfig.json');
    expect(myProjectRoot).toExist();
    expect(tsConfigFilePath).toExist();
    const project = new Project({tsConfigFilePath});
    const typeChecker = project.getTypeChecker();
    const sourceFile = project.getSourceFileOrThrow(join(myProjectRoot, 'src', 'index.ts'));
    const exported = Array.from(sourceFile.getExportedDeclarations().values());
    expect(exported.length).toBe(1);
    const exportedType = typeChecker
      .getTypeAtLocation(exported[0][0])
      .getSymbolOrThrow()
      .getValueDeclarationOrThrow() as ClassDeclaration;
    expect(exportedType.getName()).toBe('DesignSystem');
    expect(downloadStream).toHaveBeenNthCalledWith(
      1, `https://examples.diez.org/${diezVersion}/createproject/assets.tgz`);
    expect(downloadStream).toHaveBeenNthCalledWith(
      2, `https://examples.diez.org/${diezVersion}/createproject/examples/android.tgz`);
    expect(downloadStream).toHaveBeenNthCalledWith(
      3, `https://examples.diez.org/${diezVersion}/createproject/examples/ios.tgz`);
    expect(downloadStream).toHaveBeenNthCalledWith(
      4, `https://examples.diez.org/${diezVersion}/createproject/examples/web.tgz`);

    expect(mockWriter).toHaveBeenNthCalledWith(1, 'assets.tgz contents');
    expect(mockWriter).toHaveBeenNthCalledWith(2, 'android.tgz contents');
    expect(mockWriter).toHaveBeenNthCalledWith(3, 'ios.tgz contents');
    expect(mockWriter).toHaveBeenNthCalledWith(4, 'web.tgz contents');
    expect(x).toHaveBeenCalledWith({cwd: myProjectRoot});
  });
});
