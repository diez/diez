import {disableAnalytics, enableAnalytics} from '@diez/storage';
import {CliAction} from '../api';
import {Log} from '../reporting';

const analyticsAction: CliAction = async (_, toggle: string) => {
  switch (toggle) {
    case 'on':
      await enableAnalytics();
      Log.info('Diez analytics and crash reporting are enabled. Learn more here: https://diez.org/analytics');
      break;
    case 'off':
      await disableAnalytics();
      Log.info('Diez analytics and crash reporting are disabled. Learn more here: https://diez.org/analytics');
      break;
    default:
      throw new Error(`Unknown state: "${toggle}". Please specify either "on" or "off".`);
  }
};

export = analyticsAction;
