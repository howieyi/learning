interface IContainer {
  callback: Function;
  singleton: boolean;
  instance?: {};
}

class CreateIco {
  private container: Map<PropertyKey, IContainer>;
  constructor() {
    this.container = new Map<string, IContainer>();
  }
}
