import {assignMock, mockCliCoreFactory, mockShouldUseYarn, registerExpectations} from '@diez/test-utils';
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

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', '..', 'examples');
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
  mockShouldUseYarn.mockReset();
});

describe('create project', () => {
  test('invalid package name', async () => {
    mockPackageNameValidator.mockImplementationOnce(() => ({
      validForNewPackages: false,
      errors: ['error'],
      warnings: ['warning'],
    }));

    await expect(createProject('my-project', true, workspaceExamplesRoot)).rejects.toThrow();
  });

  test('existing project root - file', async () => {
    ensureFileSync(myProjectRoot);
    await expect(createProject('my-project', true, workspaceExamplesRoot)).rejects.toThrow();
  });

  test('existing project root - module', async () => {
    ensureFileSync(join(myProjectRoot, 'package.json'));
    await expect(createProject('my-project', true, workspaceExamplesRoot)).rejects.toThrow();
  });

  test('asset download failure', async () => {
    downloadStreamMock.mockResolvedValue(null);
    await expect(createProject('my-project', false, workspaceExamplesRoot)).rejects.toThrow();
  });

  test('project generation - non-bare', async () => {
    mockShouldUseYarn.mockResolvedValueOnce(true);
    downloadStreamMock.mockImplementation((path: string) => {
      const stream = new Readable();
      stream._read = () => {};
      stream.push(`${basename(path)} contents`);
      stream.push(null);
      return stream;
    });

    await createProject('my-project', false, workspaceExamplesRoot);
    expect(downloadStream).toHaveBeenCalledWith(`https://examples.diez.org/${diezVersion}/createproject/project.tgz`);

    expect(mockWriter).toHaveBeenCalledWith('project.tgz contents');
    expect(x).toHaveBeenCalledWith({cwd: expect.anything()});
  });

  test('project generation - bare', async () => {
    mockShouldUseYarn.mockResolvedValueOnce(true);
    await createProject('my-project', true, workspaceExamplesRoot);
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
    expect(exportedType.getName()).toBe('DesignLanguage');
  });
});
