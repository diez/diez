import {provideTemplate} from '@livedesigner/compiler';
import {existsSync, readFile} from 'fs-extra';
import {resolve} from 'path';
import {viewRoot} from '..';

export = provideTemplate(
  '/assets/(*/)?(*.svg)',
  (projectRoot) => (request, response) => {
    const svgFile = resolve(projectRoot, 'assets', request.params[0] || '', request.params[1]);
    if (!existsSync(svgFile)) {
      response.status(404);
      return response.end();
    }

    readFile(svgFile, (_, svgContentsBuffer) => {
      response.render(resolve(viewRoot, 'svg'), {svgContents: svgContentsBuffer.toString()});
    });
  },
);
