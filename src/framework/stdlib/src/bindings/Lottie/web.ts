import {Lottie} from '@diez/prefabs';
import {WebBinding, WebLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: WebBinding<Lottie> = {
  sources: [
    join(sourcesPath, 'web', 'bindings', 'Lottie.js'),
  ],
  declarations: [
    join(sourcesPath, 'web', 'bindings', 'Lottie.d.ts'),
  ],
  examples: [
    {
      example: 'Usage',
      snippets: [
        {
          lang: WebLanguages.JavaScript,
          template: `
const wrapper = document.getElementById('lottie-wrapper');
{{path}}.mount(wrapper);
          `,
        },
      ],
    },
  ],
  dependencies: [{
    packageJson: {
      name: 'lottie-web',
      versionConstraint: '^5.5.2',
    },
  }],
};

export = binding;
