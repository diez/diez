if (typeof process === 'undefined' || !process) {
  process = {env: {}};
} else if (!process.env) {
  process.env = {};
}

const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL || '/diez',
  isHot: process.env.DIEZ_IS_HOT,
};

module.exports = {};

{{#each sources}}
{{{this}}}
{{/each}}
