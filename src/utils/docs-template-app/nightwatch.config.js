const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');

module.exports = {
  src_folders: ['test/e2e/lib/specs'],
  output_folder: false,
  test_workers: false,
  test_settings: {
    default: {
      detailed_output: true,
      launch_url: '${VUE_DEV_SERVER_URL}',
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          w3c: false,
          args: ['headless'],
        },
      },
      webdriver: {
        start_process: true,
        port: 9515,
        server_path: chromedriver.path,
      },
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: ['--headless'],
          },
        },
      },
      webdriver: {
        start_process: true,
        port: 4444,
        server_path: geckodriver.path,
      },
    },
  },
};
