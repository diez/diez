import {CompilerTargetProvider} from '@livedesigner/compiler';
import {iosHandler as handler} from './ios.handler';

const target: CompilerTargetProvider = {
  handler,
  name: 'ios',
};

export = target;
