const { ConstructorCoder } = require('../abi');
const ContractMethod = require('./ContractMethod');

class ContractConstructor extends ContractMethod {
  constructor(cfx, contract, fragment) {
    super(cfx, contract, {});

    this.coder = new ConstructorCoder(fragment);
    this.name = 'constructor'; // example: "add"
    this.type = this.coder.type; // example: "add(uint,uint)"
    this.signature = this.coder.signature(); // example: "0xb8966352"
  }

  call(...args) {
    if (!this.bytecode) {
      throw new Error('contract.constructor.bytecode is empty');
    }

    const to = this.contract.address;
    const data = `${this.bytecode}${this.coder.encodeInputs(args).substring(2)}`;
    return new ContractMethod.Called(this.cfx, this.coder, { to, data });
  }

  decodeData(hex) {
    const data = hex.slice(this.bytecode.length);

    const namedTuple = this.coder.decodeInputs(data);
    return {
      name: this.name,
      fullName: this.coder.fullName,
      type: this.coder.type,
      signature: null,
      array: [...namedTuple],
      object: namedTuple.toObject(),
    };
  }
}

module.exports = ContractConstructor;
