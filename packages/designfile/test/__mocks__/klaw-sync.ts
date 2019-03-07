import {mockFileSystem} from '@livedesigner/test-utils';

export default () => {
  return Object.keys(mockFileSystem).map((k) => {
    return {
      path: k,
    };
  });
};
