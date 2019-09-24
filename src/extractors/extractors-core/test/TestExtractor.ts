import {Extractor, ExtractorInput, Reporters} from '../src/api';

class TestExtractor implements Extractor {
  static canParse (source: string) {
    return Promise.resolve(source === 'foo');
  }

  static create (someArgument: string) {
    return new TestExtractor(someArgument);
  }

  static configure (constructorArgs: string[]) {
    constructorArgs.push('bar');
  }

  static shouldRetryError (error: Error) {
    return error.message === 'RetryMe!';
  }

  static mockExport = jest.fn();

  constructor (readonly someArgument: string) {}

  async export (
    input: ExtractorInput,
    projectRoot: string,
    reporters: Reporters,
  ) {
    TestExtractor.mockExport(
      input,
      projectRoot,
      reporters,
      this.someArgument,
    );
  }
}

export = TestExtractor;
