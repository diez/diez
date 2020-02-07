/* tslint:disable:max-line-length */
import {canRunCommand, Format, getPackageManager, isChildProcess, isMacOS, loadingMessage, locateBinaryMacOS, Log} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {ChildProcess, execSync, fork, spawn} from 'child_process';
import {readdirSync} from 'fs-extra';
import {join, resolve} from 'path';
import {gt} from 'semver';

const minCocoapodsVersion = '1.7.0';

const guideUrls = {
  [Target.Android]: 'https://diez.org/getting-started/kotlin.html',
  [Target.Ios]: 'https://diez.org/getting-started/swift.html',
  [Target.Web]: 'https://diez.org/getting-started/javascript.html',
};

export = async (_: {}, target: Target) => {
  if (![Target.Android, Target.Web, Target.Ios].includes(target)) {
    Log.error(`Usage: diez start <${Target.Android}|${Target.Ios}|${Target.Web}>`);
    process.exit(1);
    return;
  }

  if (target === Target.Ios) {
    if (!await canRunCommand('pod --version')) {
      Log.error('CocoaPods is required to run the iOS example project. See installation options:');
      Log.error('https://guides.cocoapods.org/using/getting-started.html#getting-started');
      process.exit(1);
      return;
    }

    const cocoaPodsVersion = execSync('pod --version').toString().trim();
    if (gt(minCocoapodsVersion, cocoaPodsVersion)) {
      Log.error(`CocoaPods ${minCocoapodsVersion} or greater is required to run the iOS example project. See upgrade options:`);
      Log.error('https://guides.cocoapods.org/using/getting-started.html#getting-started');
      process.exit(1);
      return;
    }
  }

  const diez = require.resolve('diez');
  const root = global.process.cwd();
  const targetRoot = resolve(root, '..', 'example-codebases', target);
  const packageManager = await getPackageManager();

  Log.comment(`Building Diez project for target ${target}...`);
  let hotProcess!: ChildProcess;
  const guideUrl = guideUrls[target];
  switch (target) {
    case Target.Android:
      packageManager.execBinary('diez compile -t android', {stdio: 'inherit'});
      Log.comment('Starting the Diez hot server...');
      hotProcess = fork(diez, ['hot', '-t', 'android'], {stdio: 'inherit'});
      break;
    case Target.Ios:
      packageManager.execBinary('diez compile -t ios --cocoapods', {stdio: 'inherit'});
      Log.comment('Installing CocoaPods dependencies in example codebase...');
      execSync('pod install', {cwd: targetRoot, stdio: 'inherit'});
      Log.comment('Starting the Diez hot server...');
      hotProcess = fork(diez, ['hot', '-t', 'ios'], {stdio: 'inherit'});
      break;
    case Target.Web:
      packageManager.execBinary('diez compile -t web', {stdio: 'inherit'});
      const installingMessage = loadingMessage('Installing Node dependencies in example codebase...');
      await packageManager.installAllDependencies({cwd: targetRoot});
      installingMessage.stop();
      Log.comment('Starting the Diez hot server...');
      hotProcess = fork(diez, ['hot', '-t', 'web'], {stdio: 'inherit'});
      break;
  }

  // istanbul ignore next
  const runApp = () => {
    Log.comment(`
Your Diez project is now running in hot mode for ${target}.

In hot mode, Diez observes and emits changes to your design language in real time.

To learn more, follow along with the guide at:

  ${Format.code(guideUrl)}
`);

    switch (target) {
      case Target.Android:
        if (isMacOS() && locateBinaryMacOS('com.google.android.studio')) {
          return execSync(`open -b com.google.android.studio ${targetRoot}`);
        }
        return Log.comment(`Open ${targetRoot} in Android Studio to run the example project.`);
      case Target.Ios:
        try {
          const xcworkspaceFilename = readdirSync(targetRoot).find((filename) => filename.endsWith('.xcworkspace'));
          if (!xcworkspaceFilename) {
            // This should never happen.
            return;
          }
          const xcworkspaceRoot = join(targetRoot, xcworkspaceFilename);
          if (isMacOS() && locateBinaryMacOS('com.apple.dt.Xcode')) {
            return execSync(`open ${xcworkspaceRoot}`);
          }
          return Log.comment(`Open ${xcworkspaceRoot} in Xcode to run the example project.`);
        } catch (_) {
          // This should never happen.
          return;
        }
      case Target.Web:
        return spawn(packageManager.binary, ['start'], {cwd: targetRoot, stdio: 'inherit', shell: true});
    }
  };

  let appProcess: void | ChildProcess | Buffer;

  const handleBuilt = (message: string) => {
    if (message === 'built') {
      hotProcess.removeListener('message', handleBuilt);
      appProcess = runApp();
    }
  };

  hotProcess.on('message', handleBuilt);
  hotProcess.on('exit', () => {
    if (isChildProcess(appProcess)) {
      appProcess.kill();
    }
  });
};
