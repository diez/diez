declare namespace jest {
  interface Matchers<R> {
    toMatchFile(goldenFile: string): R;
    toMatchDirectory(goldenDirectory: string): R;
  }
}
