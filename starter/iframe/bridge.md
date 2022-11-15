# 微前端框架横行的年头，我用 iframe 玩转了公司的微应用

> 这个冬天有点冷，身边裁员的消息一波接一波，这年头有个稳定的工作都是幸福的 ^-^ 同为天涯打工仔，为了混个温饱啥的，咱还得保持自己的新鲜度是不.....说实在的的，咱也怕被裁啊铁子们 \
> 今天这里分享一个 iframe 使用场景，用得着的帮忙点个赞啥的，这里先谢过啦~~

## 为啥我没选其他微前端框架呢？

1. 贴近当前业务场景：这里主要是所属的业务场景需要嵌入很多其他部门的耦合较低的业务；
2. 基于原生浏览器的硬隔离：js、css、html 天然隔离无干扰；其实这里对我来说考虑的主要还是业务隔离比较彻底；
3. 组外推广方便：对外方便接入，内部提供通用方法，丢出去，省心省事；

> 这里聊下自己关于服务业务的看法，其实就是想着法子的服务好业务 \
> 这里的服务好，不仅仅是满足于基本的业务需求（我相信这个都比较简单）；最主要的是需要适当把握下产品业务走向的趋势，在完成一个需求的情况下，提供对其业务扩展的可能性，最大化提升自己的影响力；其实就是尽量塑造自己的不可替代性，不然总感觉很危机（俗气点就是对公司没啥作用，瞬间就有了被裁的焦虑...）； 

## 先聊下思路

> 需求呢，其实就是在内部一个中台项目提供一块区域，接入组外不同的业务入口？\
> 发散下，这里其实核心考虑 2 点，**父子交互** 与 **交互钩子扩展**
>
> 1. **父子交互**：子元素通过 **postMessage** 向父元素请求数据；父元素接收到 **message** 事件后，将消息数据回调给子元素，以此完成交互；
> 2. **交互钩子扩展**：即对外提供的暴露钩子，将公共业务数据通过钩子形式暴露出去；\
> 
> 钩子一定要**“友好”**，这里的**“友好”**必须具备良好的**可读性**、**数据完善性**、**语法可提示性**；

>  比方说：*实现通过会员id获取会员详细信息*

- *俗气点*的写法

```typescript
function getVipDetail(id) {
  let info;
  // do something...
  return info;
}
```

- *“友好”*的写法

```typescript
/** 会员信息描述 */
export type IVipDTO = {
  /** 会员 id */
  vipId: number | string;
  /** 会员姓名 */
  vipName: string;
  // ...
};

// 1. 基本注释
/**
 * 根据会员id获取会员信息
 *
 * @param vipId 会员 id
 * @return Promise<IVipDTO>
 */
// 2. 基本的入参、出参定义
export const getVipDetail = (vipId: number | string | undefined): Promise<IVipDTO | null> => {
  // 3. 基本的判空异常
  if (!vipId) throw new Error('会员ID不能为空');

  return new Promise((resolve, reject) => {
    // do something...

    // 4. 成功抛出
    resolve(success);

    // or

    // 5. 失败抛出异常
    reject(fail);
  });
};
```

> 其实主要最大限度的减少对外沟通的成本（这里吐槽下，业务组太多，扯皮也很多...一不小心就成了甩锅对象，哎，人多的的地方就有江湖），所以，*“友好”*真的很重要；

## 撸起袖子，干起来

> 明确该*怎么干*，要*干些什么*，这一步需要分层、分点把细节拆分出来

### 实现父子交互

- 父元素监听 **message** 事件，接收消息

```typescript
function initIframe(iframe) {
  // 1. 父元素监听 message
  window.addEventListener('message', handleMessage, false);

  // 2. 处理消息回调
  function handleMessage(evt) {
    // 3. 安全策略：同域名消息拦截
    if (evt.origin !== window.location.origin) return;

    const { action, data } = evt.data || {};
    // 4. 处理消息策略
    switch (action) {
      case 'A':
        // todo something
        break;
      case 'B':
        // todo something
        break;
    }

    // 5. 回调通知子元素
    const childWindow = iframe.contentWindow;
    // 这里通过与子元素定义回调规则，这里假设以 action 同步定义
    const handler = childWindow[action];
    handler && handler(something);
  }
}
```

- 定义子元素发起事件规则

> 这个是子元素发起消息时候使用

```typescript
function postMessageToIframe(action, payload) {
  // 1. 定义接收回调数据钩子
  window[action] = (res) => {
    // todo something
  };

  // 2. 向 iframe 发送消息
  window.parent.postMessage({ action, payload }, window.origin);
}
```

### “友好”地实现

> 以上其实已经具备了基本雏形，不过正式对外推广其实还太过简陋了点，有点说不过去，哈哈哈~ \
> 咱们来 *升个级* 

1. iframe 侧实现

```typescript
/**
 * 初始化 iframe
 *  1. 事件监听
 *  2. 窗体初始化
 *
 * @param iframe 容器
 */
export const initIframe = (iframe: HTMLIFrameElement | null) => {
  // 1. 判空
  if (!iframe) return;

  /**
   * 窗体宽高自适应
   *
   * @param iframe 元素
   */
  const handleResize = () => {
    if (!iframe) return;

    // 获取父元素
    const parentNode = iframe.parentNode as HTMLDivElement;
    const { width, height } = parentNode.getBoundingClientRect() || {};
    iframe.width = width ? width + 'px' : '100%';
    iframe.height = height ? height + 'px' : '100%';
    parentNode.style.overflow = 'hidden';
  };

  /**
   * 处理消息回调
   */
  const handleMessage = (evt: MessageEvent) => {
    // 1. 安全策略：同域名消息拦截
    if (evt.origin !== window.location.origin) return;

    const { action, data } = evt.data || {};
    let result;
    // 2. 处理消息策略
    switch (action) {
      case 'A':
        // todo something
        break;
      case 'B':
        // todo something
        break;
    }

    // 3. 回调通知子元素
    const childWindow = iframe.contentWindow;
    // 这里通过与子元素定义回调规则，这里假设以 action 同步定义
    const handler: (result: any) => void = childWindow[action] as any;
    handler && handler(result);
  };

  // 2. 初始化窗体宽高
  handleResize();

  // 3. 窗体自适应，避免窗口缩放引起的容器不缩放问题
  window.addEventListener('resize', handleResize, false);
  // 4. 父元素监听 message & 处理消息回调
  window.addEventListener('message', handleMessage, false);

  // 返回事件销毁回调，这个很重要！！！
  return () => {
    // 5. 销毁 resize 监听
    window.removeEventListener('resize', handleResize, false);
    // 6. 销毁 message 监听
    window.removeEventListener('message', handleMessage, false);
  };
};
```

2. 子元素侧调用

> 这里其实都是对外提供的钩子方法，尤其需要注意，因为是提供给外部使用的，咱们先“友好”的实现它

```typescript
/**
 * 这里可以整合定义 action 的统一枚举
 *
 *  1. 用来告知对外扩展的动作集合
 *  2. 可以以此作“友好”提示
 */
export enum ActionEnum {
  /** 动作 A */
  actionA = 'actionA',
  /** 动作 B */
  actionB = 'actionB',
  /** 动作 C */
  actionC = 'actionC',
}

/**
 * 向 iframe 发送消息，并定义好回调钩子
 *
 * @param action 动作
 * @param payload 附加参数
 *
 * @return Promise<{ success: boolean; result?: any; message?: string }>
 */
const postMessageToIframe = (action: ActionEnum, payload?: any): Promise<{ success: boolean; result?: any; message?: string }> => {
  // 1. 这里考虑严谨的话需要考虑下动作是否合法
  if (!ActionEnum[action]) return Promise.reject({ success: false, message: `${action} 不合法` });

  return new Promise((resolve, reject) => {
    // 2. 定义接收回调数据钩子
    window[action] = (res: any) => {
      // todo something
      resolve({ success: true, result: res });
    };

    // 2. 向 iframe 发送消息
    window.parent.postMessage({ action, payload }, window.origin);
  });
};

// 扩展对外方法
export const bridgeToActionA = () => postMessageToIframe(ActionEnum.actionA);

// 扩展对外方法
export const bridgeToActionB = () => postMessageToIframe(ActionEnum.actionB);

// todo 继续扩展
```

> 以上核心功能已完成，基本完活：
>
> 1. 具备基本的功能；
> 2. 足够的注释与说明; 
> 3. 代码足够“友好”；
>
> 不过，这里还有一个问题需要考虑，如何对外推广呢？？？文档？CV 大法？

## "友好"地推广

### 考虑推广方式

> 文档必不可少，至少要写清楚告诉别人怎么用；\
> 考虑推广之后的二次维护问题：如何二次改造？如何升级？如何通知？

1. 最基本的代码 CV 大法，这种一般是下下策了，可以说是极难维护的一种了，弊端可见一斑，升个级都够呛。。。
2. 公共 cdn 包 + 版本号 推广，这种方式比较传统常见，需要自己维护 cdn 版本文件；
3. 公共 npm 包，这种方式常规需要基于公司 npm 私库建设，公司的内容不推荐 外部 npm 仓库，除非自己玩哈，基本的职业操守还是要有的

> 吐槽下，曾经遇到一个架构把公司代码直接干到 github 上了。。。还署名了。。。就差被公司制裁了

### cdn 包 + 版本号

> 这种其实就代码打个包，压缩下，定一个版本号，然后放到 cdn 空间里面即可

1. 手动打包或者在线打包工具啥的都行
2. 打包工具打包（这种方式还是比较推荐，利于长久维护）

- gulp
- webpack
- vite
- turbopack

> 打包工具比较多，就不一一列举了，好用才是王道，挑一个简单熟悉的整起来就是了

### npm 包

> 这种方式在企业内公共基建推广使用还是比较广泛的，企业内比较推荐这种方式进行推广；\
> 其实核心也比较简单，2 件事： 打包 、发布到私库 \

1. 首先打包，这里推荐 2 种方式

- typescript 自带打包方式，支持解构 typescript 类型定义文件，便捷代码引入与类型提示，巨方便
- `father build`: 阿里 umijs 相关的打包工具，图个省事，配置简单，提供便捷的文档支持，简单好用

2. 构建环境

![](https://files.mdnice.com/user/5404/346ff36f-12a9-4f8b-a8ce-7ae7cf837973.jpg)


- `tsconfig.json`

```json
{
  "compilerOptions": {
    "sourceMap": false,
    /** 这个属性比较重要，设置是否生成 .d.ts 类型说明 */
    "importHelpers": true,
    "declaration": true,
    "module": "ES2015",
    "outDir": "dist/",
    "baseUrl": ".",
    "target": "esnext",
    "lib": ["esnext", "dom"],
    "allowJs": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "suppressImplicitAnyIndexErrors": true,
    "downlevelIteration": true,
    "alwaysStrict": true
  },
  "include": ["src"]
}
```

- `package.json`

```json
{
  "name": "@howieyi/iframe",
  "version": "1.0.0",
  "description": "iframe 桥接小工具",
  "keywords": ["bridge", "iframe"],
  "homepage": "",
  "license": "ISC",
  "author": "howieyi <247767221@qq.com>",
  "sideEffects": false,
  "main": "lib/index.js",
  /** 露出对外引用代码定义说明 */
  "typings": "lib/index.d.ts",
  "directories": {
    "src": "src"
  },
  "files": ["lib", "dist", "package.json", "README.md"],
  "scripts": {
    /** father 编译 */
    "build": "npm run clean && father build",
    /** typescript 编译 */
    "build:tsc": "npm run clean && tsc --project tsconfig.json --outDir dist/ --module ES2015",
    "clean": "rimraf dist && rimraf lib && rimraf es",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {},
  "devDependencies": {
    "father": "^2.30.21",
    "rimraf": "^3.0.2",
    "tslib": "^2.3.1",
    "typescript": "^4.6.3"
  },
  "publishConfig": {
    "registry": "https://www.npmjs.com/npm/npm-registry/"
  }
}
```

- 编译产物

![](https://files.mdnice.com/user/5404/93ff18d2-bd1f-446c-ba84-257d6c6d7eb2.png)


- 发布 `npm publish` 到仓库

> 完活

### 见证”友好“时刻

- `iframe.d.ts`

> 定义甩出去，妥妥的技术文档和说明

```typescript
/**
 * 这里可以整合定义 action 的统一枚举
 *
 *  1. 用来告知对外扩展的动作集合
 *  2. 可以以此作“友好”提示
 */
export declare enum ActionEnum {
  /** 动作 A */
  actionA = 'actionA',
  /** 动作 B */
  actionB = 'actionB',
  /** 动作 C */
  actionC = 'actionC',
}
/**
 * 向 iframe 发送消息，并定义好回调钩子
 *
 * @param action 动作
 * @param payload 附加参数
 *
 * @return Promise<{ success: boolean; result?: any; message?: string }>
 */
export declare const postMessageToIframe: (
  action: ActionEnum,
  payload?: any
) => Promise<{
  success: boolean;
  result?: any;
  message?: string;
}>;
export declare const bridgeToActionA: () => Promise<{
  success: boolean;
  result?: any;
  message?: string;
}>;
export declare const bridgeToActionB: () => Promise<{
  success: boolean;
  result?: any;
  message?: string;
}>;
```

- 用一下试试，看看是否会丝滑一些
![](https://files.mdnice.com/user/5404/1b8b3b8b-0166-4f96-9063-82514dad7ac0.png)
![](https://files.mdnice.com/user/5404/bed8d63b-b6ac-4cb0-a4d9-85c6ca934f98.png)

> 这次是真的完活拉，完美，这里附上完整源码，希望对大家有帮助，感谢阅读~ 
>
> [源码参考：https://github.com/howieyi/learning-tools](https://github.com/howieyi/learning-tools)

## 思路小结

> 本文偏向思路型，主要给大家分享一个公司业务常见的场景，并未展开相关的业务延展性，主要还是需要根据公司独有的业务来定性； \
> 本文均属*个人见解*，如有不对的烦请指出; \
> 如有帮助的，铁子们动动小手，*加个前端技术群*咱们一起*探讨前端技术问题*~~~

![](https://files.mdnice.com/user/5404/03f6ccde-7ac5-4ec9-a4d8-7283425eeb61.png)

