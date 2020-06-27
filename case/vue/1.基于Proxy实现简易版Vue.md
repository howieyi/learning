## 基于 Proxy 实现简易版 Vue

### 分解剖析

1. 实现 `new Vue()` 实例化
2. 实现 `{{ prop }}` 绑定值
3. 实现 `v-model` 双向绑定值

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue</title>
  </head>
  <body>
    <div id="app">
      <input v-model="text" />
      {{text}}
      <span>{{text}}</span>
    </div>
    <script src="./vue.js"></script>
    <script>
      var app = new Vue({
        el: "#app",
        data: {
          text: "hello world",
        },
      });
    </script>
  </body>
</html>
```

### 实现 `class Vue`

#### 初始化

```js
// 这里继承 EventTarget 提供 Vue 可以接收事件、并且可以创建侦听器的功能
class Vue extends EventTarget {
  constructor(options) {
    this.options = options;
    this.$el = document.querySelector(options.$el);
    // 数据双向绑定
    this.data = this.observerData(options.data);
    // 数据模板渲染
    this.compileTemplate(this.$el);
  }
}
```

#### 渲染模板

- 遍历子元素，拆解文本节点，拆解文本中符合 `{{**}}` 特征数据值，绑定`data`中的值;
- 元素节点中涵盖 `v-model` 属性的对该属性值进行数据`data`绑定;

```js
compileTemplate(node) {
  // 子节点
  const children = node.childNodes;
  children.forEach((it) => {
    if (it.nodeType === 3) {
      // text 文本节点
      // 正则匹配 {{}} 特征的绑定值
      const regexp = /\{\{\s*([^\s\{\}]+)\s*\}\}/gi;
      const textContent = it.textContent;
      if (textContent.match(regexp)) {
        const prop = RegExp.$1;
        it.textContent = textContent.replace(regexp, this.data[prop]);
        // 节点事件响应监听
        // 用于接收属性 set 后的事件响应
        this.addEventListener(
          prop,
          function (event) {
            it.textContent = textContent.replace(regexp, event.detail);
          },
          false
        );
      }
    } else if (it.nodeType === 1) {
      // node 元素节点
      this.compileTemplate(it);
      // check v-model
      const attrs = it.attributes;

      if (attrs.hasOwnProperty("v-model")) {
        const _this = this;
        const prop = attrs["v-model"].nodeValue;
        it.value = this.data[prop];
        // 监听输入 change
        it.addEventListener(
          "input",
          function (event) {
            // TODO 入口需要做XSS校验
            _this.data[prop] = event.target.value;
          },
          false
        );
      }
    }
  });
}
```

#### 数据双向绑定

```javascript
  // 双向绑定
  observerData(data) {
    const _this = this;
    return new Proxy(data, {
      set: function (target, prop, newValue) {
        // 创建 set 属性事件
        const event = new CustomEvent(prop, { detail: newValue });
        // 广播该 set 属性事件
        _this.dispatchEvent(event);

        return Reflect.set(...arguments);
      },
    });
  }
```

### 相关对象

#### [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)

> EventTarget 是一个 DOM 接口，由可以接收事件、并且可以创建侦听器的对象实现。

- [EventTarget.addEventListener(type, listener, options/useCapture)](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)：在 EventTarget 上注册特定事件类型的事件处理程序。
- [EventTarget.removeEventListener(type, listener, options/useCapture)](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener)：EventTarget 中删除事件侦听器。
- [EventTarget.dispatchEvent(event, target)](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent)：将事件分派到此 EventTarget。

#### [Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

> Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 proxy handlers 的方法相同。Reflect 不是一个函数对象，因此它是不可构造的。\
> 与大多数全局对象不同，Reflect 不是一个构造函数。你不能将其与一个 new 运算符一起使用，或者将 Reflect 对象作为一个函数来调用。Reflect 的所有属性和方法都是静态的（就像 Math 对象）。

- `Reflect.get()`: 获取对象身上某个属性的值，类似于 target[name]。
- `Reflect.set()`: 将值分配给属性的函数。返回一个 Boolean，如果更新成功，则返回 true。

#### [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

> Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

- `target`：要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
- `handler`：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。
  - [handler.get()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get)：属性读取操作的捕捉器。
    > 该方法会拦截目标对象的以下操作:
    >
    > 1. 访问属性: `proxy[foo]`和 `proxy.bar`
    > 2. 访问原型链上的属性: `Object.create(proxy)[foo]`
    > 3. [Reflect.get()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get)：Reflect.get()方法与从 对象 (target[propertyKey]) 中读取属性类似，但它是通过一个函数执行来操作的。
  - [handler.set()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set)：属性设置操作的捕捉器。
    > 该方法会拦截目标对象的以下操作:
    >
    > 1. 指定属性值：`proxy[foo] = bar` 和 `proxy.foo = bar`
    > 2. 指定继承者的属性值：`Object.create(proxy)[foo] = bar`
    > 3. [Reflect.set()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set)：静态方法 Reflect.set() 工作方式就像在一个对象上设置一个属性。

```JavaScript
const handler = {
  get: function(target, prop, receiver){
    // 拦截读取
    return Reflect.get(...arguments);
  },
  set: function(target, prop, newValue, receiver){
    // 拦截设置
    return Reflect.set(...arguments);
  }
};
const p = new Proxy(target, handler);
```

#### [CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)

> CustomEvent 事件是由程序创建的，可以有任意自定义功能的事件。

- `CustomEvent.detail`: 只读，任何时间初始化时传入的数据

### 完整代码

```javascript
class Vue extends EventTarget {
  constructor(options) {
    super();

    this.options = options;
    this.$el = document.querySelector(options.el);
    this.data = this.observerData(options.data);
    this.compileTemplate(this.$el);
  }

  // 双向绑定
  observerData(data) {
    const _this = this;
    return new Proxy(data, {
      set: function (target, prop, newValue) {
        // 事件发布
        const event = new CustomEvent(prop, { detail: newValue });
        _this.dispatchEvent(event);

        return Reflect.set(...arguments);
      },
    });
  }

  // 模板编译
  compileTemplate(node) {
    const children = node.childNodes;
    children.forEach((it) => {
      if (it.nodeType === 3) {
        // text 文本节点
        const regexp = /\{\{\s*([^\s\{\}]+)\s*\}\}/gi;
        const textContent = it.textContent;
        if (textContent.match(regexp)) {
          const prop = RegExp.$1;
          it.textContent = textContent.replace(regexp, this.data[prop]);
          // 事件接收
          this.addEventListener(
            prop,
            function (event) {
              it.textContent = textContent.replace(regexp, event.detail);
            },
            false
          );
        }
      } else if (it.nodeType === 1) {
        // node 元素节点
        this.compileTemplate(it);
        // check v-model
        const attrs = it.attributes;

        if (attrs.hasOwnProperty("v-model")) {
          const _this = this;
          const prop = attrs["v-model"].nodeValue;
          it.value = this.data[prop];
          it.addEventListener(
            "input",
            function (event) {
              // TODO 入口需要做XSS校验
              _this.data[prop] = event.target.value;
            },
            false
          );
        }
      }
    });
  }
}
```
