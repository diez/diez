interface FileNameResolver {
  [key: string]: number;
}

export class UniqueNameResolver {
  private uniqueNameResolver: FileNameResolver = {};

  get (name: string) {
    if (!this.uniqueNameResolver.hasOwnProperty(name)) {
      this.uniqueNameResolver[name] = 0;
      return name;
    }

    return `${name} Copy ${++this.uniqueNameResolver[name]}`;
  }
}
