import {Typograph} from '@diez/prefabs';
import {AndroidBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: AndroidBinding<Typograph> = {
  sources: [
    join(sourcesPath, 'android', 'bindings', 'Typograph.kt'),
  ],
};

export = binding;
