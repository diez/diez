Color.prototype.toString = function () {
  return `hsla(${this.h * 360}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
};
