export = () => {
  return new Promise((resolve) => {
    resolve({unref: () => {}});
  });
};
