import {PrimitiveType} from '../src/api';
import {createProgramForFixture, TestTargetCompiler} from './helpers';

describe('target compiler', () => {
  test('filtered', async () => {
    const program = await createProgramForFixture('Filtered');
    expect(program.targetComponents.size).toBe(1);
    expect(program.localComponentNames).toEqual(['Filtered']);
    const compiler = new TestTargetCompiler(program);
    await compiler.start();
    expect(compiler.writeSdkMock).toHaveBeenCalled();
    expect(compiler.printUsageInstructionsMock).toHaveBeenCalled();
    expect(compiler.output.processedComponents.has('Filtered')).toBe(true);
    const ledger = compiler.output.processedComponents.get('Filtered')!;
    expect(ledger.spec.componentName).toEqual('Filtered');
    // The ledger does not have `excludeMe` even though it was defined on the component.
    expect(ledger.instances.size).toBe(1);
    const instance = ledger.instances.values().next().value;
    expect(instance.boundStates.has('excludeMe'));
    expect(instance.boundStates.has('includeMe'));
    expect(instance.boundStates.has('includeUs'));

    expect(instance.boundStates.get('excludeMe')).toEqual({targets: ['not-test']});

    // The excluded property is not included in the ledger spec.
    expect(ledger.spec.properties).toEqual({
      includeMe: {initializer: 'true', type: PrimitiveType.Boolean, isPrimitive: true, depth: 0},
      includeUs: {initializer: '[true, true, true]', type: `Array<${PrimitiveType.Boolean}>`, isPrimitive: false, depth: 1},
    });
  });
});
