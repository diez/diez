const opn = () => {
  return new Promise((resolve) => {
    resolve({unref: () => {}});
  });
};

export default opn;
