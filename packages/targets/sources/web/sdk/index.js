const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL,
  isHot: process.env.DIEZ_IS_HOT,
};

module.exports = {};

{{#each sources}}
{{{this}}}
{{/each}}
