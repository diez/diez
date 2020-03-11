import {readJson, writeJson} from 'fs-extra';
import {CliAction} from '../api';
import {getPackageManager} from '../package-manager';
import {loadingMessage, Log} from '../reporting';
import {getDiezVersionInformationFromNpm, isDiezPackage} from '../utils';

interface UpdateOptions {
  toVersion?: string;
}

const updateAction: CliAction = async (options: UpdateOptions) => {
  const {latestDiezVersion, allDiezVersions} = await getDiezVersionInformationFromNpm();
  const versionToUpdate = options.toVersion || latestDiezVersion;

  if (!allDiezVersions[versionToUpdate]) {
    throw new Error('Invalid version provided.');
  }

  const updateMessage = loadingMessage(`Updating Diez and related packages to version ${versionToUpdate}`);
  const userPackageJson = await readJson('./package.json');
  const dependencyGroups = ['dependencies', 'devDependencies', 'optionalDependencies'];
  const packagesToUpdate = new Set<string>();

  for (const dependencyGroup of dependencyGroups) {
    for (const [name] of Object.entries(userPackageJson[dependencyGroup] || {})) {
      if (isDiezPackage(name)) {
        packagesToUpdate.add(name);
        userPackageJson[dependencyGroup][name] = `^${versionToUpdate}`;
      }
    }
  }

  if (!packagesToUpdate.size) {
    Log.warning('Unable to find Diez packages to update, please try updating package.json manually or open an issue.');
    return;
  }

  await writeJson('./package.json', userPackageJson, {spaces: 2});

  const packageManager = await getPackageManager();
  await packageManager.installAllDependencies();
  updateMessage.stop();

  Log.info('✨ Diez packages updated.');
};

export = updateAction;
