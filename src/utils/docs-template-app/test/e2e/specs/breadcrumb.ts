import {clickLinkByUrl, selectors, testWithDefaults} from '../utils';

module.exports = testWithDefaults({
  'Displays the correct hierarchy': (browser) => {
    clickLinkByUrl(browser, '/DocsApp/palette/primary');
    browser.expect.elements(selectors.breadcrumb.item).count.to.equal(3);
    browser.expect.element(selectors.breadcrumb.wrapper).text.to.contain('DocsApp');
    browser.expect.element(selectors.breadcrumb.wrapper).text.to.contain('palette');
    browser.expect.element(selectors.breadcrumb.wrapper).text.to.contain('primary');
  },

  'Allows to navigate the design language by clicking on the items': (browser) => {
    clickLinkByUrl(browser, '/DocsApp/palette/primary');
    browser.click(selectors.breadcrumb.item);
    browser.expect.url().to.endWith('/DocsApp');
  },
});
