/**
 * Make a NamedTuple Class
 *
 * @param names {string[]}
 * @return {NamedTuple}
 *
 * @example
 * > Student = namedTuple('name', 'age')
 * > student = new Student('Tom', 18)
 * > Array.isArray(student)
 true
 * > student
 NamedTuple(name,age) [ 'Tom', 18 ]
 * > student.toObject()
 { name: 'Tom', age: 18 }
 * > student.name
 "Tom"
 * > student.age
 18
 * > student.age = 19
 Error: can not change element to a NamedTuple
 */
function namedTuple(...names) {
  const _nameToIndex = {};
  names.forEach((name, index) => {
    _nameToIndex[name] = index;
  });

  class NamedTuple extends Array {
    static get name() {
      return `NamedTuple(${names.join(',')})`;
    }

    static fromObject(object) {
      return new this(...names.map(name => object[name]));
    }

    constructor(...args) {
      super(args.length);
      args.forEach((v, i) => Reflect.set(this, i, v)); // XXX: new Array(0) === []

      return new Proxy(this, {
        has(self, key) {
          const index = _nameToIndex[key];
          return index !== undefined ? true : (key in self);
        },
        get(self, key) {
          const index = _nameToIndex[key];
          return index === undefined ? self[key] : self[index];
        },
        set(self, key) {
          throw new Error(`can not change element to a NamedTuple, key "${key}"`);
        },
        deleteProperty: () => {
          throw new Error('can not delete element to a NamedTuple');
        },
      });
    }

    // XXX: use Symbol.iterator to allowed field named 'length'
    * [Symbol.iterator]() {
      for (let index = 0; index < names.length; index += 1) {
        yield this[index];
      }
    }

    toObject() {
      const obj = {};
      names.forEach(name => {
        obj[name] = this[name];
      });
      return obj;
    }
  }

  return NamedTuple;
}

module.exports = namedTuple;
