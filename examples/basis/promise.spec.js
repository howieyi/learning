var Promise = require("./promise");

Promise.deferred = function () {
  var result = {};
  result.promise = new Promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = Promise;

// Promise.resolve(undefined).then((res) => undefined).then(res => console.log(res));
// console.log(Promise.resolve(1) instanceof Promise);
