import {CliCommandProvider} from '@diez/cli-core';
import {options, preinstall} from './compile';
import {hotAction as action} from './hot.action';

const provider: CliCommandProvider = {
  action,
  preinstall,
  options,
  name: 'hot',
  description: 'Run Diez in hot mode.',
};

export = provider;
