import {Point2D} from '@diez/prefabs';
import {IosBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Point2D> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Point2D+Binding.swift'),
  ],
};

export = binding;
