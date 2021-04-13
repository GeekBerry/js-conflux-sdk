const JSBI = require('./util/jsbi');

JSBI.prototype.toJSON = function () {
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  return this.toString();
};

const WORD_BYTES = 32; // byte number pre abi word
const WORD_CHARS = WORD_BYTES * 2;
const UINT_BOUND = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(WORD_BYTES * 8)); // 2**256
const MAX_UINT = JSBI.subtract(UINT_BOUND, JSBI.BigInt(1)); // 2**256-1

/**
 * blockNumber label
 *
 * - `LATEST` 'latest': latest block.
 * - `PENDING` 'pending': TODO
 * - `EARLIEST` 'earliest': earliest epoch number, same as 0.
 */
const BLOCK_NUMBER = {
  LATEST: 'latest',
  PENDING: 'pending',
  EARLIEST: 'earliest',
};

const NET_VERSION = {
  1: 'Mainnet',
  2: 'Morden',
  3: 'Ropsten',
  4: 'Rinkeby',
  42: 'Kovan',
};

/**
 * min gas price for transaction
 *
 * @type {number}
 * @example
 * > CONST.MIN_GAS_PRICE
 1
 */
const MIN_GAS_PRICE = 1;

/**
 * gas use for pure transfer transaction
 *
 * @type {number}
 * @example
 * > CONST.TRANSACTION_GAS
 21000
 */
const TRANSACTION_GAS = 21000;

module.exports = {
  WORD_BYTES,
  WORD_CHARS,
  UINT_BOUND,
  MAX_UINT,

  NET_VERSION,
  BLOCK_NUMBER,
  MIN_GAS_PRICE,
  TRANSACTION_GAS,
};
