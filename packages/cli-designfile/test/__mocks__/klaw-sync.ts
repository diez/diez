import {__fileSystem} from './fs-extra';

const klawSync = () => {
  return Object.keys(__fileSystem).map((k) => {
    return {
      path: k,
    };
  });
};

export default klawSync;
