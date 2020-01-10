module.exports = {};

if (typeof process === 'undefined' || !process) {
  process = {env: {}};
} else if (!process.env) {
  Object.defineProperty(process, 'env', {
    value: {},
  });
}

const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL || '/diez',
  isHot: process.env.DIEZ_IS_HOT,
};

const diezHTMLExtensions = [];

class Diez {
  constructor (componentType) {
    if (typeof document !== 'undefined') {
      this.iframe = document.createElement('iframe');
    } else {
      this.iframe = {};
    }

    this.componentType = componentType;
    this.component = new this.componentType();
    this.subscribers = [];
  }

  static applyHTMLExtensions () {
    diezHTMLExtensions.forEach((extension) => {
      if (extension instanceof Function) {
        extension();
      }
    });
  }

  broadcast () {
    for (const subscriber of this.subscribers) {
      subscriber(this.component);
    }
  }

  subscribe (subscriber) {
    this.subscribers.push(subscriber);
  }

  attach (subscriber) {
    subscriber(this.component);
    if (!Environment.isHot) {
      return;
    }
    this.subscribe(subscriber);
    if (this.iframe.contentWindow) {
      return;
    }
    this.iframe.src = `${Environment.serverUrl}/components/${this.component.constructor.name}`;
    this.iframe.width = '0';
    this.iframe.height = '0';
    this.iframe.style.display = 'none';

    if (typeof document !== 'undefined') {
      document.body.appendChild(this.iframe);
      window.addEventListener('message', (event) => {
        if (event.source === this.iframe.contentWindow && event.origin.startsWith(Environment.serverUrl)) {
          this.component = new this.componentType(JSON.parse(event.data));
          this.broadcast();
        }
      });
    }
  }
}

module.exports.Diez = Diez;
