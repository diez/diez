const path: any = jest.genMockFromModule('path');
const originalPath = jest.requireActual('path');

path.resolve = (dir: string) => {
  return dir;
};

export const extname = originalPath.extname;
export const join = originalPath.join;
export const resolve = path.resolve;
export default path;
