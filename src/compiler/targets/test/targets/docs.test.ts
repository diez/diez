import { DocsCompiler } from "../../src";
import { Parser } from "@diez/compiler-core";

describe('Docs compiler', () => {
  test('does not allow to be run in hot mode', () => {
    expect(() => new DocsCompiler({hot: true, projectRoot: '', options: {}} as Parser)).toThrow();
  });
});
