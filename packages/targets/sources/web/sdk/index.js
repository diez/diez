const Environment = {
  {{#if devMode}}
  serverUrl: 'http://{{{hostname}}}:{{{devPort}}}/',
  {{/if}}
  isDevelopment: {{{devMode}}},
};

module.exports = {};

{{#each sources}}
{{{this}}}
{{/each}}
