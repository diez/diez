import {NightwatchBrowser} from 'nightwatch';

interface NightWatchSpec {
  [key: string]: (browser: NightwatchBrowser) => void;
}

const BaseTest: NightWatchSpec = {
  before (browser) {
    browser.url(`${process.env.VUE_DEV_SERVER_URL}`);
  },

  after (browser) {
    browser.end();
  },
};

/**
 * Define a new test with base defaults.
 */
export const testWithDefaults = (base: NightWatchSpec) => {
  return Object.assign({}, BaseTest, base);
};

/**
 * Select an option from a <select> element
 *
 * TODO: make this a custom assertion: https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-assertions
 */
export const selectOption = (browser: NightwatchBrowser, scope: string, value: string) => {
  browser.click(`${scope} select`);
  browser.click(`${scope} select option[value="${value}"]`);
};

/**
 * Regex for a valid visually formatted HSLA color.
 */
export const hslaColorRegex = /hsla\(\d\.?\d{0,2}, \d\.?\d{0,2}, \d\.?\d{0,2}, \d\.?\d{0,2}\)/;

/**
 * Click a link with a URL that ends with the provided string.
 */
export const clickLinkByUrl = (browser: NightwatchBrowser, url: string) => {
  browser.click('css selector', `a[href$="${url}"]`);
};
