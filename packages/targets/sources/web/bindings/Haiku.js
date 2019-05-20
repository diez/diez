{{!-- This binding is actually a template for a compile time generated component. --}}
class {{{componentName}}} {
  constructor () {
    try {
      this.adapter = require('{{{haikuComponent}}}');
    } catch (_) {
      console.error('Unable to load component: {{{haikuComponent}}}.');
    }
  }

  mount(ref) {
    if (this.adapter) {
      return this.adapter(ref, {
        loop: {{loop}},
        autoplay: {{autoplay}}
      });
    }
  }

  update (payload) {
    // Noop.
  }
}

module.exports.{{{componentName}}} = {{{componentName}}};
