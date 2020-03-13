import {selectOption, selectors, testWithDefaults} from '../utils';

module.exports = testWithDefaults({
  'Contains boilerplate text if no property is selected': (browser) => {
    browser.expect.element(selectors.examples).text.to.contain('documentation');
  },

  'Shows usage examples for elements with bindings': (browser) => {
    browser.click('.image-wrapper');
    browser.expect.element(selectors.examples).text.to.contain('iOS');
    browser.expect.element(selectors.examples).text.to.contain('Android');
    browser.expect.element(selectors.examples).text.to.contain('Web');
    browser.expect.element(`${selectors.examples} code`).to.be.present;
  },

  'Shows different examples for different platforms': async (browser) => {
    const defaultHeading = await browser.getText(`${selectors.examples} h3`);
    selectOption(browser, selectors.examples, 'Web');
    browser.expect.element(`${selectors.examples} h3`).text.to.not.equal(defaultHeading.value);
  },

  'Remembers the language selected between sessions': (browser) => {
    selectOption(browser, selectors.examples, 'Web');
    browser.refresh();
    browser.expect.element(`${selectors.examples} select`).value.to.equal('Web');
    selectOption(browser, selectors.examples, 'iOS');
    browser.refresh();
    browser.expect.element(`${selectors.examples} select`).value.to.equal('iOS');
  },
});
