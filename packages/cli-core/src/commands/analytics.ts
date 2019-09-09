import {CliCommandProvider} from '../api';

const provider: CliCommandProvider = {
  name: 'analytics <on|off>',
  description: 'Turn Diez analytics and crash reporting on or off.',
  loadAction: () => import('./analytics.action'),
};

export = provider;
