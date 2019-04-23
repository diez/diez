const Environment = {
  serverUrl: 'http://foo.bar:9001/',
  isDevelopment: true,
};

module.exports = {};

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
    this.file = new File({src: "assets/image%20with%20spaces.jpg"});
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
    this.src = "assets/image.svg";
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
    this.file = new File({src: "assets/lottie.json"});
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
    this.files = [new File({src: "assets/SomeFont.ttf"})];
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.files.update(payload.files);
  }
}


module.exports.FontRegistry = FontRegistry;

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
    this.component = "haiku-component";
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.component = payload.component;
  }
}


module.exports.Haiku = Haiku;

class Bindings {
  constructor() {
    this.image = new Image();
    this.svg = new SVG();
    this.lottie = new Lottie();
    this.fontRegistry = new FontRegistry();
    this.textStyle = new TextStyle({fontName: "Helvetica", fontSize: 50, color: new Color({h: 0.16666666666666666, s: 1, l: 0.5, a: 1})});
    this.haiku = new Haiku();
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.image.update(payload.image);
    this.svg.update(payload.svg);
    this.lottie.update(payload.lottie);
    this.fontRegistry.update(payload.fontRegistry);
    this.textStyle.update(payload.textStyle);
    this.haiku.update(payload.haiku);
  }
}

Bindings.name = 'Bindings';

module.exports.Bindings = Bindings;

