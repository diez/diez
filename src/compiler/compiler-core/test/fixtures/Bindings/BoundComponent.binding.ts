import {getTempFileName} from '@diez/storage';
import {writeFileSync} from 'fs-extra';
import {TargetBinding} from '../../../src/api';
import {BoundComponent} from './Bindings';

const binding: TargetBinding<BoundComponent> = {
  sources: ['bound-source'],
  assetsBinder: async (_, __, output) => {
    output.assetBindings.set('foo', {contents: 'bar'});
    const copiedFile = getTempFileName();
    writeFileSync(copiedFile, 'bat');
    output.assetBindings.set('baz', {contents: copiedFile, copy: true});
  },
};

export = binding;
