function resolve(value) {
  var _this = this;

  // 状态不为 pending 则不执行，这里避免多次触发
  if (_this._status !== "pending") return;

  setTimeout(function () {
    _this._status = "fulfilled";
    _this._value = value;
    _this._onResolvedFns.forEach(function (cb) {
      cb && cb();
    });
  });
}

function reject(error) {
  var _this = this;

  // 状态不为 pending 则不执行，这里避免多次触发
  if (_this._status !== "pending") return;

  setTimeout(function () {
    _this._status = "rejected";
    _this._error = error;
    _this._onRejectedFns.forEach(function (cb) {
      cb && cb();
    });
  });
}

function isFunction(func) {
  return typeof func === "function";
}

function isObject(func) {
  return typeof func === "object";
}

/**
 * 解析 promise
 *  若回调为 promise 实例，则继续流式解析
 *
 * @param {*} promise
 * @param {*} result 回调结果
 * @param {*} resolve
 * @param {*} reject
 */
function resolvePromise(promise, result, resolve, reject) {
  // 循环引用检测
  if (promise === result) return reject(new TypeError("循环引用"));

  if (result instanceof Promise) {
    result.then(function (newResult) {
      resolvePromise(promise, newResult, resolve, reject);
    }, reject);
  } else if (isObject(result) || isFunction(result)) {
    if (result === null) return resolve(result);

    var then;

    try {
      then = result.then;
    } catch (error) {
      return reject(error);
    }

    if (!isFunction(then)) return resolve(result);

    var called = false; // 调用锁

    try {
      var _thenLock = function (cb) {
        // 防止再次调用
        if (called) return;
        called = true; // 标记锁
        cb && cb();
      };

      // then 流式调用
      then.call(
        result,
        function (nextResult) {
          _thenLock(function () {
            resolvePromise(promise, nextResult, resolve, reject);
          });
        },
        function (r) {
          //只要失败了就失败了
          _thenLock(function () {
            reject(r);
          });
        }
      );
    } catch (e) {
      _thenLock(function () {
        reject(e);
      });
    }
  } else {
    resolve(result);
  }
}

function Promise(fn) {
  if (!isObject(this)) {
    throw new TypeError("Promise 必须是 new 实例化的对象");
  }
  if (!isFunction(fn)) {
    throw new TypeError("Promise 构造函数入参必须是函数");
  }

  // 状态 pending/fulfilled/rejected
  this._status = "pending"; // 默认 pending
  this._value = null; // 值
  this._error = null; // 异常

  // 成功的回调
  this._onResolvedFns = [];
  // 失败的回调
  this._onRejectedFns = [];

  try {
    // 绑定当前上下文
    fn(resolve.bind(this), reject.bind(this));
  } catch (e) {
    reject(e);
  }
}

// 原型方法 then, 返回新的promise形成链式调用
Promise.prototype.then = function (onResolved, onRejected) {
  // then 接收两个函数，若果不是函数则直接造成值穿透，即上一个 then 的值继续向下走
  onResolved = isFunction(onResolved)
    ? onResolved
    : function (y) {
        return y;
      };
  onRejected = isFunction(onRejected)
    ? onRejected
    : function (err) {
        throw err;
      };

  var _this = this;

  var promise = new Promise(function (resolve, reject) {
    if (_this._status === "pending") {
      // pending 状态
      // 存放成功回调
      _this._onResolvedFns.push(function () {
        setTimeout(function () {
          try {
            resolvePromise(promise, onResolved(_this._value), resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      // 存放失败的回调
      _this._onRejectedFns.push(function () {
        setTimeout(function () {
          try {
            resolvePromise(promise, onRejected(_this._error), resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    } else {
      setTimeout(function () {
        try {
          // fulfilled / rejected 状态 解析回调
          resolvePromise(
            promise,
            _this._status === "fulfilled"
              ? onResolved(_this._value)
              : onRejected(_this._error),
            resolve,
            reject
          );
        } catch (error) {
          reject(error);
        }
      });
    }
  });

  return promise;
};

// 原型方法 catch, 抛出异常
Promise.prototype.catch = function (onError) {
  // catch 方法就是then方法没有成功的简写
  return this.then(null, onError);
};

// 原型方法 promise 正常或者异常之后的最后一次处理
Promise.prototype.finally = function (onFinally) {
  var _finally = Promise.resolve(onFinally());

  return this.then(
    function (value) {
      return _finally.then(function () {
        return value;
      });
    },
    function (error) {
      return _finally.then(function () {
        throw error;
      });
    }
  );
};

// 中断抛出结果集
Promise.resolve = function (value) {
  return new Promise(function (resolve) {
    resolve(value);
  });
};

// 中断抛出异常
Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason);
  });
};

// 返回多个promise集合请求中最快返回的结果
Promise.race = function (iterable) {
  return new Promise(function (resolve, reject) {
    // 浅拷贝
    var array = Array.prototype.slice.call(iterable);
    for (var i = 0; i < array.length; i++) {
      Promise.resolve(array[i]).then(resolve, reject);
    }
  });
};

// 返回多个promise集合所有不论正常或者异常的结果集
Promise.allSettled = function (iterable) {
  return new Promise(function (resolve, reject) {
    var array = Array.prototype.slice.call(iterable);
    if (!array.length) return resolve([]);

    var results = [];
    var count = 0;

    for (var i = 0; i < array.length; i++) {
      (function (i) {
        Promise.resolve(array[i]).finally(function (value) {
          results[i] = res;
          count++;

          if (count === array.length) {
            resolve(results);
          }
        });
      })(i);
    }
  });
};

// 返回多个promise集合所有正常的结果集，有错误则中断返回该错误结果
Promise.all = function (iterable) {
  return new Promise(function (resolve, reject) {
    var array = Array.prototype.slice.call(iterable);
    if (!array.length) return resolve([]);

    var results = [];
    var count = 0;

    for (var i = 0; i < array.length; i++) {
      (function (i) {
        Promise.resolve(array[i])
          .then(function (res) {
            results[i] = res;
            count++;

            if (count === array.length) {
              resolve(results);
            }
          })
          .catch(function (error) {
            reject(error);
          });
      })(i);
    }
  });
};

module.exports = Promise;
