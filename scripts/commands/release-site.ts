import {resolve} from 'path';
import {run, siteRoot} from '../internal/helpers';

export = {
  name: 'release-site',
  description: 'Releases the Diez site.',
  loadAction: () => () => {
    run('yarn diez compile -t web', resolve(siteRoot, '..', 'design-language'));
    run('yarn build', siteRoot);
    run('aws s3 sync docs/.vuepress/dist s3://diez-www-secret', siteRoot);
    run(`aws cloudfront create-invalidation --distribution-id=${process.env.DIEZ_WWW_DISTRIBUTION_SECRET} --paths "/*"`);
  },
};
