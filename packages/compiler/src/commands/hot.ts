import {CliCommandProvider} from '@diez/cli-core';
import {options, preinstall} from './compile';

const provider: CliCommandProvider = {
  preinstall,
  options,
  name: 'hot',
  description: 'Run Diez in hot mode.',
  loadAction: () => import('./hot.action'),
};

export = provider;
