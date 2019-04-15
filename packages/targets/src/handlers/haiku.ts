import {HandlerProvider} from '@diez/compiler';
import {existsSync, readFile} from 'fs-extra';
import {resolve} from 'path';
import {viewRoot} from '.';

const template: HandlerProvider = {
  path: '/haiku/(*)',
  factory: () => (request, response) => {
    let packagePath = '';
    try {
      packagePath = require.resolve(request.params[0]);
    } catch (e) {
      response.status(404);
      return response.end();
    }

    const standandaloneIndexPath = packagePath.replace('index.js', 'index.standalone.js');
    if (!existsSync(standandaloneIndexPath)) {
      response.status(404);
      return response.end();
    }

    readFile(standandaloneIndexPath, (_, standaloneIndexContentBuffer) => {
      const standaloneIndexContent = standaloneIndexContentBuffer.toString();
      const matches = standaloneIndexContent.match(/var (\w+)=/);
      if (!matches) {
        response.status(404);
        return response.end();
      }
      response.render(resolve(viewRoot, 'haiku'), {standaloneIndexContent, adapterName: matches[1]});
    });
  },
};

export = template;
