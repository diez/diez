import {CliCommandProvider} from '../api';

const provider: CliCommandProvider = {
  name: 'activate [key]',
  description: 'Activate a diez enterprise seat.',
  loadAction: () => import('./activate.action'),
};

export = provider;
