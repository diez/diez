import {mockFileSystem} from '../mockUtils';

const klawSync = () => {
  return Object.keys(mockFileSystem).map((k) => {
    return {
      path: k,
    };
  });
};

export default klawSync;
