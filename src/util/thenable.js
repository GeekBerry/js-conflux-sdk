const lodash = require('lodash');

function thenable(object, func) {
  if (!lodash.isFunction(func)) {
    throw new Error('except to be function');
  }

  const asyncFunc = async (...args) => func(...args);

  return new Proxy(object, {
    get(_, key, receiver) {
      switch (key) {
        case 'then':
          return (resolve, reject) => asyncFunc().then(resolve, reject);
        case 'catch':
          return reject => asyncFunc().catch(reject);
        case 'finally':
          return callback => asyncFunc().finally(callback);
        default:
          return Reflect.get(object, key, receiver);
      }
    },
  });
}

module.exports = thenable;
