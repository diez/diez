const path = jest.genMockFromModule('path');
const originalPath = jest.requireActual('path');

export const resolve = (dir: string) => {
  return dir;
};

export const extname = originalPath.extname;
export const join = originalPath.join;
export const sep = originalPath.sep;

export default path;
