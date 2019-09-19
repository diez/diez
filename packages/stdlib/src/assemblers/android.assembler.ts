import {Target} from '@diez/engine';
import {AndroidOutput} from '@diez/targets';
import {readFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {basename, join} from 'path';
import {sourcesPath} from '../utils';
import {BaseAssembler} from './base';

/**
 * The root location for source files.
 */
const coreAndroid = join(sourcesPath, Target.Android, 'core');

class AndroidAssembler extends BaseAssembler<AndroidOutput> {
  async addCoreFiles () {
    const sources = [
      'Diez.kt',
      'Environment.kt',
      'Extensions.kt',
    ];

    return Promise.all(sources.map((source) => {
      const template = readFileSync(join(coreAndroid, source)).toString();
      return this.writeFile(
        join(this.output.packageRoot, basename(source)),
        compile(template)({
          packageName: this.output.packageName,
        }),
      );
    }));
  }
}

export = (output: AndroidOutput) => new AndroidAssembler(output);
