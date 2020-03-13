import {testWithDefaults} from '../utils';

module.exports = testWithDefaults({
  'Navigating to / automatically redirects to the first tree root element': (browser) => {
    browser.url(`${process.env.VUE_DEV_SERVER_URL}`);
    browser.pause(10);
    browser.expect.url().to.endWith('/DocsApp');
  },
});
