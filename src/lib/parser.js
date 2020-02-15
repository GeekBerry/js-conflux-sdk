const lodash = require('lodash');
const callable = require('./callable');

// ============================================================================
class ParserError extends Error {
  constructor() {
    super();
    this.msg = '';
    this.path = [];
    this.origin = undefined;
  }

  set(error, key, origin) {
    if (error instanceof ParserError) { // include ParserError
      this.msg = error.msg;
      this.path = error.path;
    } else if (error instanceof Error) {
      this.msg = error.message;
    } else {
      this.msg = `${error}`;
    }

    if (key !== undefined) {
      this.path.unshift(key);
    }

    this.origin = origin;
    return this;
  }

  get message() {
    return JSON.stringify({
      msg: this.msg,
      path: this.path.join(''),
      origin: this.origin,
    });
  }
}

// ----------------------------------------------------------------------------
function compile(schema) {
  if (Array.isArray(schema)) {
    return compileArray(schema);
  } else if (lodash.isPlainObject(schema)) {
    return compileObject(schema);
  } else if (!lodash.isFunction(schema)) {
    return compileValue(schema);
  } else {
    return schema;
  }
}

function compileArray(schema) {
  const func = schema.length ? compile(schema[0]) : v => v;

  return array => {
    if (!Array.isArray(array)) {
      throw new Error(`expected array, got ${typeof array}`);
    }

    const error = new ParserError(); // create Error here for shallow stack
    return array.map((v, i) => {
      try {
        return func(v);
      } catch (e) {
        throw error.set(e, `[${i}]`, array);
      }
    });
  };
}

function compileObject(schema) {
  const keyToFunc = lodash.mapValues(schema, compile);

  return object => {
    if (!lodash.isObject(object)) {
      throw new Error(`expected plain object, got ${typeof object}`);
    }

    const error = new ParserError(); // create Error here for shallow stack
    const picked = lodash.mapValues(keyToFunc, (func, key) => {
      try {
        return func(object[key]);
      } catch (e) {
        throw error.set(e, `.${key}`, object);
      }
    });

    return lodash.defaults(picked, object);
  };
}

function compileValue(schema) {
  return value => {
    if (value !== schema) {
      throw new Error(`${value} !== ${schema}`);
    }
    return value;
  };
}

// ============================================================================
class Parser {
  constructor({
    andList = [],
    orList = [],
    defaultValue,
  } = {}) {
    this.andList = andList;
    this.orList = orList;
    this.defaultValue = defaultValue;
    return callable(this, this.call.bind(this));
  }

  call(value) {
    if (value === undefined) {
      value = this.defaultValue;
    }

    try {
      let result = value;

      this.andList.forEach(({ type, func, name }) => {
        switch (type) {
          case 'parse':
            result = func(result);
            break;

          case 'validate':
            if (!func(result)) {
              throw new Error(`${value} not match ${name}`);
            }
            break;

          default:
            throw new Error(`unknown type "${type}"`);
        }
      });

      return result;
    } catch (error) {
      if (this.orList.length) {
        const errorArray = [error instanceof ParserError ? error.msg : error.message];
        for (const func of this.orList) {
          try {
            return func(value);
          } catch (e) {
            errorArray.push(e instanceof ParserError ? e.msg : e.message);
          }
        }
        throw new Error(errorArray.map(e => `(${e})`).join(' && '));
      }

      throw error;
    }
  }

  /**
   * @param defaultValue {*}
   * @return {function} Parser
   */
  $default(defaultValue) {
    return new Parser({
      ...this,
      defaultValue,
    });
  }

  /**
   * @param func {function}
   * @param [name=func.name] {string}
   * @return {function} Parser
   */
  $parse(func, name = func.name) {
    return new Parser({
      ...this,
      andList: [...this.andList, { type: 'parse', func, name }],
    });
  }

  /**
   * @param func {function}
   * @param [name=func.name] {string}
   * @return {function} Parser
   */
  $validate(func, name = func.name) {
    return new Parser({
      ...this,
      andList: [...this.andList, { type: 'validate', func, name }],
    });
  }

  /**
   * @param schema {*}
   * @return {function} Parser
   */
  $or(schema) {
    return new Parser({
      ...this,
      orList: [...this.orList, compile(schema)],
    });
  }
}

/**
 * @param schema {*}
 * @return {function}
 */
function parser(schema = v => v) {
  return (new Parser()).$parse(compile(schema));
}

module.exports = parser;
