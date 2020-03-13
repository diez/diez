import {clickLinkByUrl, selectors, testWithDefaults} from '../utils';

const detailsVisibleClass = 'docs-item--details-visible';

module.exports = testWithDefaults({
  'Shows class-level comments for the topmost selected property': (browser) => {
    clickLinkByUrl(browser, '/DocsApp');
    browser.expect.element(selectors.main).text.to.contain('This is a class-level comment in DocsApp.');
    browser.expect.element(selectors.main).text.to.not.contain('This is a class-level comment in MyDesign.');

    clickLinkByUrl(browser, '/myDesign');
    browser.expect.element(selectors.main).text.to.contain('This is a class-level comment in MyDesign.');
  },

  'Shows property-level comments for instances': async (browser) => {
    clickLinkByUrl(browser, '/DocsApp');
    await browser.windowSize('current', 1300, 1300);
    browser.expect.element(selectors.main).text.to.contain('This is a property-level comment in DocsApp.myDesign.');
  },

  'Clicking on a primitive does not show a detail page': (browser) => {
    browser.click('link text', 'rawText');
    browser.expect.url().to.contain('/DocsApp#rawText');
    browser.expect.element(selectors.detailsTable).to.not.be.present;
  },

  'Hovering a non-primitive shows a preview': (browser) => {
    clickLinkByUrl(browser, '/DocsApp');
    browser.moveToElement(selectors.items.image, 0, 0);
    browser.expect.element(selectors.items.image).to.have.attribute('class').which.contains(detailsVisibleClass);
  },

  'Hovering a primitive does nothing': (browser) => {
    clickLinkByUrl(browser, '/DocsApp');
    browser.moveToElement(selectors.items.text, 0, 0);
    browser.expect.element(selectors.items.text).to.have.attribute('class').which.not.contains(detailsVisibleClass);
  },
});
