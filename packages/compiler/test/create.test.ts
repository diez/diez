import {registerExpectations} from '@diez/test-utils';
import {removeSync} from 'fs-extra';
import {join} from 'path';
import {ClassDeclaration, Project} from 'ts-morph';
import {createProject} from '../src/utils';
import {workspaceExamplesRoot} from './helpers';

const myProjectRoot = join(workspaceExamplesRoot, 'my-project');

beforeAll(() => {
  // Allow 1 minute per test. Hopefully they don't actually take that long!
  jest.setTimeout(6e5);
  registerExpectations();
  removeSync(myProjectRoot);
});

afterEach(() => {
  removeSync(myProjectRoot);
});

describe('create project', () => {
  test('project generation', async () => {
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
    expect(exportedType.getName()).toBe('MyProjectDesignSystem');
  });
});
