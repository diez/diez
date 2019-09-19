import {PrimitiveType} from '../src/api';
import {createProgramForFixture, TestCompiler} from './helpers';

describe('compiler', () => {
  test('filtered', async () => {
    const program = await createProgramForFixture('Filtered');
    expect(program.targetComponents.size).toBe(1);
    expect(Array.from(program.localComponentNames)).toEqual(['Filtered']);
    const compiler = new TestCompiler(program);
    await compiler.start();
    expect(compiler.writeSdkMock).toHaveBeenCalled();
    expect(compiler.printUsageInstructionsMock).toHaveBeenCalled();
    expect(compiler.output.processedComponents.has('Filtered')).toBe(true);
    const ledger = compiler.output.processedComponents.get('Filtered')!;
    expect(ledger.spec.componentName).toEqual('Filtered');
    // The ledger does not have `excludeMe` even though it was defined on the component.
    expect(ledger.instances.size).toBe(1);

    // The excluded property is not included in the ledger spec.
    expect(ledger.spec.properties).toEqual({
      includeMe: {initializer: 'true', type: PrimitiveType.Boolean, isPrimitive: true, depth: 0},
      includeUs: {initializer: '[true, true, true]', type: `Array<${PrimitiveType.Boolean}>`, isPrimitive: false, depth: 1},
    });
  });
});
