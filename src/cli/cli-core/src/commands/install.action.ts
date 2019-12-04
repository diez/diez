import {getPackageUrls} from '@diez/sdk-inkstone';
import {Registry} from '@diez/storage';
import {execSync} from 'child_process';
import {readFileSync, writeJSONSync} from 'fs-extra';
import {resolve} from 'path';
import {CliAction} from '../api';
import {loadingMessage, Log} from '../reporting';
import {diezVersion} from '../utils';

const installAction: CliAction = async (_, packageId: string) => {
  const activationMessage = loadingMessage(`Installing ${packageId}`);
  const activationKey = await Registry.get('activationKey');

  if (!activationKey) {
    throw new Error('Unable to find an activation key, please run `diez activate <key>` to activate your license.');
  }

  const response = await getPackageUrls({
    activationKey,
    names: [packageId],
    version: diezVersion,
  });

  if ('error' in response) {
    throw response.error;
  }

  const packageJson = JSON.parse(readFileSync(resolve('./package.json')).toString());
  writeJSONSync('./package.json', packageJson, {spaces: 2});

  execSync(`yarn add ${response.packageUrls['@diez/docs']}`, {stdio: 'inherit'});
  activationMessage.stop();
  Log.info('Package installed!');
};

export = installAction;
