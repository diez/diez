import {Point2D} from '@diez/prefabs';
import {join} from 'path';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Point2D> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Point2D+Binding.swift'),
  ],
};

export = binding;
