if (typeof process === 'undefined' || !process) {
  process = {env: {}};
} else if (!process.env) {
  process.env = {};
}

const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL || '/diez',
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
  urlCss: {
    get () {
      return `url("${this.url}")`;
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
  urlCss: {
    get () {
      return `url("${this.url}")`;
    },
  },
  backgroundImageStyle: {
    get () {
      return {
        backgroundImage: this.urlCss,
      };
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

class Font {
  constructor () {
    this.file = new File({src: "assets/SomeFont.ttf", type: "font"});
    this.name = "SomeFont";
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.file = Object.assign(Object.create(Object.getPrototypeOf(this.file)), this.file.update(payload.file));
    this.name = payload.name;

    return this;
  }
}


module.exports.Font = Font;

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

Object.defineProperties(Color.prototype, {
  color: {
    get () {
      return `hsla(${this.h * 360}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
    },
  },
  colorStyle: {
    get () {
      return {
        color: this.color,
      };
    },
  },
  backgroundColorStyle: {
    get () {
      return {
        backgroundColor: this.color,
      };
    },
  },
  borderColorStyle: {
    get () {
      return {
        borderColor: this.color,
      };
    },
  },
  outlineColorStyle: {
    get () {
      return {
        outlineColor: this.color,
      };
    },
  },
});

class Typograph {
  constructor({
    font,
    fontSize,
    color
  }) {
    this.font = font;
    this.fontSize = fontSize;
    this.color = color;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.font = Object.assign(Object.create(Object.getPrototypeOf(this.font)), this.font.update(payload.font));
    this.fontSize = payload.fontSize;
    this.color = Object.assign(Object.create(Object.getPrototypeOf(this.color)), this.color.update(payload.color));

    return this;
  }
}


module.exports.Typograph = Typograph;

const FontFormats = {
  eot: 'embedded-opentype',
  woff: 'woff',
  woff2: 'woff2',
  otf: 'opentype',
  ttf: 'truetype',
  svg: 'svg',
};

let styleSheet;
let cache;

const registerFont = (font) => {
  if (!styleSheet || !cache) {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleSheet = styleEl.sheet;
    cache = new Set();
  }

  if (cache.has(font.file.src)) {
    return;
  }

  const format = font.file.src.split('.').pop();
  const rule = `
@font-face {
  font-family: '${font.name}';
  src: local('${font.name}'), url(${font.file.url}) format('${FontFormats[format] || format}');
}`;
  styleSheet.insertRule(rule);
  cache.add(font.file.src);
};

Object.defineProperties(Typograph.prototype, {
  fontFamily: {
    get () {
      registerFont(this.font);
      return this.font.name;
    },
  },
  style: {
    get () {
      return {
        fontFamily: this.fontFamily,
        fontSize: `${this.fontSize}px`,
        color: this.color.color,
      };
    },
  },
});

Typograph.prototype.applyStyle = function (ref) {
  const style = this.style;
  ref.style.fontFamily = style.fontFamily;
  ref.style.fontSize = style.fontSize;
  ref.style.color = style.color;
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
    this.typograph = new Typograph({font: new Font({file: new File({src: "assets/SomeFont.ttf", type: "font"}), name: "SomeFont"}), fontSize: 50, color: new Color({h: 0.16666666666666666, s: 1, l: 0.5, a: 1})});
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.image = Object.assign(Object.create(Object.getPrototypeOf(this.image)), this.image.update(payload.image));
    this.lottie = Object.assign(Object.create(Object.getPrototypeOf(this.lottie)), this.lottie.update(payload.lottie));
    this.typograph = Object.assign(Object.create(Object.getPrototypeOf(this.typograph)), this.typograph.update(payload.typograph));

    return this;
  }
}

Bindings.name = 'Bindings';

module.exports.Bindings = Bindings;

