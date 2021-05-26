const lodash = require('lodash');

function callable(object, func) {
  if (!lodash.isFunction(func)) {
    throw new Error('except to be function');
  }

  return new Proxy(func, {
    getPrototypeOf: () => Reflect.getPrototypeOf(object),
    // setPrototypeOf
    // isExtensible
    // preventExtensions
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(object, key),
    has: (_, key, receiver) => Reflect.has(object, key, receiver),
    get: (_, key, receiver) => Reflect.get(object, key, receiver),
    set: (_, key, value, receiver) => Reflect.set(object, key, value, receiver),
    deleteProperty: (_, key) => Reflect.deleteProperty(object, key),
    defineProperty: (_, key, attributes) => Reflect.defineProperty(object, key, attributes),
    enumerate: () => Reflect.enumerate(object),
    ownKeys: () => Reflect.ownKeys(object),
    // apply
    // construct
  });
}

module.exports = callable;
