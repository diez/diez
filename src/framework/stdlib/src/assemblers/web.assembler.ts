import {Target} from '@diez/engine';
import {WebOutput} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../utils';
import {BaseAssembler} from './base';

/**
 * The root location for source files.
 */
const coreWeb = join(sourcesPath, Target.Web, 'core');

class WebAssember extends BaseAssembler<WebOutput> {
  async addCoreFiles () {
    this.output.sources.add(join(coreWeb, 'Diez.js'));
    this.output.declarations.add(join(coreWeb, 'Diez.d.ts'));
  }
}

export = (output: WebOutput) => new WebAssember(output);
