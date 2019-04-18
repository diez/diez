import {FontRegistry} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/android';

const binding: AndroidBinding<FontRegistry> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'FontRegistry.kt')],
  imports: [
    'java.io.File as CoreFile',
    'android.graphics.Typeface',
    'com.jaredrummler.truetypeparser.TTFFile',
    'kotlinx.coroutines.GlobalScope',
    'kotlinx.coroutines.launch',
    'java.io.BufferedInputStream',
    'java.io.FileOutputStream',
    'java.lang.Exception',
  ],
  initializer: (instance) => `FontRegistry(arrayOf<File>(
${instance.files.map((file) => `        ${fileInitializer!(file)},`).join('\n')}
    ))`,
};

export = binding;
