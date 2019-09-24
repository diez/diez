import {Target} from '@diez/engine';
import {IosOutput} from '@diez/targets';
import {basename, join} from 'path';
import {sourcesPath} from '../utils';
import {BaseAssembler} from './base';

/**
 * The root location for source files.
 */
const coreIos = join(sourcesPath, Target.Ios, 'core');

class IosAssembler extends BaseAssembler<IosOutput> {
  async addCoreFiles () {
    const sources = [
      'Diez.swift',
      'Environment.swift',
      'Bundle+Environment.swift',
      'Bundle+Static.swift',
      'ReflectedCustomStringConvertible.swift',
    ];

    return Promise.all(sources.map((source) => {
      const destination = join(this.output.sourcesRoot, 'Core', basename(source));
      this.output.sources.add(destination);
      return this.copyFile(join(coreIos, source), destination);
    }));
  }
}

export = (output: IosOutput) => new IosAssembler(output);
