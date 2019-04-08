import {CompilerTargetProvider} from '@livedesigner/compiler';
import {webHandler as handler} from './web.handler';

const target: CompilerTargetProvider = {
  handler,
  name: 'web',
};

export = target;
