import {readFileSync, writeJSONSync} from 'fs-extra';
import packageJson from 'package-json';
import {resolve} from 'path';
import {CliAction} from '../api';
import {getPackageManager} from '../package-manager';
import {loadingMessage, Log} from '../reporting';

interface UpdateOptions {
  toVersion?: string;
}

const updateVersion = async (suggestedVersion?: string) => {
  const {version, versions} = await packageJson('diez', {allVersions: true});

  if (suggestedVersion) {
    if (!versions[suggestedVersion]) {
      throw new Error('Invalid version provided.');
    }

    return suggestedVersion;
  }

  return version;
};

const isDiezPackage = (packageName: string) => {
  return packageName === 'diez' || packageName.includes('@diez/');
};

const updateAction: CliAction = async (options: UpdateOptions) => {
  const version = await updateVersion(options.toVersion);
  const updateMessage = loadingMessage(`Updating Diez and related packages to version ${version}`);
  const userPackageJson = JSON.parse(readFileSync(resolve('./package.json')).toString());
  const dependencyGroups = ['dependencies', 'devDependencies', 'optionalDependencies'];
  const packagesToUpdate = new Set<string>();

  for (const dependencyGroup of dependencyGroups) {
    for (const [name] of Object.entries(userPackageJson[dependencyGroup] || {})) {
      if (isDiezPackage(name)) {
        packagesToUpdate.add(name);
        userPackageJson[dependencyGroup][name] = `^${version}`;
      }
    }
  }

  if (!packagesToUpdate.size) {
    Log.warning('Unable to find Diez packages to update, please try updating package.json manually or open an issue.');
    return;
  }

  writeJSONSync('./package.json', userPackageJson, {spaces: 2});

  const packageManager = await getPackageManager();
  await packageManager.installAllDependencies();
  updateMessage.stop();

  Log.info('✨ Diez packages updated.');
};

export = updateAction;
