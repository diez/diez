# `@diez/designfile`

Exports assets from design files. We currently support Sketch, Illustrator and Figma documents.

### Usage

```js
import {FigmaExporter} from '@diez/designfile';
const figma = FigmaExporter.create();
figma.token = 'some-token';
await figma.exportSVG('https://www.figma.com/path/to/some/file', 'out/folder');
```
