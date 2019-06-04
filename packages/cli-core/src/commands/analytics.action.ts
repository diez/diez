import {disableAnalytics, enableAnalytics} from '@diez/storage';
import {CliAction} from '../api';
import {info} from '../reporting';

const analyticsAction: CliAction = async (_, toggle: string) => {
  switch (toggle) {
    case 'on':
      await enableAnalytics();
      info('Diez analytics are enabled. Learn more here: https://diez.org/analytics');
      break;
    case 'off':
      await disableAnalytics();
      info('Diez analytics are disabled. Learn more here: https://diez.org/analytics');
      break;
    default:
      throw new Error(`Unknown state: "${toggle}". Please specify either "on" or "off".`);
  }
};

export = analyticsAction;
