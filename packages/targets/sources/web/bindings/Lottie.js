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
    // TODO: configuration "autoplay".
    autoplay: true,
    // TODO: configuration "loop".
    loop: true,
  });
};
