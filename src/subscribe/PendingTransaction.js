const thenable = require('../util/thenable');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class PendingTransaction {
  constructor(client, func, args) {
    this.client = client;
    this.func = func;
    this.args = args;
    this.promise = undefined;

    return thenable(this, () => {
      this.promise = this.promise || this.func(...this.args);
      return this.promise;
    });
  }

  // --------------------------------------------------------------------------
  /**
   * Get transaction by hash.
   *
   * @param [options] {object}
   * @param [options.delay=0] {number} - Defer execute after `delay` ms.
   * @return {Promise<Object|null>} See [Ethereum.getTransactionByHash](#Ethereum.js/getTransactionByHash)
   */
  async get({ delay = 0 } = {}) {
    await sleep(delay);
    const transactionHash = await this;
    return this.client.getTransactionByHash(transactionHash);
  }

  /**
   * Async wait till transaction been mined.
   *
   * - blockHash !== null
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=60*1000] {number} - Loop timeout in ms.
   * @return {Promise<object>} See [Ethereum.getTransactionByHash](#Ethereum.js/getTransactionByHash)
   */
  async mined({ delta = 1000, timeout = 60 * 1000 } = {}) {
    const startTime = Date.now();

    const transactionHash = await this;
    for (let lastTime = startTime; lastTime < startTime + timeout; lastTime = Date.now()) {
      const transaction = await this.get();
      if (transaction && transaction.blockHash) {
        return transaction;
      }

      await sleep(lastTime + delta - Date.now());
    }

    throw new Error(`wait transaction "${transactionHash}" mined timeout after ${Date.now() - startTime} ms`);
  }

  /**
   * Async wait till transaction been executed.
   *
   * - mined
   * - receipt !== null
   * - receipt.outcomeStatus === 0
   *
   * @param [options] {object}
   * @param [options.delta=1000] {number} - Loop transaction interval in ms.
   * @param [options.timeout=5*60*1000] {number} - Loop timeout in ms.
   * @return {Promise<object>} See [Ethereum.getTransactionReceipt](#Ethereum.js/getTransactionReceipt)
   */
  async executed({ delta = 1000, timeout = 5 * 60 * 1000 } = {}) {
    const startTime = Date.now();

    const transactionHash = await this;
    for (let lastTime = startTime; lastTime < startTime + timeout; lastTime = Date.now()) {
      const receipt = await this.client.getTransactionReceipt(transactionHash);
      if (receipt) {
        if (receipt.status !== 1) { // 0: failure, 1: success
          throw new Error(`transaction "${transactionHash}" executed failed, status ${receipt.status}`);
        }
        return receipt;
      }

      await sleep(lastTime + delta - Date.now());
    }

    throw new Error(`wait transaction "${transactionHash}" executed timeout after ${Date.now() - startTime} ms`);
  }
}

module.exports = PendingTransaction;
