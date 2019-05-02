const Environment = {
  {{#if devMode}}
  serverUrl: 'http://{{{hostname}}}:{{{devPort}}}/',
  {{else}}
  serverUrl: '{{baseUrl}}',
  {{/if}}
  isDevelopment: {{{devMode}}},
};

module.exports = {};

{{#each sources}}
{{{this}}}
{{/each}}
