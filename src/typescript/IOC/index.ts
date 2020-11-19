import { parseScript } from "esprima";
import { Pattern } from "estree";

interface IIndexService {
  log(str: string): void;
}

class IndexService {
  log(str: string) {
    console.log(str);
  }
}

function getControllerParams(fn: Function) {
  const ast = parseScript(fn.toString());
  const node = ast.body[0];
  let fnParams: Pattern[] = [];

  if (node.type === "FunctionDeclaration") {
    fnParams = node.params;
  }

  let validParams: string[] = [];
  fnParams.forEach(it => {
    if (it.type === "Identifier") {
      validParams.push(it.name);
    }
  });

  return validParams;
}

function controller<T extends { new (...args: any[]): {} }>(constructor: T) {
  class Controller extends constructor {
    constructor(...args: any[]) {
      super(args);

      const params = getControllerParams(constructor);

      let param: string;
      for (param of params) {
        this[param] = new IndexService();
      }
    }
  }

  return Controller;
}

@controller
class IndexController {
  private indexService: IIndexService;

  constructor(indexService?: IIndexService) {
    this.indexService = indexService;
  }

  info() {
    this.indexService.log("IOC 注入");
  }
}

const index = new IndexController();
index.info();
