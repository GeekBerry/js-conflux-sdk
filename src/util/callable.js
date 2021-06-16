const lodash = require('lodash');

function callable(object, func) {
  if (!lodash.isFunction(func)) {
    throw new Error('except to be function');
  }

  return new Proxy(func, {
    getPrototypeOf: (_, ...args) => Reflect.getPrototypeOf(object, ...args),
    setPrototypeOf: (_, ...args) => Reflect.setPrototypeOf(object, ...args),
    isExtensible: (_, ...args) => Reflect.isExtensible(object, ...args),
    preventExtensions: (_, ...args) => Reflect.preventExtensions(object, ...args),
    getOwnPropertyDescriptor: (_, ...args) => Reflect.getOwnPropertyDescriptor(object, ...args),
    has: (_, ...args) => Reflect.has(object, ...args),
    get: (_, ...args) => Reflect.get(object, ...args),
    set: (_, ...args) => Reflect.set(object, ...args),
    deleteProperty: (_, ...args) => Reflect.deleteProperty(object, ...args),
    defineProperty: (_, ...args) => Reflect.defineProperty(object, ...args),
    ownKeys: (_, ...args) => Reflect.ownKeys(object, ...args),
    // apply: (_, ...args) => Reflect.apply(object, ...args),
    // construct: (_, ...args) => Reflect.construct(object, ...args),
  });
}

module.exports = callable;
