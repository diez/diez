/* tslint:disable:max-line-length */
import {canRunCommand, Format, isMacOS, Log} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {locateBinaryMacOS} from '@diez/sources';
import {ChildProcess, execSync, fork, spawn} from 'child_process';
import {join} from 'path';
import {gt} from 'semver';

const minCocoapodsVersion = '1.7.0';

const guideUrls = {
  [Target.Android]: 'https://beta.diez.org/getting-started/kotlin.html',
  [Target.Ios]: 'https://beta.diez.org/getting-started/swift.html',
  [Target.Web]: 'https://beta.diez.org/getting-started/javascript.html',
};

export = async (_: {}, target: Target) => {
  if (![Target.Android, Target.Web, Target.Ios].includes(target)) {
    Log.error(`Usage: diez start <${Target.Android}|${Target.Ios}|${Target.Web}>`);
    process.exit(1);
    return;
  }

  // Make sure Yarn is installed.
  if (!await canRunCommand('yarn --version')) {
    Log.error('Yarn is required to run the example projects. See https://yarnpkg.org for details.');
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

  Log.comment(`Building Diez project for target ${target}...`);
  let hotProcess!: ChildProcess;
  const guideUrl = guideUrls[target];
  switch (target) {
    case Target.Android:
      execSync(`${diez} compile -t android`, {stdio: 'inherit'});
      Log.comment('Starting the Diez hot server...');
      hotProcess = fork(diez, ['hot', '-t', 'android'], {stdio: 'inherit'});
      break;
    case Target.Ios:
      execSync(`${diez} compile -t ios --cocoapods`, {stdio: 'inherit'});
      Log.comment('Installing CocoaPods dependencies in example codebase...');
      execSync('pod install', {cwd: join(root, 'examples', 'ios'), stdio: 'inherit'});
      Log.comment('Starting the Diez hot server...');
      hotProcess = fork(diez, ['hot', '-t', 'ios'], {stdio: 'inherit'});
      break;
    case Target.Web:
      execSync(`${diez} compile -t web`, {stdio: 'inherit'});
      Log.comment('Installing Node dependencies in example codebase...');
      execSync('yarn', {cwd: join(root, 'examples', 'web'), stdio: 'inherit'});
      Log.comment('Starting the Diez hot server...');
      hotProcess = fork(diez, ['hot', '-t', 'web'], {stdio: 'inherit'});
      break;
  }

  // istanbul ignore next
  const runApp = () => {
    Log.comment(`
Your Diez project is now running in hot mode for ${target}.

In hot mode, Diez observes and emits changes to your design system in real time.

To learn more, follow along with the guide at:

  ${Format.code(guideUrl)}
`);

    switch (target) {
      case Target.Android:
        if (isMacOS() && locateBinaryMacOS('com.google.android.studio')) {
          return execSync('open -b com.google.android.studio examples/android');
        }
        return Log.comment(`Open ${join('examples', 'android')} in Android Studio to run the example project.`);
      case Target.Ios:
        if (isMacOS() && locateBinaryMacOS('com.apple.dt.Xcode')) {
          return execSync('open examples/ios/PoodleSurf.xcworkspace');
        }
        return Log.comment(`Open ${join('examples', 'ios', 'PoodleSurf.xcworkspace')} in Xcode to run the example project.`);
      case Target.Web:
        return spawn(
          'yarn',
          ['start'],
          {cwd: join(root, 'examples', 'web'), stdio: 'inherit'},
        );
    }
  };

  const handleBuilt = (message: string) => {
    if (message === 'built') {
      hotProcess.off('message', handleBuilt);
      runApp();
    }
  };
  hotProcess.on('message', handleBuilt);
};
