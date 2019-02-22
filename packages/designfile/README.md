# `@livedesigner/designfile`

Export assets from design files, we currently support Sketch, Illustrator and Figma documents.

### Usage

```js
import {figma} from '@livedesigner/designfile/lib';

if (figma.canParse(source)) {
  await figma.exportSVG(source, 'out/folder');
}
```
