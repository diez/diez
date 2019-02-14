# `@livedesigner/designfile`

Export assets from design files, we currently support Sketch, Illustrator and Figma documents.

### Usage

You can let the module figure out the correct parser for you:

```js
import {exportSVG, canParse} from '@livedesigner/designfile';

if (canParse('my/design/file.ai')) {
  await exportSVG('my/design/file.ai', 'out/folder');
}
```

or you can use any of the parsers individually:

```js
import {figma} from '@livedesigner/designfile/lib/exporters/figma';

await figma.exportSVG('https://figma.com/file/<key>/<title>', 'out/folder');
```
