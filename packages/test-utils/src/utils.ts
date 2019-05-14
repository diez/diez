/**
 * Assigns a mock to a property on an object, and returns both the mock and a method to restore it.
 */
export const assignMock = (original: any, property: string, value: any = jest.fn()) => {
  const prototype = Object.getOwnPropertyDescriptor(original, property);
  Object.defineProperty(original, property, {value});
  return {
    mock: value,
    restore: () => {
      Object.defineProperty(original, property, prototype || {});
    },
  };
};
