import {clickLinkByUrl, hslaColorRegex, selectors, testWithDefaults} from '../utils';

module.exports = testWithDefaults({
  'Shows comments at property-level': (browser) => {
    clickLinkByUrl(browser, '/DocsApp/myDesign');
    clickLinkByUrl(browser, '/DocsApp/myDesign/size');
    browser.expect.element('figcaption').text.to.equal('This is a property-level comment in MyDesign.size.');
  },

  'Shows details for a component with binding': (browser) => {
    clickLinkByUrl(browser, '/lottie');
    browser.expect.element(selectors.main).text.to.contain('Details');
    browser.expect.element(selectors.detailsTable).to.be.present;
    browser.expect.elements('main td').count.to.not.equal(1);

    clickLinkByUrl(browser, '/palette');
    browser.expect.element(selectors.detailsTable).to.not.be.present;
  },

  'Shows the type of the component for a component with binding': (browser) => {
    clickLinkByUrl(browser, '/image');
    browser.expect.element('#component-type').text.to.contain('Component Type');
    browser.expect.element('#component-type').text.to.contain('Image');

    clickLinkByUrl(browser, '/fill');
    browser.expect.element('#component-type').text.to.contain('Fill');

    clickLinkByUrl(browser, '/palette');
    browser.expect.element('#component-type').to.not.be.present;
  },

  'Shows rounded values for hsla colors': (browser) => {
    clickLinkByUrl(browser, '/shadow');
    browser.expect.element(selectors.detailsTable).text.to.match(hslaColorRegex);
  },

  'Shows a link to the prefab documentation page': async (browser) => {
    clickLinkByUrl(browser, '/shadow');
    browser.expect.element('#component-type').text.to.contain('Prefab Docs');
    browser.expect.element('#component-type a').to.have.attribute('href').which.contains('diez.org');
    browser.expect.element('#component-type a').to.have.attribute('target').which.contains('_blank');
  },
});
