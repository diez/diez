const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL,
  isHot: process.env.DIEZ_IS_HOT,
};

module.exports = {};

class File {
  constructor({
    src,
    type
  }) {
    this.src = src;
    this.type = type;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.src = payload.src;
    this.type = payload.type;

    return this;
  }
}


module.exports.File = File;

Object.defineProperties(File.prototype, {
  url: {
    get () {
      return `${Environment.serverUrl}/${this.src}`;
    },
  },
});

class Image {
  constructor({
    file,
    file2x,
    file3x,
    width,
    height
  }) {
    this.file = file;
    this.file2x = file2x;
    this.file3x = file3x;
    this.width = width;
    this.height = height;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.file = Object.assign(Object.create(Object.getPrototypeOf(this.file)), this.file.update(payload.file));
    this.file2x = Object.assign(Object.create(Object.getPrototypeOf(this.file2x)), this.file2x.update(payload.file2x));
    this.file3x = Object.assign(Object.create(Object.getPrototypeOf(this.file3x)), this.file3x.update(payload.file3x));
    this.width = payload.width;
    this.height = payload.height;

    return this;
  }
}


module.exports.Image = Image;

Object.defineProperties(Image.prototype, {
  url: {
    get () {
      switch (Math.ceil(window.devicePixelRatio)) {
        case 1:
          return this.file.url;
        case 2:
          return this.file2x.url;
        case 3:
          return this.file3x.url;
        default:
          return this.file2x.url;
      }
    },
  },
});

class Lottie {
  constructor({
    file,
    loop,
    autoplay
  }) {
    this.file = file;
    this.loop = loop;
    this.autoplay = autoplay;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.file = Object.assign(Object.create(Object.getPrototypeOf(this.file)), this.file.update(payload.file));
    this.loop = payload.loop;
    this.autoplay = payload.autoplay;

    return this;
  }
}


module.exports.Lottie = Lottie;

const lottie = require('lottie-web');

Object.defineProperties(Lottie.prototype, {
  url: {
    get () {
      return this.file.url;
    },
  },
});

Lottie.prototype.mount = function (ref) {
  lottie.loadAnimation({
    container: ref,
    path: this.url,
    autoplay: this.autoplay,
    loop: this.loop,
  });
};

diezHTMLExtensions.push(() => {
  HTMLElement.prototype.mountLottie = function (lottieComponent) {
    lottieComponent.mount(this);
  };
});

class FontRegistry {
  constructor({
    files
  }) {
    this.files = files;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.files = payload.files;

    return this;
  }
}


module.exports.FontRegistry = FontRegistry;

const FontFormats = {
  eot: 'embedded-opentype',
  woff: 'woff',
  woff2: 'woff2',
  ttf: 'truetype',
  svg: 'svg',
};

FontRegistry.prototype.registerFonts = function () {
  if (!this.styleSheet || !this.cache) {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    this.styleSheet = styleEl.sheet; // @internal
    this.cache = new Set(); // @internal
  }

  for (const file of this.files) {
    if (this.cache.has(file.src)) {
      continue;
    }

    const parsedFile = file.src.split('/').pop();
    if (parsedFile) {
      const [name, format] = parsedFile.split('.');
      const rule = `
        @font-face {
          font-family: '${name}';
          src: local('${name}'), url(${file.url}) format('${FontFormats[format] || format}');
        }`;

      this.styleSheet.insertRule(rule);
    }
    this.cache.add(file.src);
  }
};

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
      return this;
    }

    this.h = payload.h;
    this.s = payload.s;
    this.l = payload.l;
    this.a = payload.a;

    return this;
  }
}


module.exports.Color = Color;

Color.prototype.toString = function () {
  return `hsla(${this.h * 360}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
};

class Typograph {
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
      return this;
    }

    this.fontName = payload.fontName;
    this.fontSize = payload.fontSize;
    this.color = Object.assign(Object.create(Object.getPrototypeOf(this.color)), this.color.update(payload.color));

    return this;
  }
}


module.exports.Typograph = Typograph;

Object.defineProperties(Typograph.prototype, {
  css: {
    get () {
      return {
        fontFamily: this.fontName,
        fontSize: `${this.fontSize}px`,
        color: this.color.toString(),
      };
    },
  },
});

Typograph.prototype.applyStyle = function (ref) {
  const css = this.css;
  ref.style.fontFamily = css.fontFamily;
  ref.style.fontSize = css.fontSize;
  ref.style.color = css.color;
};

diezHTMLExtensions.push(() => {
  HTMLElement.prototype.applyTypograph = (typograph) => {
    typograph.applyStyle(this);
  };
});

class Bindings {
  constructor () {
    this.image = new Image({file: new File({src: "assets/image%20with%20spaces.jpg", type: "image"}), file2x: new File({src: "assets/image%20with%20spaces@2x.jpg", type: "image"}), file3x: new File({src: "assets/image%20with%20spaces@3x.jpg", type: "image"}), width: 246, height: 246});
    this.lottie = new Lottie({file: new File({src: "assets/lottie.json", type: "raw"}), loop: true, autoplay: true});
    this.fontRegistry = new FontRegistry({files: [new File({src: "assets/SomeFont.ttf", type: "font"})]});
    this.typograph = new Typograph({fontName: "Helvetica", fontSize: 50, color: new Color({h: 0.16666666666666666, s: 1, l: 0.5, a: 1})});
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.image = Object.assign(Object.create(Object.getPrototypeOf(this.image)), this.image.update(payload.image));
    this.lottie = Object.assign(Object.create(Object.getPrototypeOf(this.lottie)), this.lottie.update(payload.lottie));
    this.fontRegistry = Object.assign(Object.create(Object.getPrototypeOf(this.fontRegistry)), this.fontRegistry.update(payload.fontRegistry));
    this.typograph = Object.assign(Object.create(Object.getPrototypeOf(this.typograph)), this.typograph.update(payload.typograph));

    return this;
  }
}

Bindings.name = 'Bindings';

module.exports.Bindings = Bindings;

