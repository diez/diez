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
}


module.exports.File = File;

Object.defineProperties(File.prototype, {
  url: {
    get () {
      return `${Environment.serverUrl}/${this.src}`;
    },
  },
});

class Size2D {
  constructor({
    width,
    height
  }) {
    this.width = width;
    this.height = height;
  }
}


module.exports.Size2D = Size2D;

Object.defineProperties(Size2D.prototype, {
  style: {
    get () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };
    },
  },
  backgroundSizeStyle: {
    get () {
      return {
        backgroundSize: `${this.style.width} ${this.style.height}`,
      };
    },
  },
});

class Image {
  constructor({
    file,
    file2x,
    file3x,
    size
  }) {
    this.file = new File(file);
    this.file2x = new File(file2x);
    this.file3x = new File(file3x);
    this.size = new Size2D(size);
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
  backgroundImageStyle: {
    get () {
      return {
        backgroundImage: `url("${this.url}")`,
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
    this.file = new File(file);
    this.loop = loop;
    this.autoplay = autoplay;
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
  constructor({
    file,
    name,
    fallbacks,
    weight,
    style
  }) {
    this.file = new File(file);
    this.name = name;
    this.fallbacks = fallbacks;
    this.weight = weight;
    this.style = style;
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
}


module.exports.Color = Color;

const {colorToCss} = require('@diez/web-sdk-common');

Object.defineProperties(Color.prototype, {
  color: {
    get () {
      return colorToCss(this);
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
    this.font = new Font(font);
    this.fontSize = fontSize;
    this.color = new Color(color);
  }
}


module.exports.Typograph = Typograph;

const {fontToCss, FontFormats} = require('@diez/web-sdk-common');

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
  font-weight: ${font.weight};
  font-style: ${font.style};
  src: local('${font.name}'), url(${font.file.url}) format('${FontFormats[format] || format}');
}`;
  styleSheet.insertRule(rule);
  cache.add(font.file.src);
};

Object.defineProperties(Typograph.prototype, {
  fontFamily: {
    get () {
      registerFont(this.font);
      return fontToCss(this.font);
    },
  },
  style: {
    get () {
      return {
        fontFamily: this.fontFamily,
        fontWeight: this.font.fontWeight,
        fontStyle: this.font.fontStyle,
        fontSize: `${this.fontSize}px`,
        color: this.color.color,
      };
    },
  },
});

Typograph.prototype.applyStyle = function (ref) {
  const style = this.style;
  ref.style.fontFamily = style.fontFamily;
  ref.style.fontWeight = style.fontWeight;
  ref.style.fontStyle = style.fontStyle;
  ref.style.fontSize = style.fontSize;
  ref.style.color = style.color;
};

diezHTMLExtensions.push(() => {
  HTMLElement.prototype.applyTypograph = (typograph) => {
    typograph.applyStyle(this);
  };
});

class GradientStop {
  constructor({
    position,
    color
  }) {
    this.position = position;
    this.color = new Color(color);
  }
}


module.exports.GradientStop = GradientStop;

class Point2D {
  constructor({
    x,
    y
  }) {
    this.x = x;
    this.y = y;
  }
}


module.exports.Point2D = Point2D;

class LinearGradient {
  constructor({
    stops,
    start,
    end
  }) {
    this.stops = stops.map((value1) => new GradientStop(value1));
    this.start = new Point2D(start);
    this.end = new Point2D(end);
  }
}


module.exports.LinearGradient = LinearGradient;

const {linearGradientToCss} = require('@diez/web-sdk-common');

Object.defineProperties(LinearGradient.prototype, {
  linearGradient: {
    get () {
      return linearGradientToCss(this);
    },
  },
  backgroundImageStyle: {
    get () {
      return {
        backgroundImage: this.linearGradient,
      };
    },
  },
  backgroundStyle: {
    get () {
      return {
        background: this.linearGradient,
      };
    },
  },
});

class DropShadow {
  constructor({
    offset,
    radius,
    color
  }) {
    this.offset = new Point2D(offset);
    this.radius = radius;
    this.color = new Color(color);
  }
}


module.exports.DropShadow = DropShadow;

const {dropShadowToCss, dropShadowToFilterCss} = require('@diez/web-sdk-common');

Object.defineProperties(DropShadow.prototype, {
  boxShadow: {
    get () {
      return dropShadowToCss(this);
    },
  },
  textShadow: {
    get () {
      return dropShadowToCss(this);
    },
  },
  filter: {
    get () {
      return dropShadowToFilterCss(this);
    },
  },
  boxShadowStyle: {
    get () {
      return {
        boxShadow: this.boxShadow,
      };
    },
  },
  textShadowStyle: {
    get () {
      return {
        textShadow: this.textShadow,
      };
    },
  },
  filterStyle: {
    get () {
      return {
        filter: this.filter,
      };
    },
  },
});

class Bindings {
  constructor({
    image = {file: {src: "assets/image%20with%20spaces.jpg", type: "image"}, file2x: {src: "assets/image%20with%20spaces@2x.jpg", type: "image"}, file3x: {src: "assets/image%20with%20spaces@3x.jpg", type: "image"}, size: {width: 246, height: 246}},
    lottie = {file: {src: "assets/lottie.json", type: "raw"}, loop: true, autoplay: true},
    typograph = {font: {file: {src: "assets/SomeFont.ttf", type: "font"}, name: "SomeFont", fallbacks: ["Verdana", "serif"], weight: 700, style: "normal"}, fontSize: 50, color: {h: 0.16666666666666666, s: 1, l: 0.5, a: 1}},
    linearGradient = {stops: [{position: 0, color: {h: 0, s: 1, l: 0.5, a: 1}}, {position: 1, color: {h: 0.6666666666666666, s: 1, l: 0.5, a: 1}}], start: {x: 0, y: 0.5}, end: {x: 1, y: 0.5}},
    point = {x: 0.5, y: 0.5},
    size = {width: 400, height: 300},
    shadow = {offset: {x: 1, y: 2}, radius: 3, color: {h: 0.3333333333333333, s: 1, l: 0.5, a: 0.5}}
  } = {}) {
    this.image = new Image(image);
    this.lottie = new Lottie(lottie);
    this.typograph = new Typograph(typograph);
    this.linearGradient = new LinearGradient(linearGradient);
    this.point = new Point2D(point);
    this.size = new Size2D(size);
    this.shadow = new DropShadow(shadow);
  }
}

Bindings.name = 'Bindings';

module.exports.Bindings = Bindings;

