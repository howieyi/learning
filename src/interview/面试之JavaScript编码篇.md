## 造轮子

### `Array.prototype.map` ?

- 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果

```javascript
```

### `Array.prototype.filter` ?

- 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

### `Array.prototype.reduce` ?

- 方法对数组中的每个元素执行一个由您提供的 `reducer` 函数(升序执行)，将其结果汇总为单个返回值

### `let` ?

> 如何在 ES5 环境下实现 let

### `const` ?

### `new` ?

### `call` ?

- 定义：`call` 是属于所有 `Function` 的方法，也就是 `Function.prototype.call`。

- 语法

```javascript
/**
 * 语法
 * @param thisArg this指向
 * @param arg 指定的参数 arg1, arg2.....argN
 */
fun.call(thisArg[,arg1[,arg2,…]]);
```

- ECMScript 规范

  > 当以 `thisArg` 和可选的 `arg1,arg2...argN` 等等作为参数在一个 func 对象上调用 call 方法，采用如下步骤：
  >
  > 1. 如果 IsCallable(func)是 false, 则抛出一个 TypeError 异常。
  > 2. 令 argList 为一个空列表。
  > 3. 如果调用这个方法的参数多余一个，则从 arg1 开始以从左到右的顺序将每个参数插入为 argList 的最后一个元素。
  > 4. 提供 thisArg 作为 this 值并以 argList 作为参数列表，调用 func 的[[Call]]内部方法，返回结果。
  >
  > call 方法的 length 属性是 1。\
  > 在外面传入的 thisArg 值会修改并成为 this 值。thisArg 是 undefined 或 null 时它会被替换成全局对象，所有其他值会被应用 ToObject 并将结果作为 this 值，这是第三版引入的更改。

- 实现

```javascript
Function.prototype.newCall = function (thisArg) {
  // 如果 引用对象不合法 则抛出异常
  if (typeof this !== "function")
    throw new TypeError(this + " is not a function");

  var argsArray = Array.prototype.slice.call(arguments, 1);

  // 如果 thisArg 不合法 则引用 window 对象
  if (thisArg === null || typeof thisArg === "undefined") thisArg = window;

  var key = Symbol();

  // 引用当前 this
  thisArg[key] = this;
  // 调用 this 方法， 其实这里的对象作用域已经转嫁到 thisAry
  // 这里 ... 拓展是 es7 的语法糖，部分浏览器并不支持

  var result = thisArg[key](...argsArray);
  delete thisArg[key];

  return result;
};
```

### `apply` ?

- 定义：`apply` 也是属于所有 `Function` 的方法，也就是 `Function.prototype.apply`。
- 语法

```javascript
/**
 * apply() 方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数。
 * @param thisArg this指向
 * @param argsArray 参数数组
 */
fun.apply(thisArg, [argsArray]);
```

> 通过语法就可以看出 call 和 apply 的在参数上的一个区别：
>
> 1. call 的参数是一个列表，将每个参数一个个列出来
> 2. apply 的参数是一个数组，将每个参数放到一个数组中

- ECMAScript 规范
  > 当以 thisArg 和 argArray 为参数在一个 func 对象上调用 apply 方法，采用如下步骤：
  >
  > 1. 如果 IsCallable(func)是 false, 则抛出一个 TypeError 异常 .
  > 2. 如果 argArray 是 null 或 undefined, 则
  > 3. 返回提供 thisArg 作为 this 值并以空参数列表调用 func 的[[Call]]内部方法的结果。
  > 4. 如果 Type(argArray)不是 Object, 则抛出一个 TypeError 异常 .
  > 5. 令 len 为以"length"作为参数调用 argArray 的[[Get]]内部方法的结果。
  > 6. 令 n 为 ToUint32(len).
  > 7. 令 argList 为一个空列表 .
  > 8. 令 index 为 0.
  > 9. 只要 index<n 就重复
  > 10. 令 indexName 为 ToString(index).
  > 11. 令 nextArg 为以 indexName 作为参数调用 argArray 的[[Get]]内部方法的结果。
  > 12. 将 nextArg 作为最后一个元素插入到 argList 里。
  > 13. 设定 index 为 index + 1.
  > 14. 提供 thisArg 作为 this 值并以 argList 作为参数列表，调用 func 的[[Call]]内部方法，返回结果。
  >
  > apply 方法的 length 属性是 2。\
  > 在外面传入的 thisArg 值会修改并成为 this 值。thisArg 是 undefined 或 null 时它会被替换成全局对象，所有其他值会被应用 ToObject 并将结果作为 this 值，这是第三版引入的更改。

```javascript
Function.prototype.newApply = function (thisArg, argsArray) {
  // 如果 引用对象不合法 则抛出异常
  if (typeof this !== "function")
    throw new TypeError(this + " is not a function");

  // 如果参数不合法 则默认参数为空数组
  if (typeof argsArray === "undefined" || argsArray === null) argsArray = [];

  // 如果 thisArg 不合法 则引用 window 对象
  if (thisArg === null || typeof thisArg === "undefined") thisArg = window;

  var key = Symbol();
  // 引用当前 this
  thisArg[key] = this;
  // 调用 this 方法， 其实这里的对象作用域已经转嫁到 thisAry
  // 这里 ... 拓展是 es7 的语法糖，部分浏览器并不支持
  var result = thisArg[key](...argsArray);

  // 清理缓存 this
  delete thisArg[key];
  return result;
};
```

### `Function.prototype.bind` ?

- 定义：`bind()` 创建一个新的函数，在新创建的函数中的 `this` 为 `bind` 传入的第一个参数，之后的参数作为新函数的参数供其调用；
- 语法

```javascript
/**
 * bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。
 *
 * @param thisArg this指向
 * @param arg 指定的参数 arg1, arg2.....argN
 */
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```

- 编码实现

```javascript
Function.prototype.newBind = function (thisArg) {
  // 如果 引用对象不合法 则抛出异常
  if (typeof this !== "function")
    throw new TypeError(this + " is not a function");

  var that = this;
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);
  var fn = function () {};
  var newFunc = function () {
    var isInstanceFn = this instanceof fn;
    // 返回fBond的引用，由外部按需调用
    newFunc.prototype = isInstanceFn ? new fn() : newFunc.prototype;
    return that.apply(
      // this instanceof fn 则 this 为 new 的对象
      // 否则 取传入的 thisArg，再 newFunc 自己
      isInstanceFn ? this : thisArg || this,
      args.concat(slice.call(arguments))
    );
  };

  // 将目标函数的原型对象拷贝到新函数中，因为目标函数有可能被当作构造函数使用
  this.prototype && (fn.prototype = this.prototype);
  return newFunc;
};
```

### 防抖函数

- 防抖，是延迟执行，即短时间内大量触发同一事件，只会执行一次函数。

  > 实现原理为设置一个定时器，约定在 xx 毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到 xx 毫秒内无第二次操作;\
  > 防抖常用于搜索框/滚动条的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

- 编码实现

```javascript
function debounce(fn, delay) {
  // 定时器临时变量
  var timer = null;
  return function () {
    // 清理定时器，闭包缓存 timer 变量，不会再函数执行后清理
    timer !== null && clearTimeout(timer);
    var context = this;
    var args = arguments;

    // 新建定时器
    timer = setTimeout(function () {
      // 继承上下文以及参数
      fn && fn.apply(context, args);
    }, delay);
  };
}
```

### 节流函数

- 节流，是间隔执行，函数节流即每隔一段时间就执行一次

  > 实现原理为设置一个定时器，约定 xx 毫秒后执行事件，如果时间到了，那么执行函数并重置定时器;\
  > 和防抖的区别在于，防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器

- 编码实现

```javascript
function throttle(fn, delay) {
  // 定时器临时变量
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;

    if (timer !== null) return;

    // 定时器执行完后继续执行
    timer = setTimeout(function () {
      // 重置定时器变量
      timer = null;
      // 继承上下文以及参数
      fn && fn.apply(context, args);
    }, delay);
  };
}
```
