declare module 'fs-walk' {
  import {Stats} from 'fs';

  function walkSync(
    path: string,
    callback: (basedir: string, filename: string, stats: Stats) => void,
  ): void;

  export {walkSync};
}
