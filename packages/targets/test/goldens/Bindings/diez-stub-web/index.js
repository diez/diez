const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL,
  isHot: process.env.DIEZ_IS_HOT,
};

module.exports = {};

class File {
  constructor ({src}) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.src = payload.src;

    return this;
  }
}

Object.defineProperties(File.prototype, {
  url: {
    get () {
      return `${Environment.serverUrl}/${this.src}`;
    },
  },
});

module.exports.File = File;

class Image {
  constructor({
    file1x,
    file2x,
    file3x,
    width,
    height
  }) {
    this.file1x = file1x;
    this.file2x = file2x;
    this.file3x = file3x;
    this.width = width;
    this.height = height;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.file1x = Object.assign(Object.create(Object.getPrototypeOf(this.file1x)), this.file1x.update(payload.file1x));
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
          return this.file1x.url;
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

class SVG {
  constructor({
    src
  }) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.src = payload.src;

    return this;
  }
}


module.exports.SVG = SVG;

Object.defineProperties(SVG.prototype, {
  file: {
    get () {
      return new File({src: this.src});
    },
  },
  url: {
    get () {
      return this.file.url;
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

const FontFormats = {
  eot: 'embedded-opentype',
  woff: 'woff',
  woff2: 'woff2',
  ttf: 'truetype',
  svg: 'svg',
};

class FontRegistry {

  constructor ({files} = {files: []}) {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    this.styleSheet = styleEl.sheet;
    this.files = files;
    this.cache = new Set(); // @internal
    this.registerFonts(); // @internal
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    if (payload.files !== undefined) {
      this.files = payload.files;
    }

    this.registerFonts();

    return this;
  }

  // @internal
  registerFonts () {
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
  }
}

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

class HaikuComponent {
  constructor () {
    try {
      this.adapter = require('haiku-component');
    } catch (_) {
      console.error('Unable to load component: haiku-component.');
    }
  }

  mount(ref) {
    if (this.adapter) {
      return this.adapter(ref, {
        loop: true,
        autoplay: true
      });
    }
  }

  update (payload) {
    // Noop.
  }
}

module.exports.HaikuComponent = HaikuComponent;

class Bindings {
  constructor () {
    this.image = new Image({file1x: new File({src: "assets/image%20with%20spaces.jpg"}), file2x: new File({src: "assets/image%20with%20spaces@2x.jpg"}), file3x: new File({src: "assets/image%20with%20spaces@3x.jpg"}), width: 246, height: 246});
    this.svg = new SVG({src: "assets/image.svg"});
    this.lottie = new Lottie({file: new File({src: "assets/lottie.json"}), loop: true, autoplay: true});
    this.fontRegistry = new FontRegistry({files: [new File({src: "assets/SomeFont.ttf"})]});
    this.typograph = new Typograph({fontName: "Helvetica", fontSize: 50, color: new Color({h: 0.16666666666666666, s: 1, l: 0.5, a: 1})});
    this.haiku = new HaikuComponent({});
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.image = Object.assign(Object.create(Object.getPrototypeOf(this.image)), this.image.update(payload.image));
    this.svg = Object.assign(Object.create(Object.getPrototypeOf(this.svg)), this.svg.update(payload.svg));
    this.lottie = Object.assign(Object.create(Object.getPrototypeOf(this.lottie)), this.lottie.update(payload.lottie));
    this.fontRegistry = Object.assign(Object.create(Object.getPrototypeOf(this.fontRegistry)), this.fontRegistry.update(payload.fontRegistry));
    this.typograph = Object.assign(Object.create(Object.getPrototypeOf(this.typograph)), this.typograph.update(payload.typograph));
    this.haiku = Object.assign(Object.create(Object.getPrototypeOf(this.haiku)), this.haiku.update(payload.haiku));

    return this;
  }
}

Bindings.name = 'Bindings';

module.exports.Bindings = Bindings;

