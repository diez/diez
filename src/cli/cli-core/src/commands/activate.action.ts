import {performActivation} from '@diez/sdk-inkstone';
import {Registry} from '@diez/storage';
import enquirer from 'enquirer';
import {join} from 'path';
import {CliAction} from '../api';
import {loadingMessage, Log} from '../reporting';
import {pager} from '../utils';

interface Answers {
  acceptedTerms: boolean;
}

const activateAction: CliAction = async (_, activationKey: string) => {
  if (!activationKey) {
    throw new Error('You must provide an activation key.');
  }

  await pager({source: join(__dirname, '..', '..', 'assets', 'diez-activate-license.txt')});

  const {acceptedTerms} = (await enquirer.prompt<Answers>({
    type: 'confirm',
    name: 'acceptedTerms',
    message: 'Do you agree to the terms and conditions?',
    required: true,
    initial: true,
  }));

  if (!acceptedTerms) {
    throw new Error('You must accept the terms and conditions to continue.');
  }

  const activationMessage = loadingMessage('Activating your license...');
  const response = await performActivation({activationKey});
  activationMessage.stop();

  if ('error' in response) {
    throw response.error;
  }

  await Registry.set({activationKey});

  Log.info('Your key has been activated! You are now using Diez Enterprise Edition.');
};

export = activateAction;
