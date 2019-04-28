import {writeFileSync} from 'fs-extra';
import {TargetBinding} from '../../../src/api';
import {getTempFileName} from '../../../src/utils';
import {BoundComponent} from './Bindings';

const binding: TargetBinding<BoundComponent> = {
  sources: ['bound-source'],
  skipGeneration: true,
  assetsBinder: async (_, __, output) => {
    output.assetBindings.set('foo', {contents: 'bar'});
    const copiedFile = getTempFileName();
    writeFileSync(copiedFile, 'bat');
    output.assetBindings.set('baz', {contents: copiedFile, copy: true});
  },
};

export = binding;
