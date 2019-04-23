Color.prototype.toString = function () {
  return `hsla(${this.h}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
};
