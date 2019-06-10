import {join} from 'path';
import {root, run} from '../internal/helpers';

const previewSiteRoot = join(root, 'examples', 'preview-site');

export = {
  name: 'release-preview-site',
  description: 'Releases the Diez preview site.',
  action: () => {
    run('yarn build', previewSiteRoot);
    run('aws s3 sync dist s3://diez-www', previewSiteRoot);
    run(`aws cloudfront create-invalidation --distribution-id=${process.env.DIEZ_WWW_DISTRIBUTION} --paths "/*"`);
  },
};
