import {PrimitiveType} from '../src/api';
import {createProgramForFixture, TestCompiler} from './helpers';

describe('compiler', () => {
  test('filtered', async () => {
    const program = await createProgramForFixture('Filtered');
    expect(program.components.size).toBe(1);
    expect(Array.from(program.rootComponentNames)).toEqual(['Filtered']);
    const compiler = new TestCompiler(program);
    await compiler.start();
    expect(compiler.writeSdkMock).toHaveBeenCalled();
    expect(compiler.printUsageInstructionsMock).toHaveBeenCalled();
    expect(compiler.output.processedComponents.has('Filtered')).toBe(true);
    const targetComponent = compiler.output.processedComponents.get('Filtered')!;
    expect(targetComponent.type).toEqual('Filtered');

    // The excluded property is not included in the component spec.
    expect(targetComponent.properties).toEqual([
      {
        initializer: 'true',
        type: PrimitiveType.Boolean,
        isComponent: false,
        depth: 0,
        description: {body: ''},
        name: 'includeMe',
        references: [],
      },
      {
        initializer: '[true, true, true]',
        type: `Array<${PrimitiveType.Boolean}>`,
        isComponent: false,
        depth: 1,
        description: {body: ''},
        name: 'includeUs',
        references: [],
      },
    ]);
  });
});
