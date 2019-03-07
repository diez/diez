export default () => {
  return new Promise((resolve) => {
    resolve({unref: () => {}});
  });
};
