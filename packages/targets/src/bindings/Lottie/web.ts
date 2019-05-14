import {Lottie} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Lottie> = {
  sources: [
    join(sourcesPath, 'web', 'bindings', 'Lottie.js'),
    join(sourcesPath, 'web', 'bindings', 'File.js'),
  ],
  declarations: [
    join(sourcesPath, 'web', 'bindings', 'Lottie.d.ts'),
    join(sourcesPath, 'web', 'bindings', 'File.d.ts'),
  ],
  dependencies: [{
    packageJson: {
      name: 'lottie-web',
      versionConstraint: '^5.5.2',
    },
  }],
};

export = binding;
