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

// Promise.resolve(1).then((res) => console.log("then@", res));
// console.log(Promise.resolve(1) instanceof Promise);
