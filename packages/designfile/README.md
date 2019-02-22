# `@livedesigner/designfile`

Export assets from design files, we currently support Sketch, Illustrator and Figma documents.

### Usage

```js
import {figma} from '@livedesigner/designfile/lib';

await figma.exportSVG(source, 'out/folder', (progressMessage) => {
  console.log(progressMessage);
});
```
