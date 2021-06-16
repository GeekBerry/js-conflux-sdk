const lodash = require('lodash');
const ContractMethod = require('./ContractMethod');
const { WORD_CHARS } = require('../../CONST');

class ContractConstructor extends ContractMethod {
  constructor(fragment, bytecode, contract, client) {
    super(lodash.defaults(fragment, { name: 'constructor', inputs: [] }), contract, client);

    this.signature = ''; // MUST be '' for `super.encodeData`
    this.bytecode = bytecode;
    this.decodeOutputs = hex => hex;
  }

  call(...args) {
    if (!this.bytecode) {
      throw new Error('bytecode is empty');
    }

    const transaction = super.call(...args);
    transaction.to = null;
    return transaction;
  }

  /**
   * Encode contract deploy data
   *
   * @param args {array}
   * @return {string}
   */
  encodeData(args) {
    return `${this.bytecode}${super.encodeData(args)}`;
  }

  /**
   * Reverse try to decode word by word
   *
   * @param hex {string} - Hex string
   * @return {array} NamedTuple
   */
  decodeData(hex) {
    let error = new Error('ContractConstructor.decodeData failed');
    for (let index = WORD_CHARS; index <= hex.length; index += WORD_CHARS) {
      try {
        return super.decodeData(hex.slice(-index));
      } catch (e) {
        error = e;
      }
    }
    throw error;
  }
}

module.exports = ContractConstructor;
