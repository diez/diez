import {CliCommandProvider} from '../api';

const provider: CliCommandProvider = {
  name: 'install <package-id>',
  description: 'Install a Diez Enterprise Edition add-on.',
  loadAction: () => import('./install.action'),
};

export = provider;
