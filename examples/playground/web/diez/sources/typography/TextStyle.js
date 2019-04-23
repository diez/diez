import {Color} from '../color/Color';

export class TextStyle {
  constructor ({color, fontName, fontSize} = {color: new Color(), fontName: '', fontSize: 16}) {
    this.color = color;
    this.fontName = fontName;
    this.fontSize = fontSize;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    if (payload.fontName !== undefined) {
      this.fontName = payload.fontName;
    }

    if (payload.fontSize !== undefined) {
      this.fontSize = payload.fontSize;
    }

    this.color.update(payload.color);
  }
}

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
