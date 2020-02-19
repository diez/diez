// This file was generated with Diez - https://diez.org
// Do not edit this file directly.

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

/**
 * Provides a container for referencing local assets, which can be bridged by compilers to embed images, SVGs,
 * and more. This component is used internally by [[Image]] and [[Font]].
 * 
 * The compiler may enforce certain restrictions on the `type` of a `File` instance.
 * 
 * Usage: `file = new File({src: 'assets/images/file.jpg', type: FileType.Image});`.
 *
 */
class File {
  constructor({
    src,
    type
  }) {
    /**
     * File data.
     *
     * assets/image%20with%20spaces.jpg
     */
    this.src = src;
    /**
     * File data.
     *
     * image
     */
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

/**
 * Provides a two dimensional size.
 * 
 * Usage: `size = Size2D.make(1920, 1080);`.
 *
 */
class Size2D {
  constructor({
    width,
    height
  }) {
    /**
     * Size data.
     *
     * 246
     */
    this.width = width;
    /**
     * Size data.
     *
     * 246
     */
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

/**
 * Provides an abstraction for raster images. With bindings, this component can embed images in multiple platforms in
 * accordance with best practices. Images should provide pixel ratios for standard, @2x, @3x, and @4x with conventional
 * file naming. The availability of retina resolutions is expected to be a compile-time concern, and the "src" of the
 * image is expected to exist and provide an image with the specified dimensions.
 *
 */
class Image {
  constructor({
    file,
    file2x,
    file3x,
    size
  }) {
    /**
     * Responsive image data.
     *
     * assets/image with spaces.jpg
     */
    this.file = new File(file);
    /**
     * Responsive image data.
     *
     * assets/image with spaces@2x.jpg
     */
    this.file2x = new File(file2x);
    /**
     * Responsive image data.
     *
     * assets/image with spaces@3x.jpg
     */
    this.file3x = new File(file3x);
    /**
     * Responsive image data.
     *
     * (246 x 246)
     */
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

/**
 * Provides an abstraction for [Lottie](https://airbnb.io/lottie/#/) animations.
 *
 */
class Lottie {
  constructor({
    file,
    loop,
    autoplay
  }) {
    /**
     * Lottie data.
     *
     * assets/lottie.json
     */
    this.file = new File(file);
    /**
     * Lottie data.
     *
     * true
     */
    this.loop = loop;
    /**
     * Lottie data.
     *
     * true
     */
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

/**
 * A representation of a font resource, with a reference to a [[File]] containing a TTF or OTF font file.
 *
 */
class Font {
  constructor({
    file,
    name,
    fallbacks,
    weight,
    style
  }) {
    /**
     * Font data.
     *
     * assets/SomeFont.ttf
     */
    this.file = new File(file);
    /**
     * Font data.
     *
     * SomeFont
     */
    this.name = name;
    /**
     * Font data.
     *
     * Verdana
     */
    this.fallbacks = fallbacks;
    /**
     * Font data.
     *
     * 700
     */
    this.weight = weight;
    /**
     * Font data.
     *
     * normal
     */
    this.style = style;
  }
}


module.exports.Font = Font;

/**
 * A component encapsulating color, including alpha transparency.
 * 
 * You can use the provided static constructors [[Color.rgb]], [[Color.rgba]], [[Color.hsl]], [[Color.hsla]], and
 * [[Color.hex]] to conveniently create color primitives using familiar patterns for color specification.
 *
 */
class Color {
  constructor({
    h,
    s,
    l,
    a
  }) {
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0.16666666666666666
     */
    this.h = h;
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 1
     */
    this.s = s;
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0.5
     */
    this.l = l;
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 1
     */
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

/**
 * Describes a typograph including specification of a font name (understood to specify both a font face and a font
 * weight) as well as a font size in device-local units and a font color.
 *
 */
class Typograph {
  constructor({
    font,
    fontSize,
    color,
    lineHeight,
    letterSpacing,
    alignment,
    decoration
  }) {
    /**
     * Typograph data.
     *
     * SomeFont, 700, normal
     */
    this.font = new Font(font);
    /**
     * Typograph data.
     *
     * 50
     */
    this.fontSize = fontSize;
    /**
     * Typograph data.
     *
     * hsla(0.17, 1, 0.5, 1)
     */
    this.color = new Color(color);
    /**
     * Typograph data.
     *
     * -1
     */
    this.lineHeight = lineHeight;
    /**
     * Typograph data.
     *
     */
    this.letterSpacing = letterSpacing;
    /**
     * Typograph data.
     *
     * natural
     */
    this.alignment = alignment;
    /**
     * Typograph data.
     *
     */
    this.decoration = decoration;
  }
}


module.exports.Typograph = Typograph;

const {fontToCss, FontFormats, textAlignmentToCss, textDecorationsToCss} = require('@diez/web-sdk-common');

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
      const style = {
        fontFamily: this.fontFamily,
        fontWeight: this.font.fontWeight,
        fontStyle: this.font.fontStyle,
        fontSize: `${this.fontSize}px`,
        color: this.color.color,
        letterSpacing: `${this.letterSpacing}px`,
        textAlign: textAlignmentToCss(this.alignment),
        textDecoration: textDecorationsToCss(this.decoration),
      };
      if (this.lineHeight !== -1) {
        style.lineHeight = `${this.lineHeight}px`;
      }
      return style;
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
  ref.style.lineHeight = style.lineHeight;
  ref.style.letterSpacing = style.letterSpacing;
  ref.style.textAlign = style.textAlign;
};

diezHTMLExtensions.push(() => {
  HTMLElement.prototype.applyTypograph = (typograph) => {
    typograph.applyStyle(this);
  };
});

/**
 * Provides a gradient stop.
 *
 */
class GradientStop {
  constructor({
    position,
    color
  }) {
    /**
     * GradientStop data.
     *
     * 1
     */
    this.position = position;
    /**
     * GradientStop data.
     *
     * hsla(0.67, 1, 0.5, 1)
     */
    this.color = new Color(color);
  }
}


module.exports.GradientStop = GradientStop;

/**
 * Provides a two dimensional point.
 * 
 * Taken alone, points are designated in an abstract space with no inherit dimensions or directionality. In the
 * context of other prefabs like [[LinearGradient]], points typically should use the standard two dimensional graphics
 * space, often normalized in the unit square, where x increases from left to right and y increases from top to bottom.
 * 
 * Usage: `point = Point2D.make(0.5, 0.5);`.
 *
 */
class Point2D {
  constructor({
    x,
    y
  }) {
    /**
     * Point data.
     *
     */
    this.x = x;
    /**
     * Point data.
     *
     * 0.5
     */
    this.y = y;
  }
}


module.exports.Point2D = Point2D;

/**
 * Provides a linear gradient.
 *
 */
class LinearGradient {
  constructor({
    stops,
    start,
    end
  }) {
    this.stops = stops.map((value1) => new GradientStop(value1));
    /**
     * LinearGradient data.
     *
     * [0, 0.5]
     */
    this.start = new Point2D(start);
    /**
     * LinearGradient data.
     *
     * [1, 0.5]
     */
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

/**
 * Provides a drop shadow.
 *
 */
class DropShadow {
  constructor({
    offset,
    radius,
    color
  }) {
    /**
     * DropShadow data.
     *
     * [1, 2]
     */
    this.offset = new Point2D(offset);
    /**
     * DropShadow data.
     *
     * 3
     */
    this.radius = radius;
    /**
     * DropShadow data.
     *
     * hsla(0.33, 1, 0.5, 0.5)
     */
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

/**
 * Describes a fill type.
 *
 */
class Fill {
  constructor({
    color,
    linearGradient,
    type
  }) {
    /**
     * Fill data.
     *
     * hsla(0, 1, 0.5, 1)
     */
    this.color = new Color(color);
    /**
     * Fill data.
     *
     * start [0, 0], end [1, 1], stops: [hsla(0, 0, 0, 1) at 0,hsla(0, 0, 1, 1) at 1]
     */
    this.linearGradient = new LinearGradient(linearGradient);
    /**
     * Fill data.
     *
     * Color
     */
    this.type = type;
  }
}


module.exports.Fill = Fill;

/**
 * Provides a simple rectangular panel description.
 *
 */
class Panel {
  constructor({
    cornerRadius,
    background,
    dropShadow
  }) {
    /**
     * Panel data.
     *
     * 5
     */
    this.cornerRadius = cornerRadius;
    /**
     * Panel data.
     *
     * color: hsla(0.67, 1, 0.5, 1)
     * linearGradient: start [0, 0], end [1, 1], stops: [hsla(0, 0, 0, 1) at 0,hsla(0, 0, 1, 1) at 1]
     * type: Color
     */
    this.background = new Fill(background);
    /**
     * Panel data.
     *
     * offset: [2, 3]
     * radius: 4
     * color: hsla(0, 1, 0.5, 1)
     */
    this.dropShadow = new DropShadow(dropShadow);
  }
}


module.exports.Panel = Panel;

const {fillToBackgroundCss} = require('@diez/web-sdk-common');

Object.defineProperties(Panel.prototype, {
  style: {
    get () {
      return {
        background: fillToBackgroundCss(this.background),
        boxShadow: this.dropShadow.boxShadow,
        borderRadius: `${this.cornerRadius}px`,
      };
    },
  },
});

class Bindings {
  constructor({
    image = {file: {src: "assets/image%20with%20spaces.jpg", type: "image"}, file2x: {src: "assets/image%20with%20spaces@2x.jpg", type: "image"}, file3x: {src: "assets/image%20with%20spaces@3x.jpg", type: "image"}, size: {width: 246, height: 246}},
    lottie = {file: {src: "assets/lottie.json", type: "raw"}, loop: true, autoplay: true},
    typograph = {font: {file: {src: "assets/SomeFont.ttf", type: "font"}, name: "SomeFont", fallbacks: ["Verdana", "serif"], weight: 700, style: "normal"}, fontSize: 50, color: {h: 0.16666666666666666, s: 1, l: 0.5, a: 1}, lineHeight: -1, letterSpacing: 0, alignment: "natural", decoration: []},
    tallTypograph = {font: {file: {src: "assets/SomeFont.ttf", type: "font"}, name: "SomeFont", fallbacks: ["Verdana", "serif"], weight: 700, style: "normal"}, fontSize: 50, color: {h: 0, s: 0, l: 0, a: 1}, lineHeight: 100, letterSpacing: 10, alignment: "natural", decoration: ["underline", "strikethrough"]},
    linearGradient = {stops: [{position: 0, color: {h: 0, s: 1, l: 0.5, a: 1}}, {position: 1, color: {h: 0.6666666666666666, s: 1, l: 0.5, a: 1}}], start: {x: 0, y: 0.5}, end: {x: 1, y: 0.5}},
    point = {x: 0.5, y: 0.5},
    size = {width: 400, height: 300},
    shadow = {offset: {x: 1, y: 2}, radius: 3, color: {h: 0.3333333333333333, s: 1, l: 0.5, a: 0.5}},
    fill = {color: {h: 0, s: 1, l: 0.5, a: 1}, linearGradient: {stops: [{position: 0, color: {h: 0, s: 0, l: 0, a: 1}}, {position: 1, color: {h: 0, s: 0, l: 1, a: 1}}], start: {x: 0, y: 0}, end: {x: 1, y: 1}}, type: "Color"},
    panel = {cornerRadius: 5, background: {color: {h: 0.6666666666666666, s: 1, l: 0.5, a: 1}, linearGradient: {stops: [{position: 0, color: {h: 0, s: 0, l: 0, a: 1}}, {position: 1, color: {h: 0, s: 0, l: 1, a: 1}}], start: {x: 0, y: 0}, end: {x: 1, y: 1}}, type: "Color"}, dropShadow: {offset: {x: 2, y: 3}, radius: 4, color: {h: 0, s: 1, l: 0.5, a: 1}}},
    color = {h: 0, s: 0, l: 0, a: 1},
    file = {src: "assets/SomeFile.txt", type: "raw"},
    referencedColor = {h: 0, s: 0, l: 0.06274509803921569, a: 1}
  } = {}) {
    /**
     * assets/image with spaces.jpg (246 x 246)
     */
    this.image = new Image(image);
    /**
     * file: assets/lottie.json
     * loop: true
     * autoplay: true
     */
    this.lottie = new Lottie(lottie);
    /**
     * font: SomeFont, 700, normal
     * fontSize: 50
     * color: hsla(0.17, 1, 0.5, 1)
     * iosTextStyle: body
     * shouldScale: false
     * lineHeight: -1
     * letterSpacing: 0
     * alignment: natural
     * decoration: []
     */
    this.typograph = new Typograph(typograph);
    /**
     * font: SomeFont, 700, normal
     * fontSize: 50
     * color: hsla(0, 0, 0, 1)
     * iosTextStyle: body
     * shouldScale: false
     * lineHeight: 100
     * letterSpacing: 10
     * alignment: natural
     * decoration: [underline,strikethrough]
     */
    this.tallTypograph = new Typograph(tallTypograph);
    /**
     * start [0, 0.5], end [1, 0.5], stops: [hsla(0, 1, 0.5, 1) at 0,hsla(0.67, 1, 0.5, 1) at 1]
     */
    this.linearGradient = new LinearGradient(linearGradient);
    /**
     * [0.5, 0.5]
     */
    this.point = new Point2D(point);
    /**
     * (400 x 300)
     */
    this.size = new Size2D(size);
    /**
     * offset: [1, 2]
     * radius: 3
     * color: hsla(0.33, 1, 0.5, 0.5)
     */
    this.shadow = new DropShadow(shadow);
    /**
     * color: hsla(0, 1, 0.5, 1)
     * linearGradient: start [0, 0], end [1, 1], stops: [hsla(0, 0, 0, 1) at 0,hsla(0, 0, 1, 1) at 1]
     * type: Color
     */
    this.fill = new Fill(fill);
    /**
     * cornerRadius: 5
     * background: color: hsla(0.67, 1, 0.5, 1)
     * linearGradient: start [0, 0], end [1, 1], stops: [hsla(0, 0, 0, 1) at 0,hsla(0, 0, 1, 1) at 1]
     * type: Color
     * dropShadow: offset: [2, 3]
     * radius: 4
     * color: hsla(0, 1, 0.5, 1)
     * elevation: 6
     */
    this.panel = new Panel(panel);
    /**
     * hsla(0, 0, 0, 1)
     */
    this.color = new Color(color);
    /**
     * assets/SomeFile.txt
     */
    this.file = new File(file);
    /**
     * Referenced color value
     *
     * `References.referencedColor` ( hsla(0, 0, 0.06, 1) )
     */
    this.referencedColor = new Color(referencedColor);
  }
}

Object.defineProperty(Bindings, 'name', {value: 'Bindings'});

module.exports.Bindings = Bindings;

