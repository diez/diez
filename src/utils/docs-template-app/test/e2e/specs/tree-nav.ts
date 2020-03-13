import {clickLinkByUrl, selectors, testWithDefaults} from '../utils';

module.exports = testWithDefaults({
  'Has a navigation menu': (browser) => {
    browser.expect.element(selectors.nav).text.to.contain('DocsApp');
    browser.expect.element(selectors.nav).text.to.contain('palette');
    browser.expect.element(selectors.nav).text.to.contain('myDesign');
    browser.expect.element(selectors.nav).text.to.contain('image');
    browser.expect.element(selectors.nav).text.to.contain('lottie');
    browser.expect.element(selectors.nav).text.to.contain('linearGradient');
    browser.expect.element(selectors.nav).text.to.contain('point');
    browser.expect.element(selectors.nav).text.to.contain('fill');
    browser.expect.element(selectors.nav).text.to.contain('file');
    browser.expect.element(selectors.nav).text.to.contain('shadow');
  },

  'Remembers the state of the three between page loads': (browser) => {
    browser.click('link text', 'myDesign');
    browser.expect.element('.item--active').text.to.equal('myDesign');
    browser.refresh();
    browser.expect.element('.item--active').text.to.equal('myDesign');
    browser.expect.element('myDesign', 'link text').to.have.attribute('class').which.contains('item--open');
    browser.expect.element('palette', 'link text').to.have.attribute('class').which.not.contains('item--open');
  },

  'Allows to navigate by clicking on the tree': (browser) => {
    browser.click('link text', 'palette');
    browser.expect.url().to.contain('/DocsApp/palette');
    browser.click('link text', 'primary');
    browser.expect.url().to.contain('/DocsApp/palette/primary');
    browser.click('link text', 'fill');
    browser.expect.url().to.contain('/DocsApp/fill');
  },

  'Adds special styles to the selected item': (browser) => {
    browser.click('link text', 'palette');
    browser.expect.elements('.item--active').count.to.equal(1);
    browser.expect.element('.item--active').text.to.equal('palette');
  },

  'Adds bold styles to items only when they are selected': async (browser) => {
    browser.click('link text', 'file');
    browser.expect.element('file', 'link text').to.have.css('font-weight').which.equals('700');
    browser.click('link text', 'shadow');
    browser.expect.element('file', 'link text').to.have.css('font-weight').which.not.equals('700');
    browser.expect.element('shadow', 'link text').to.have.css('font-weight').which.equals('700');
  },

  'Clicking on a primitive does not show a detail page': (browser) => {
    clickLinkByUrl(browser, '/DocsApp');
    browser.click('link text', 'rawText');
    browser.expect.url().to.endWith('/DocsApp#rawText');
  },
});
