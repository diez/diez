import {TextStyle} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';
import {initializer as colorInitializer} from '../Color/android';

const binding: AndroidBinding<TextStyle> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'TextStyle.kt')],
  imports: [
    'java.io.File as CoreFile',
    'android.graphics.Typeface',
    'android.widget.TextView',
  ],
  initializer: (instance) =>
    `TextStyle("${instance.font}", ${instance.fontSize}F, ${colorInitializer!(instance.color)})`,
};

export = binding;
