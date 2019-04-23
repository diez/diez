export class Color {
  constructor ({h, s, l, a} = {h: 0, s: 0, l: 0, a: 1}) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    if (payload.h !== undefined) {
      this.h = payload.h;
    }

    if (payload.s !== undefined) {
      this.s = payload.s;
    }

    if (payload.l !== undefined) {
      this.l = payload.l;
    }

    if (payload.a !== undefined) {
      this.a = payload.a;
    }
  }
}

Color.prototype.toString = function () {
  return `hsla(${this.h}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
};
