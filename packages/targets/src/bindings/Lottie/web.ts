import {Lottie} from '@diez/prefabs';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Lottie> = {
  sources: [
    join(sourcesPath, 'web', 'js', 'bindings', 'Lottie.js'),
  ],
  declarations: [
    join(sourcesPath, 'web', 'js', 'bindings', 'Lottie.d.ts'),
  ],
  dependencies: [{
    packageJson: {
      name: 'lottie-web',
      versionConstraint: '^5.5.2',
    },
  }],
};

export = binding;
