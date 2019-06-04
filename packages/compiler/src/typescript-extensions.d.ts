import ts from 'typescript';

type ResolvedModuleMap = Map<string, ts.ResolvedModuleFull | undefined>;

declare module 'typescript' {
  export interface SourceFile {
    // See https://github.com/Microsoft/TypeScript/issues/17546 for why this is necessary.
    resolvedModules?: ResolvedModuleMap;
  }
}
