import ts from 'typescript';

type ResolvedModuleMap = Map<string, ts.ResolvedModuleFull | undefined>;

interface ReusableBuilderProgramState {
  changedFilesSet?: ReadonlyMap<string, true>;
}

declare module 'typescript' {
  export interface SourceFile {
    // See https://github.com/Microsoft/TypeScript/issues/17546 for why this is necessary.
    resolvedModules?: ResolvedModuleMap;
  }

  export interface SemanticDiagnosticsBuilderProgram {
    getState(): ReusableBuilderProgramState;
  }
}
