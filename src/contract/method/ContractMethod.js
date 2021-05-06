const callable = require('../../util/callable');
const MethodTransaction = require('./MethodTransaction');
const FunctionCoder = require('./FunctionCoder');

class ContractMethod extends FunctionCoder {
  constructor(fragment, contract, client) {
    super(fragment);
    this.contract = contract;
    this.client = client;

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const to = this.contract.address; // dynamic get `contract.address`
    const data = this.encodeData(args);
    return new MethodTransaction({ to, data }, this);
  }
}

module.exports = ContractMethod;
