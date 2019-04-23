const Environment = {
  serverUrl: 'http://192.168.1.32:8081/',
  isDevelopment: true,
};

module.exports = {};

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

class Color {
  constructor({
    h,
    s,
    l,
    a
  }) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.h = payload.h;
    this.s = payload.s;
    this.l = payload.l;
    this.a = payload.a;
  }
}


module.exports.Color = Color;

Color.prototype.toString = function () {
  return `hsla(${this.h}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
};

class MyPalette {
  constructor() {
    this.hello = new Color({h: 0, s: 1, l: 0.5, a: 1});
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.hello.update(payload.hello);
  }
}


module.exports.MyPalette = MyPalette;

class File {
  constructor({
    src
  }) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.src = payload.src;
  }
}


module.exports.File = File;

Object.defineProperty(File.prototype, 'url', {
  get () {
    if (Environment.isDevelopment) {
      return `${Environment.serverUrl}${this.src}`;
    }

    // TODO: figure out how this should actually work.
    return this.src;
  },
});

class Image {
  constructor() {
    this.file = new File({src: "assets/images/haiku.jpg"});
    this.width = 246;
    this.height = 246;
    this.scale = 3;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.file.update(payload.file);
    this.width = payload.width;
    this.height = payload.height;
    this.scale = payload.scale;
  }
}


module.exports.Image = Image;

class SVG {
  constructor() {
    this.src = "assets/images/rat.svg";
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.src = payload.src;
  }
}


module.exports.SVG = SVG;

class Lottie {
  constructor() {
    this.file = new File({src: "assets/lottie/loading-pizza.json"});
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.file.update(payload.file);
  }
}


module.exports.Lottie = Lottie;

class FontRegistry {
  constructor() {
    this.files = [new File({src: "assets/fonts/Roboto-Black.ttf"}), new File({src: "assets/fonts/Roboto-BlackItalic.ttf"}), new File({src: "assets/fonts/Roboto-Bold.ttf"}), new File({src: "assets/fonts/Roboto-BoldItalic.ttf"}), new File({src: "assets/fonts/Roboto-Italic.ttf"}), new File({src: "assets/fonts/Roboto-Light.ttf"}), new File({src: "assets/fonts/Roboto-LightItalic.ttf"}), new File({src: "assets/fonts/Roboto-Medium.ttf"}), new File({src: "assets/fonts/Roboto-MediumItalic.ttf"}), new File({src: "assets/fonts/Roboto-Regular.ttf"}), new File({src: "assets/fonts/Roboto-Thin.ttf"}), new File({src: "assets/fonts/Roboto-ThinItalic.ttf"})];
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.files.update(payload.files);
  }
}


module.exports.FontRegistry = FontRegistry;

class TextStyle {
  constructor({
    fontName,
    fontSize,
    color
  }) {
    this.fontName = fontName;
    this.fontSize = fontSize;
    this.color = color;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.fontName = payload.fontName;
    this.fontSize = payload.fontSize;
    this.color.update(payload.color);
  }
}


module.exports.TextStyle = TextStyle;

Object.defineProperty(TextStyle.prototype, 'css', {
  get () {
    return {
      fontFamily: this.fontName,
      fontSize: `${this.fontSize}px`,
      color: this.color.toString(),
    };
  },
});

TextStyle.prototype.applyStyle = function (ref) {
  const css = this.css;
  ref.style.fontFamily = css.fontFamily;
  ref.style.fontSize = css.fontSize;
  ref.style.color = css.color;
};

class Haiku {
  constructor() {
    this.component = "@haiku/taylor-testthang";
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.component = payload.component;
  }
}


module.exports.Haiku = Haiku;

class MyStateBag {
  constructor() {
    this.palette = new MyPalette();
    this.helloRValue = 255;
    this.copy = "Hello Diez";
    this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.image = new Image();
    this.svg = new SVG();
    this.lottie = new Lottie();
    this.fontRegistry = new FontRegistry();
    this.textStyle = new TextStyle({fontName: "Helvetica", fontSize: 50, color: new Color({h: 0, s: 1, l: 0.5, a: 1})});
    this.haiku = new Haiku();
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.palette.update(payload.palette);
    this.helloRValue = payload.helloRValue;
    this.copy = payload.copy;
    this.numbers = payload.numbers;
    this.image.update(payload.image);
    this.svg.update(payload.svg);
    this.lottie.update(payload.lottie);
    this.fontRegistry.update(payload.fontRegistry);
    this.textStyle.update(payload.textStyle);
    this.haiku.update(payload.haiku);
  }
}

MyStateBag.name = 'MyStateBag';

module.exports.MyStateBag = MyStateBag;

