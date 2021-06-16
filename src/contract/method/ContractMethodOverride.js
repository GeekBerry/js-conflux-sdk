const lodash = require('lodash');
const callable = require('../../util/callable');

class ContractMethodOverride {
  constructor(methods, contract, client) {
    this.methods = methods;
    this.contract = contract;
    this.client = client;
    this.name = lodash.first(methods).name;
    // XXX: assert all of event should have same name

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];

    let transaction;
    for (const method of this.methods) {
      try {
        transaction = method(...args);
        acceptArray.push(method.type);
      } catch (e) {
        rejectArray.push(method.type);
      }
    }

    if (!acceptArray.length) {
      throw new Error(`can not match override "${rejectArray.join('|')}" with args (${args.join(',')})`);
    }
    if (acceptArray.length > 1) {
      throw new Error(`can not determine override "${acceptArray.join('|')}" with args (${args.join(',')})`);
    }

    return transaction;
  }

  decodeData(hex) {
    const signatureToMethod = lodash.keyBy(this.methods, 'signature');

    const signature = hex.slice(0, 10); // '0x' + 8 hex
    const method = signatureToMethod[signature];
    return method.decodeData(hex);
  }
}

module.exports = ContractMethodOverride;
