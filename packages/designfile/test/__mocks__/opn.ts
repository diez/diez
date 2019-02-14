const opn = (url: string, options: any) => {
  return new Promise((resolve) => {
    resolve({unref: () => {}})
  })
}

export default opn;
