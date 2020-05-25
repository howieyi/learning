function Promise(fn) {
    
}

// 中断抛出结果集
Promise.resolve = function (value) {};
// 中断抛出异常
Promise.reject = function (reason) {};
// 返回多个promise集合请求中最快返回的结果
Promise.race = function (iterable) {};
// 返回多个promise集合所有不论正常或者异常的结果集
Promise.allSettled = function (iterable) {};
// 返回多个promise集合所有正常的结果集，有错误则中断返回该错误结果
Promise.all = function (iterable) {};

// 原型方法 then, 返回新的promise形成链式调用
Promise.prototype.then = function (onResolved, onRejected) {};
// 原型方法 catch, 抛出异常
Promise.prototype.catch = function (onError) {};
// 原型方法 promise 正常或者异常之后的最后一次处理
Promise.prototype.finally = function (onFinally) {};
