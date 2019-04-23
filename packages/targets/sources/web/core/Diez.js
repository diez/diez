class Diez {
  constructor (componentType) {
    this._iframe = document.createElement('iframe');
    this._component = new componentType();
    this.tick = this.tick.bind(this);
  }

  tick () {
    if (this._iframe.contentWindow) {
      this._iframe.contentWindow.postMessage(Date.now(), '*');
    }

    requestAnimationFrame(this.tick);
  }

  subscribe (subscriber) {
    if (this._iframe.contentWindow) {
      return;
    }

    subscriber(this._component);
    this._iframe.src = `${Environment.serverUrl}components/${this._component.constructor.name}`;
    this._iframe.width = '0';
    this._iframe.height = '0';
    this._iframe.style.display = 'none';
    document.body.appendChild(this._iframe);
    window.addEventListener('message', (event) => {
      if (event.origin === Environment.serverUrl) {
        this._component.update(JSON.parse(event.data));
        subscriber(this._component);
      }
    });
    requestAnimationFrame(this.tick);
  }
}

module.exports.Diez = Diez;
