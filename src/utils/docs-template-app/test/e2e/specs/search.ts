import {selectOption, selectors, testWithDefaults} from '../utils';

module.exports = testWithDefaults({
  'Finds an element via text search': (browser) => {
    browser.setValue(selectors.search.input, 'panel');
    browser.expect.url().to.contain('name=panel');
    browser.expect.elements(selectors.items.any).count.to.equal(1);
    browser.expect.element(selectors.items.any).text.to.contain('panel');
  },

  'Shows all search results when the input is cleared': (browser) => {
    for (let i = 'panel'.length; i > 0; i--) {
      browser.setValue(selectors.search.input, browser.Keys.BACK_SPACE);
    }

    browser.expect.elements(selectors.items.any).count.to.not.equal(1);
  },

  'Automatically searches when a query string for name is provided': (browser) => {
    browser.url(`${process.env.VUE_DEV_SERVER_URL}/#/?name=image`);
    browser.expect.elements(selectors.items.any).count.to.equal(1);
    browser.expect.element(selectors.items.any).text.to.contain('image');
  },

  'Opens a search result': (browser) => {
    browser.click(selectors.items.any);
    browser.expect.url().to.contain('/image');
    browser.expect.url().to.not.contain('name=');
    browser.expect.url().to.not.contain('type=');
    browser.expect.element('h1').text.to.equal('image');
  },

  'Filters elements by type': (browser) => {
    selectOption(browser, 'main', 'Color');
    browser.expect.url().to.contain('type=Color');

    selectOption(browser, 'main', 'Image');
    browser.expect.url().to.contain('type=Image');
  },

  'Notifies the user if there are no results': (browser) => {
    browser.setValue(selectors.search.input, 'lorem-ipsum-dolor-sit');
    browser.expect.elements(selectors.items.any).count.to.equal(0);
    browser.expect.element('main').text.to.contain('No components containing "lorem-ipsum-dolor-sit" of type Image.');

    selectOption(browser, 'main', '');
    browser.expect.element('main').text.to.contain('No components containing "lorem-ipsum-dolor-sit"');
  },

  'Searching by exact query returns valid results': (browser) => {
    browser.clearValue(selectors.search.input);
    browser.setValue(selectors.search.input, 'linearGradient');
    browser.expect.elements(selectors.items.any).count.to.equal(1);
    browser.expect.element(selectors.items.any).text.to.contain('linearGradient');
  },

  'If you set a filter, the selection should clear back to “All” when clicking on an item': (browser) => {
    selectOption(browser, 'main', 'Image');
    browser.clearValue(selectors.search.input);
    browser.setValue(selectors.search.input, ' ');
    browser.click(selectors.items.any);
    browser.expect.element('main select').value.to.equal('');
  },

  'Returns results grouped by type': (browser) => {
    browser.clearValue(selectors.search.input);
    browser.setValue(selectors.search.input, ' ');
    browser.expect.element(selectors.search.results).text.to.contain('Panels');
    browser.expect.element(selectors.search.results).text.to.contain('Groups');
    browser.expect.element(selectors.search.results).text.to.contain('Primitives');
    browser.expect.element(selectors.search.results).text.to.contain('Colors');
    browser.expect.element(selectors.search.results).text.to.contain('Linear Gradients');
    browser.expect.element(selectors.search.results).text.to.contain('Lottie Files');
  },
});
