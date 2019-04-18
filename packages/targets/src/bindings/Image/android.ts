import {Image} from '@diez/designsystem';
import {join} from 'path';
import {AndroidBinding} from '../../targets/android.api';
import {sourcesPath} from '../../utils';
import {initializer as fileInitializer} from '../File/android';

const binding: AndroidBinding<Image> = {
  sources: [join(sourcesPath, 'android', 'bindings', 'Image.kt')],
  imports: [
    'android.content.Context',
    'android.graphics.Bitmap',
    'android.graphics.Shader',
    'android.graphics.drawable.BitmapDrawable',
    'android.graphics.drawable.Drawable',
    'android.view.View',
    'android.widget.ImageView',
    'com.bumptech.glide.Glide',
    'com.bumptech.glide.RequestBuilder',
    'com.bumptech.glide.RequestManager',
    'com.bumptech.glide.request.RequestListener',
    'com.bumptech.glide.request.target.CustomTarget',
    'com.bumptech.glide.request.target.SimpleTarget',
    'com.bumptech.glide.request.transition.Transition',
    'kotlin.concurrent.thread',
  ],
  initializer: (instance) =>
    `Image(${fileInitializer!(instance.file)}, ${Math.round(instance.width)}, ${Math.round(instance.height)}, ${instance.scale}F)`,
};

export = binding;
