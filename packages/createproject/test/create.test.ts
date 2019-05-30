import {assignMock, mockCliCoreFactory, registerExpectations} from '@diez/test-utils';
jest.doMock('@diez/cli-core', mockCliCoreFactory);
const downloadStreamMock = jest.fn();
jest.doMock('@diez/storage', () => ({
  ...jest.requireActual('@diez/storage'),
  downloadStream: downloadStreamMock,
}));
const mockPackageNameValidator = jest.fn();
jest.doMock('validate-npm-package-name', () => mockPackageNameValidator);

import {downloadStream} from '@diez/storage';
import {ensureFileSync, removeSync} from 'fs-extra';
import {join} from 'path';
import {x} from 'tar';
import {ClassDeclaration, Project} from 'ts-morph';
import {createProject} from '../src/utils';

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', 'examples');
const myProjectRoot = join(workspaceExamplesRoot, 'my-project');

jest.mock('tar');

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e5);
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

    await expect(createProject('my-project', workspaceExamplesRoot)).rejects.toThrow();
  });

  test('existing project root - file', async () => {
    ensureFileSync(myProjectRoot);
    await expect(createProject('my-project', workspaceExamplesRoot)).rejects.toThrow();
  });

  test('existing project root - module', async () => {
    ensureFileSync(join(myProjectRoot, 'package.json'));
    await expect(createProject('my-project', workspaceExamplesRoot)).rejects.toThrow();
  });

  test('unable to use NPM', async () => {
    ensureFileSync(join(myProjectRoot, 'package.json'));
    await expect(createProject('my-project', workspaceExamplesRoot)).rejects.toThrow();
  });

  test('asset download failure', async () => {
    downloadStreamMock.mockResolvedValue(null);
    await expect(createProject('my-project', workspaceExamplesRoot)).rejects.toThrow();
  });

  test('project generation', async () => {
    downloadStreamMock.mockResolvedValue({
      pipe: jest.fn(),
    });

    await createProject('my-project', workspaceExamplesRoot);
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
    expect(downloadStream).toHaveBeenCalledWith('https://examples.diez.org/10.0.0-alpha.0/createproject/assets.tgz');
    expect(x).toHaveBeenCalledWith({cwd: myProjectRoot});
  });
});
