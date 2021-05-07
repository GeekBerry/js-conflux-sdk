const Transaction = require('../Transaction');

class Account {
  /**
   * @param address {string}
   */
  constructor(address) {
    this.address = address;
  }

  /**
   * @param options {object}
   * @return {Promise<Transaction>}
   */
  async signTransaction(options) {
    return new Transaction(options);
  }

  /**
   * @return {string} Address as string.
   */
  toString() {
    return this.address;
  }

  toJSON() {
    return this.address;
  }
}

module.exports = Account;
