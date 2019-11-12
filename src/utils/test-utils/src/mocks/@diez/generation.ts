/**
 * A mock singleton for `codegenDesignLanguage` in `@diez/generation`.
 */
export const mockCodegen = jest.fn();

/**
 * A mock singleton for `locateFont`.
 */
export const mockLocateFont = jest.fn();

/**
 * Module mock factory.
 */
export const mockGenerationFactory = () => ({
  ...jest.requireActual('@diez/generation'),
  codegenDesignLanguage: mockCodegen,
  locateFont: mockLocateFont,
});
