## 面试题之 javascript 基础篇

1. `undefined` 和 `null` 有什么区别？

- 首先，它们属于想到 7 种基本类型之一： `string`/ `number` / `boolean` / `undefined` / `null` / `symbol` / `bigint`
- 其次，它们都是`虚值`，可以转换为布尔值 `false`

  - [`虚值（falsy）`](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)： `Boolean` 上下文中认定为 `false` 的值，js 中有以下 7 个虚值，

  | 值           | 解释                                                                                                        |
  | ------------ | ----------------------------------------------------------------------------------------------------------- |
  | false        | false 关键字                                                                                                |
  | 0            | 数值 zero                                                                                                   |
  | 0n           | 当 BigInt 作为布尔值使用时, 遵从其作为数值的规则. 0n 是 falsy 值.                                           |
  | "", '', \`\` | 这是一个空字符串 (字符串的长度为零). JavaScript 中的字符串可用双引号 "", 单引号 '', 或 模板字面量 `` 定义。 |
  | null         | 缺少值                                                                                                      |
  | undefined    | 原始值                                                                                                      |
  | NaN          | 非数值                                                                                                      |

```javascript
Boolean(undefined) === Boolean(null); // true
false === !!undefined; // true
false === !!null; // true
undefined == null; // true
undefined === null; // false
```

- `undefined` 在以下情形 js 引擎会分配为该值：

  - 未指定特定值的变量的默认值;
  - 没有显示返回值的函数;
  - 对象中不存在的属性;

  ```javascript
  var a;
  var b = function () {};
  var c = {};

  console.log(a); // undefined
  console.log(b()); // undefined
  console.log(c.d); // undefined
  ```

  - `null` 是 `不代表任何值的值`，是已明确定义给变量的值

2. `&&`(逻辑与) `|| (逻辑或)`运算符能做什么？

- `&&`
  - 在其操作数中找到第一个`虚值表达式`并返回它，如果没有找到任何虚值，返回其最后一个真值表达式
  - 用作短路操作来防止不必要的执行

```javascript
false && 1 && []; // false
true && 1 && []; // []

isTrue && a(); // isTrue 为 true 才执行 a()
```

- `||`
  - 在其操作数中找到第一个`真值表达式`并返回它
  - 用作短路来防止不必要的执行
  - 用于初始化函数中的默认参数值

```javascript
console.log(null || 1 || undefined); // 1

var a = function (type) {
  return type || "4";
};
a(); // 4;
```

3. 使用 + 或一元加运算符是将字符串转换为数字的最快方法吗？

- 根据[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators)，`+`(一元正号)是将`字符串转换为数字的最快方法`，因为如果值已经是数字，它不会执行任何多余的操作。
  - 它可以将字符串转换成整数和浮点数形式，
  - 也可以转换非字符串值 `true`，`false` 和 `null`。
  - 小数和十六进制格式字符串也可以转换成数值。
  - 负数形式字符串也可以转换成数值（对于十六进制不适用）。
  - 如果它不能解析一个值，则计算结果为 `NaN`。

```javascript
+3 + // 3
"3" + // 3
true + // 1
false + // 0
null + // 0
  +function (val) {
    return val;
  }; //NaN
```

4. DOM 是什么？

- `文档对象模型`，是 `HTML` 和 `XML` 文档的接口(`API`)
  - 当浏览器第一次读取(解析)`HTML` 文档时，它会创建一个大对象(`window.document`)，一个基于 `HTML` 文档的非常大的对象，这就是 `DOM`。
  - 它是一个从 `HTML` 文档中建模的树状结构。
  - `DOM` 用于交互和修改 `DOM` 结构或特定元素或节点。

5. 什么是事件传播?

- 当事件发生在 `DOM` 元素上时，该事件并不完全发生在那个元素上。在`“冒泡阶段”`中，事件冒泡或`向上`传播至父级，祖父母，祖父母或父级，直到到达 `window` 为止；
- 而在`“捕获阶段”`中，该事件并不完全发生在那个元素上，事件从 `window` 开始`向下`触发元素、事件或 `event.target`。
- 事件传播的三个阶段：
  - `捕获阶段`: 事件从 window 开始，然后向下到每个元素，直到到达目标元素;
  - `目标阶段`: 事件已达到目标元素;
  - `冒泡阶段`: 事件从目标元素冒泡，然后上升到每个元素，直到到达 `window`;

> 下述 `HTML` 结构：

```html
<div class="grandparent">
  <div class="parent">
    <div class="child">1</div>
  </div>
</div>
```

```javascript
function addEvent(el, event, callback, isCapture = false) {
  if (!el || !event || !callback || typeof callback !== "function") return;
  if (typeof el === "string") {
    el = document.querySelector(el);
  }
  el.addEventListener(event, callback, isCapture);
}

addEvent(document, "DOMContentLoaded", () => {
  const child = document.querySelector(".child");
  const parent = document.querySelector(".parent");
  const grandparent = document.querySelector(".grandparent");

  addEvent(child, "click", function (e) {
    console.log("child");
  });

  addEvent(parent, "click", function (e) {
    console.log("parent");
  });

  addEvent(grandparent, "click", function (e) {
    console.log("grandparent");
  });

  addEvent(document, "click", function (e) {
    console.log("document");
  });

  addEvent("html", "click", function (e) {
    console.log("html");
  });

  addEvent(window, "click", function (e) {
    console.log("window");
  });
});
```

> `addEventListener` 方法具有第三个可选参数 `useCapture`，其默认值为 `false`，事件将在冒泡阶段中发生，如果为 `true`，则事件将在捕获阶段中发生。\
> 如果单击 `child` 元素，它将分别在控制台上打印 `window`，`document`，`html`，`grandparent` 和 `parent`，这就是`事件捕获`。\
> 如果单击 `child` 元素，它将分别在控制台上记录 `child`，`parent`，`grandparent`，`html`，`document` 和 `window`，这就是事件冒泡。

6. `event.preventDefault()` 和 `event.stopPropagation()`方法之间有什么区别？

- `event.preventDefault()` 方法可防止元素的默认行为。如果在表单元素中使用，它将阻止其提交。如果在锚元素中使用，它将阻止其导航。如果在上下文菜单中使用，它将阻止其显示或显示。
  - 我们可以在事件对象中使用`event.defaultPrevented`属性。它返回一个布尔值用来表明是否在特定元素中调用了 `event.preventDefault()`。
- `event.stopPropagation()` 方法用于阻止捕获和冒泡阶段中当前事件的进一步传播。

7. `event.target` 与 `event.currentTarget` 的区别？

- `event.target`： 是发生事件的元素或触发事件的元素。
- `event.currentTarget`： 是我们在其上显式附加事件处理程序的元素。
- 以下点击按钮触发事件，`event.target` 为 `button` 元素，而 `event.currentTarget` 则为 `div` 元素

```html
<div onclick="eventHere">
  <button>click here</button>
</div>
```

8. `==` 和 `===` 有什么区别？

- `==` 一般比较，在比较的时候可以转换数据类型，假定 `x == y` 表达式：

  - 如果`x`和`y`类型相同，则 js 会换成 `===` 进行比较；
  - 如果`x`为`null`, `y`为`undefined`，则返回 `true`，顺序调换一样;
  - 如果`x`的类型是`number`或者`boolean`, `y`的类型是`string`，那么返回`x == toNumber(y)`，顺序调换一样;
  - 如果`x`是`string`、`symbol`或`number`，而`y`是`object`类型，则返回`x == toPrimitive(y)`，顺序调换一样;;
    - `toPrimitive`首先在对象中使用`valueOf`方法，然后使用`toString`方法来获取该对象的原始值
  - 剩下的返回 `false`

- `===` 严格比较，只要类型不匹配就返回 `false`;

9. 提升？

- `提升`：是用来描述变量和函数移动到其（全局或者函数）作用域顶部的术语；
- `执行上下文`：是当前正在执行的代码环境，包含`编译`和`执行`两个阶段；
  - `编译`：JS 引荐获取所有函数声明并将其提升到其作用域的顶部，以便我们稍后可以引用它们并获取所有变量声明（使用 `var` 关键字进行声明），还会为它们提供默认值：`undefined`。
    - 只有使用 `var` 声明的变量，或者函数声明才会被提升，相反，函数表达式或箭头函数，`let` 和 `const` 声明的变量，这些都不会被提升。
  - `执行`：在这个阶段中，它将值赋给之前提升的变量，并执行或调用函数(对象中的方法)。

10. 作用域？

- `作用域`：是我们可以有效访问变量或函数的区域，包含`全局作用域`、`函数作用域`、`块级作用域（ES6）` 三种；
- `全局作用域`：在全局命名空间中声明的变量或函数位于全局作用域中，因此在代码中的任何地方都可以访问它们。
- `函数作用域`：在函数中声明的变量、函数和参数可以在函数内部访问，但不能在函数外部访问。
- `块级作用域`：在块`{}`中声明的变量（`let`，`const`）只能在其中访问。
- `作用域链`：作用域也是一组用于查找变量的规则。如果变量在当前作用域中不存在，它将向外部作用域中查找并搜索，如果该变量不存在，它将再次查找直到到达全局作用域，如果找到，则可以使用它，否则引发错误，这种查找过程也称为作用域链。

11. 闭包？

- `闭包`：就是一个函数在声明时能够记住当前作用域、父函数作用域、及父函数作用域上的变量和参数的`引用`，直至通过作用域链上全局作用域，基本上闭包是在声明函数时创建的作用域。

```javascript
// 下面是一个错误理解案例
var arrFuncs = [];
for (var i = 0; i < 5; i++) {
  arrFuncs.push(function () {
    // 闭包在创建变量时会保留该变量的引用而不是其值
    return i; // 这里的 i 一直都是i 循环后的改变值 5
  });
}
console.log(i); // 5

for (let i = 0; i < arrFuncs.length; i++) {
  // 这里的 i 因为 let 声明的缘故为依次都为 0 1 2 3 4
  console.log(i, arrFuncs[i]()); // 依次打印 0 5, 1 5, 2 5, 3 5, 4 5
}

// ----- 解决办法
// 1. 通过 IIFE，这里直接传值到 IIFE 闭包内部
for (var i = 0; i < 5; i++) {
  ~(function (i) {
    arrFuncs.push(function () {
      return i;
    });
  })(i);
}

// 2. let、const 块级作用域
for (let i = 0; i < 5; i++) {
  arrFuncs.push(function () {
    return i;
  });
}
```

12. 'use strict' 是干嘛用的？

- `use strict` 是 `ES5` 特性，它使我们的代码在函数或整个脚本中处于严格模式。严格模式帮助我们在代码的早期避免 `bug`，并为其添加限制。
  - 变量必须声明后再使用
  - 函数的参数不能有同名属性，否则报错
  - 不能使用 `with` 语句
  - 不能对只读属性赋值，否则报错
  - 不能使用前缀 `0` 表示八进制数，否则报错
  - 不能删除不可删除的属性，否则报错
  - 不能删除变量 `delete prop`，会报错，只能删除属性 `delete global[prop]`
  - `eval` 不能在它的外层作用域引入变量
  - `eval` 和 `arguments` 不能被重新赋值
  - `arguments` 不会自动反映函数参数的变化
  - 不能使用 [`arguments.callee`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/callee)
  - 不能使用 [`arguments.caller`(已废弃)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/caller)
  - 禁止 `this` 指向全局对象
  - 不能使用 `fn.caller` 和 `fn.arguments` 获取函数调用的堆栈
  - 增加了保留字（比如 `protected`、`static` 和 `interface`）

13. prototype？

- `prototype（原型）`：对象之间共享属性和功能的方法，这也是 JavaScript 实现继承的核心。
- 当对象中不存在属性时，它将查看其原型，如果仍然不存在，则将其查找到原型的原型，依此类推，直到在原型链中找到具有相同属性的属性为止。原型链的末尾是 `Object.prototype`

14. IIFE?

- `IIFE(立即调用的函数表达式)`：是在创建或声明后将被调用或执行的函数。

```javascript
// IIFE 的使用规则如下
(function(){
  ...
} ());

(function () {
  ...
})();

(function named(params) {
  ...
})();

(() => {

});

(function (global) {
  ...
})(window);

const utility = (function () {
  return {
    ...
  }
})
```

- `IIFE` 的一个主要作用是避免与全局作用域内的其他变量命名冲突或污染全局命名空间。
- `IIFE` 还可以用来解决一个常见的闭包引起的问题，如下
  - `闭包`只是函数记住其当前作用域，父函数作用域和全局作用域的变量引用的能力。

```javascript
var li = document.querySelectorAll(".list-group > li");
for (var i = 0, len = li.length; i < len; i++) {
  li[i].addEventListener("click", function (e) {
    // 这里的 i 其实是闭包保留了当前作用域下 i 的引用
    // 故每次点击的时候其实 i 已经是 循环调用之后的值了，即 li 所有元素的长度
    console.log(i);
  });
}

// 预想中点击 li 将打印该 li 所在的索引，其实不然
// 以上点击 li 打印的值总是 li 的总长度

// --------> IIFE 解决以上问题
var li = document.querySelectorAll(".list-group > li");
for (var i = 0, len = li.length; i < len; i++) {
  ~(function (idx) {
    // 这里 IIFE 每次创建了一个新的作用域，传递了当前 i 的值 为 idx
    li[idx].addEventListener("click", function (e) {
      console.log(idx);
    });
  })(i);
}
```

15. `Function.prototype.apply` 与 `Function.prototype.call` 的异同?

- `apply`：方法调用一个具有给定 `this` 值的函数，以及作为一个数组（或类似数组对象）提供的参数。
- `call`：方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。
- `call()`方法的作用和 `apply()` 方法类似，区别就是 `call()`方法接受的是参数列表，而 apply()方法接受的是一个参数数组。

```javascript
const person = {
  name: "Bob",
};

function greeting(greetingMessage) {
  return `${greetingMessage} ${this.name}`;
}

greeting.call(person, "Hello"); // "Hello Bob!"
greeting.apply(person, ["Hello"]); // "Hello Bob!"
```

16. 函数式编程(FP)?

- 函数式编程（FP）：通过编写纯函数，避免`共享状态`、`可变数据`、`副作用`来构建软件的过程。
- 函数式编程是`声明式`的而不是命令式 的，应用程序的状态是通过纯函数流动的。与面向对象编程形成对比，面向对象中应用程序的状态通常与对象中的方法共享和共处。
- JavaScript 支持`闭包`和`高阶函数`是函数式编程语言的特点。
- 高阶函数：只是将函数作为参数或返回值的函数。

```javascript
function hoc(param, callback) {
  return callback(param);
}
```

17. `arguments` ?

- `arguments` 对象是函数中传递的参数值的集合。它是一个类似数组的对象，因为它有一个 `length` 属性，我们可以使用数组索引表示法 `arguments[1]`来访问单个值，但它没有数组中的内置方法，如：`forEach`、`reduce`、`filter` 和 `map`。
- 使用`Array.prototype.slice`将 `arguments` 对象转换成一个数组

```javascript
function demo() {
  // 转换 arguments 为数组
  return Array.prototype.slice.call(arguments);
}
```

- `箭头函数`中没有 `arguments` 对象

18. 如何创建一个没有 `prototype(原型)`的对象？

- `Object.create` 方法可以创建没有原型的对象

```javascript
const o1 = {};
console.log(o1.toString()); // [object Object]

const o2 = Object.create(null);
console.log(o2.toString());
// throws an error o2.toString is not a function
```

19. 连 `=` 声明的理解？

- 赋值运算符是从右向左求值的

```javascript
function func() {
  var a = (b = 1);

  // 等同于
  var a = 1;
  b = 1; // b并未声明，故js引擎在全局创建了全局变量 b；
}

// ===> 故在js中尽量事先声明再去赋值，避免此类问题污染全局变量
function func() {
  var a, b;
  a = b = 1;
}
```

20. `var`、`let`、`const` 的区别？

- `var` 声明的变量会挂载到 `window`，而 `let`、`const`则不会;

```javascript
var a = 100;
console.log(a, window.a); // 100 100

let b = 10;
console.log(b, window.b); // 10 undefined

const c = 1;
console.log(c, window.c); // 1 undefined
```

- `var` 声明的变量存在变量提升，而 `let`、`const` 则不存在；

```javascript
console.log(a); // undefined  ===>  a已声明还没赋值，默认得到undefined值
var a = 100;

console.log(b); // 报错：b is not defined  ===> 找不到b这个变量
let b = 10;

console.log(c); // 报错：c is not defined  ===> 找不到c这个变量
const c = 10;
```

- `let`、`const`声明形成块作用域

```javascript
// let、var
if (1) {
  var a = 100;
  let b = 10;
}

console.log(a); // 100
console.log(b); // 报错：b is not defined  ===> 找不到b这个变量

// const、var
if (1) {
  var a = 100;
  const c = 1;
}
console.log(a); // 100
console.log(c); // 报错：c is not defined  ===> 找不到c这个变量
```

- 同一作用域下 `let` 和 `const` 不能声明同名变量，而 `var` 可以

```javascript
var a = 100;
console.log(a); // 100

var a = 10;
console.log(a); // 10
-------------------------------------
let a = 100;
let a = 10;

// Error: Identifier 'a' has already been declared
```

- 暂存死区

```javascript
var a = 100;

if (1) {
  a = 10;
  //在当前块作用域中存在a使用let/const声明的情况下，给a赋值10时，只会在当前作用域找变量a，
  // 而这时，还未到声明时候，所以控制台
  // Error:a is not defined
  let a = 1;
}
```

- `const`
  - 一旦声明必须赋值,不能使用 `null` 占位。
  - 声明后不能再修改
  - 如果声明的是复合类型数据，可以修改其属性

21. 箭头函数 `=>` ?

- `=>`：箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 `this`，`arguments`，`super` 或 `new.target`。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

```javascript
// 1. 我们只需要()括号，不需要 return 语句，因为如果我们只有一个表达式或值需要返回，箭头函数就会有一个隐式的返回。如果我们在一个箭头函数中有一个参数，则可以省略括号。
const func = (param) => param;
// 2. 箭头函数不能访问arguments对象。我们可以使用args参数来获得在箭头函数中传递的所有参数。
const func1 = (...args) => args;
const data = {
  result: 0,
  nums: [1, 2, 3, 4, 5],
  computeResult() {
    // 这里的“this”指的是“data”对象
    // 3. 箭头函数没有自己的this值。它捕获词法作用域函数的this值;
    // 4. 如果我们在全局作用域声明箭头函数，则this值为 window 对象。
    const addAll = () => {
      return this.nums.reduce((total, cur) => total + cur, 0);
    };
    this.result = addAll();
  },
};
```

22. 包装对象（wrapper object）？

- js 分为两大数据类型：基本类型和引用类型
  - 基本类型：`null`,`undefined`,`boolean`,`number`,`string`,`symbol`,`bigint`
  - 引用类型：其实就是对象，`Object`,`Array`,`Date`,`RegExp`,`File`等，引用类型有属性和方法；
  - 除`null`和`undefined`之外的每个基本类型都有自己包装对象。也就是：`string`，`number`，`boolean`，`symbol` 和 `bigInt`

```javascript
var name = "Bob"; // 基本方法

console.log(typeof name); // "string"

// 基本类型的值被临时转换或强制转换为对象
console.log(name.toUpperCase()); // "BOB"

// ====> 等同于
// 在完成访问属性或调用方法之后，新创建的对象将立即被丢弃。
console.log(new String(name).toUpperCase());
```

23. `NaN`?

- `NaN`表示“非数字”是 JS 中的一个值，该值是将数字转换或执行为非数字值的运算结果，因此结果为 `NaN`

```javascript
let a;

console.log(parseInt("abc")); // NaN
console.log(parseInt(null)); // NaN
console.log(parseInt(undefined)); // NaN
console.log(parseInt(++a)); // NaN
console.log(parseInt({} * 10)); // NaN
console.log(parseInt("abc" - 2)); // NaN
console.log(parseInt(0 / 0)); // NaN
console.log(parseInt("10a" * 10)); // NaN
```

- js 内置`isNaN` 监测非数值的时候，竟然都是 `true`，这是一个坑点，所以在 ES6 中建议使用 `Number.isNaN`

```javascript
console.log(isNaN()); // true
console.log(isNaN(undefined)); // true
console.log(isNaN({})); // true
console.log(isNaN(String("a"))); // true
console.log(isNaN(() => {})); // true
```

- `NaN`是唯一的值，也不等于自己

```javascript
function checkNaN(val) {
  return val !== val;
}
```

24. 数组检测？

- ES6 `Array.isArray`
- `Object.prototype.toString().call(value) === '[object Array]'`
- `value instanceof Array`

25. 如何在不使用`%`模运算符的情况下检查一个数字是否是偶数？

- `&` 位运算，进行二进制转换后运算

```javascript
function isEven(num) {
  return (num & 1) === 0;
}
```

- 递归

```javascript
function isEven(num) {
  if (num < 0 || num === 1) return false;
  if (num == 0) return true;
  return isEven(num - 2);
}
```

26. 检测对象中存在某个属性

- `prop in obj`：返回布尔值，指示指定的属性在指定的对象或其原型链中；
- `obj.hasOwnProperty(prop)`：返回布尔值，指示对象自身属性中是否具有指定的属性，因此这个方法会忽略掉那些从原型链上继承到的属性；
- `obj["prop"]`：读取属性值，存在则返回值，否则返回 `undefined`；

27. AJAX?

- `AJAX`：异步的 `JavaScript` 和 `XML`，是一种用于创建快速动态网页的技术，传统的网页（不使用 `AJAX`）如果需要更新内容，必需重载整个网页面。使用 `AJAX` 则不需要加载更新整个网页，实现部分内容更新

- AJAX 的应用：
  - `HTML` - 网页结构
  - `CSS` - 网页的样式
  - `JavaScript` - 操作网页的行为和更新 DOM
  - `XMLHttpRequest API` - 用于从服务器发送和获取数据
  - `PHP`，`Python`，`Nodejs` - 某些服务器端语言

28. js 中创建对象？

- `对象字面量`, `var a = {}`;
- `构造函数`, `function a(){} var o = new a()`;
- `Object.create`

29. `const`、`Object.seal` 和 `Object.freeze` 区别？

- `Object.seal`：方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。
- `Object.freeze`：方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。`freeze()` 返回和传入的参数相同的对象。
- `const`： 声明一个只读的变量，一旦声明，常量的值就不可改变；

30. `函数表达式`和`函数声明`之间有什么区别？

```javascript
a();
b();

function a() {
  console.log("函数表达式：我会被提升到顶部");
}

var b = function () {
  console.log("函数声明：我没有被提升");
};
```

31. `typeof null`?

- `typeof null === 'object'`：自 JS 诞生以来 null 的实现。曾经有人提出将`typeof null == 'object'`修改为`typeof null == 'null'`，但是被拒绝了，因为这将导致更多的`bug`。

32. `new` 做了什么?

- `new` 关键字与构造函数一起使用以创建对象，主要做了 4 件事:
  - 创建空对象 `{}`
  - 将空对象分配给 `this` 值
  - 将空对象的 `proto` 指向构造函数的 `prototype`
  - 如果没有使用显式 `return` 语句，则返回 `this`

33. 什么时候不使用箭头函数?

- 当想要函数被提升时(箭头函数是匿名的)
- 要在函数中使用 `this`/`arguments` 时，由于箭头函数本身不具有 `this`/`arguments`，因此它们取决于外部上下文
- 使用命名函数(箭头函数是匿名的)
- 使用函数作为构造函数时(箭头函数没有构造函数)
- 当想在对象字面是以将函数作为属性添加并在其中使用对象时，因为咱们无法访问 this 即对象本身。

