import {run, siteRoot} from '../internal/helpers';

export = {
  name: 'release-site',
  description: 'Releases the Diez site.',
  action: () => {
    run('yarn build', siteRoot);
    run('aws s3 sync dist s3://diez-www-secret', siteRoot);
    run(`aws cloudfront create-invalidation --distribution-id=${process.env.DIEZ_WWW_DISTRIBUTION_SECRET} --paths "/*"`);
  },
};
