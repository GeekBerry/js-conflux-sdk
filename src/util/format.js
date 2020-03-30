const lodash = require('lodash');
const parser = require('../lib/parser');

function isBigInt(value) {
  return lodash.get(value, 'constructor') === BigInt;
}

// ----------------------------------------------------------------------------
function toHex(value) {
  let hex;

  if (lodash.isString(value)) {
    hex = value.toLowerCase(); // XXX: lower case for support checksum address
  } else if (Number.isInteger(value) || isBigInt(value)) {
    hex = `0x${value.toString(16)}`;
  } else if (Buffer.isBuffer(value)) {
    hex = `0x${value.toString('hex')}`;
  } else if (lodash.isBoolean(value)) {
    hex = value ? '0x01' : '0x00';
  } else if (value === null) {
    hex = '0x';
  } else {
    hex = `${value}`;
  }

  if (!/^0x[0-9a-f]*$/.test(hex)) {
    throw new Error(`${value} not match hex`);
  }
  return hex.length % 2 ? `0x0${hex.slice(2)}` : hex;
}

function toNumber(value) {
  if (value === null) {
    throw new Error(`${value} not match number`);
  } else if (Buffer.isBuffer(value)) {
    value = `0x${value.toString('hex')}`;
  }
  return Number(value);
}

function toBigInt(value) {
  if (Buffer.isBuffer(value)) {
    value = `0x${value.toString('hex')}`;
  }
  return BigInt(value);
}

// ----------------------------------------------------------------------------
const format = {};

/**
 * @param arg {any}
 * @return {any} arg
 *
 * @example
 * > format.any(1)
 1
 */
format.any = parser(v => v);

/**
 * When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
 *
 * @param arg {number|BigInt|string|Buffer|boolean|null}
 * @return {string} Hex string
 *
 * @example
 * > format.hex(null)
 '0x'
 * > format.hex(1)
 "0x01"
 * > format.hex(256)
 "0x0100"
 * > format.hex(true)
 "0x01"
 * > format.hex(Buffer.from([1,10,255]))
 "0x010aff"
 * > format.hex("0x0a")
 "0x0a"
 */
format.hex = parser(toHex);
format.hex64 = format.hex.$validate(v => v.length === 2 + 64, 'hex64');

/**
 * @param arg {number|BigInt|string|boolean}
 * @return {Number}
 *
 * @example
 * > format.uInt(-3.14)
 Error("cannot be converted to a BigInt")
 * > format.uInt(null)
 Error("Cannot convert null to a BigInt")
 * > format.uInt('0')
 0
 * > format.uInt(1)
 1
 * > format.uInt(BigInt(100))
 100
 * > format.uInt('0x10')
 16
 * > format.uInt('')
 0
 * > format.uInt(true)
 1
 * > format.uInt(false)
 0
 * > format.uInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
 */
format.uInt = parser(toNumber).$validate(v => Number.isSafeInteger(v) && v >= 0, 'uint');

/**
 * @param arg {number|BigInt|string|boolean}
 * @return {BigInt}
 *
 * @example
 * > format.uInt(-3.14)
 Error("not match uint")
 * > format.uInt('0')
 0n
 * > format.uInt(1)
 1n
 * > format.uInt(BigInt(100))
 100n
 * > format.uInt('0x10')
 16n
 * > format.uInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
 */
format.bigUInt = parser(toBigInt).$validate(v => v >= BigInt(0), 'bigUInt');

/**
 * When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")
 *
 * @param arg {number|string|boolean}
 * @return {string} Hex string
 *
 * @example
 * > format.numberHex(100)
 "0x64"
 * > format.numberHex(10)
 "0xa"
 * > format.numberHex(3.50)
 "0x4"
 * > format.numberHex(3.49)
 "0x3"
 * > format.numberHex(-1))
 Error("not match uintHex")
 */
format.numberHex = format.bigUInt
  .$parse(v => `0x${v.toString(16)}`)
  .$validate(v => /^0x[0-9a-f]+$/.test(v), 'uintHex');

/**
 * @param arg {number|string} - number or string in ['latest_state', 'latest_mined']
 * @return {string}
 *
 * @example
 * > format.epochNumber(10)
 "0xa"
 * > format.epochNumber('latest_state')
 "latest_state"
 * > format.epochNumber('latest_mined')
 "latest_state"
 */
format.epochNumber = format.numberHex.$or('latest_state').$or('latest_mined');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
 * > format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
 */
format.address = format.hex.$validate(v => v.length === 2 + 40, 'address'); // alias

/**
 * Account address starts with '0x1'
 *
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.accountAddress('0x0123456789012345678901234567890123456789')
 "0x1123456789012345678901234567890123456789"
 */
format.accountAddress = format.address.$parse(v => v.replace(/^0x[0-9a-f]/, () => '0x1'));

/**
 * Contract address starts with '0x8'
 *
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.contractAddress('0x0123456789012345678901234567890123456789')
 "0x8123456789012345678901234567890123456789"
 */
format.contractAddress = format.address.$parse(v => v.replace(/^0x[0-9a-f]/, () => '0x8'));

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
 */
format.publicKey = format.hex.$validate(v => v.length === 2 + 128, 'publicKey');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.privateKey = format.hex64; // alias

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 */
format.signature = format.hex.$validate(v => v.length === 2 + 130, 'signature');

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.blockHash = format.hex64; // alias

/**
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
 */
format.txHash = format.hex64; // alias

/**
 * @param arg {number|BigInt|string|Buffer|boolean|null}
 * @return {Buffer}
 *
 * @example
 * > format.buffer(Buffer.from([0, 1]))
 <Buffer 00 01>
 * > format.buffer(null)
 <Buffer >
 * > format.buffer(1024)
 <Buffer 04 00>
 * > format.buffer('0x0a')
 <Buffer 0a>
 * > format.buffer(true)
 <Buffer 01>
 * > format.buffer(3.14)
 Error("not match hex")
 */
format.buffer = parser(v => (Buffer.isBuffer(v) ? v : Buffer.from(format.hex(v).substring(2), 'hex')));

/**
 * @param arg {boolean}
 * @return {boolean}
 *
 * @example
 * > format.boolean(true)
 true
 * > format.boolean(false)
 false
 */
format.boolean = format.any.$validate(lodash.isBoolean, 'boolean');

// ----------------------------- parse rpc returned ---------------------------
format.account = parser({
  nonce: format.uInt,
  balance: format.bigUInt,
  bankBalance: format.bigUInt,
  bankAr: format.bigUInt,
  storageBalance: format.bigUInt,
});

format.transaction = parser({
  nonce: format.uInt,
  value: format.bigUInt,
  gasPrice: format.bigUInt,
  gas: format.bigUInt,
  v: format.uInt,
  transactionIndex: format.uInt.$or(null),
  status: format.uInt.$or(null), // XXX: might be remove in rpc returned
});

format.estimate = parser({
  gasUsed: format.bigUInt,
  storageOccupied: format.bigUInt,
});

format.block = parser({
  epochNumber: format.uInt.$or(null), // null for getBlockByEpochNumber(0)
  height: format.uInt,
  size: format.uInt,
  timestamp: format.uInt,
  gasLimit: format.bigUInt,
  difficulty: format.bigUInt,
  transactions: [(format.transaction).$or(format.txHash)],
});

format.receipt = parser({
  index: format.uInt, // XXX: number already in rpc return
  epochNumber: format.uInt, // XXX: number already in rpc return
  outcomeStatus: format.uInt.$or(null), // XXX: number already in rpc return
  gasUsed: format.bigUInt,
});

format.logs = parser([
  {
    epochNumber: format.uInt,
    logIndex: format.uInt,
    transactionIndex: format.uInt,
    transactionLogIndex: format.uInt,
  },
]);

// -------------------------- format method arguments -------------------------
format.getLogs = parser({
  limit: format.numberHex.$or(undefined),
  fromEpoch: format.epochNumber.$or(undefined),
  toEpoch: format.epochNumber.$or(undefined),
  blockHashes: format.blockHash.$or([format.blockHash]).$or(undefined),
  address: format.address.$or([format.address]).$or(undefined),
  topics: parser([format.hex64.$or([format.hex64]).$or(null)]).$or(undefined),
});

// FIXME: accept null ?
format.signTx = parser({
  nonce: format.uInt.$parse(format.buffer),
  gasPrice: format.bigUInt.$parse(format.buffer),
  gas: format.bigUInt.$parse(format.buffer),
  to: parser(format.address.$or(null).$default(null)).$parse(format.buffer),
  value: format.bigUInt.$default(0).$parse(format.buffer),
  storageLimit: format.numberHex.$parse(format.buffer),
  epochHeight: format.uInt.$parse(format.buffer),
  chainId: format.uInt.$default(0).$parse(format.buffer),
  data: format.hex.$default('0x').$parse(format.buffer),
  r: format.numberHex.$parse(format.buffer).$or(undefined),
  s: format.numberHex.$parse(format.buffer).$or(undefined),
  v: format.uInt.$parse(format.buffer).$or(undefined),
});

format.sendTx = parser({
  from: format.address,
  nonce: format.numberHex,
  gasPrice: format.numberHex,
  gas: format.numberHex,
  to: format.address.$or(null).$or(undefined),
  value: format.numberHex.$or(undefined),
  storageLimit: format.numberHex,
  epochHeight: format.uInt,
  chainId: format.uInt.$default(0),
  data: format.hex.$or(undefined),
});

format.callTx = parser({
  from: format.address.$or(undefined),
  nonce: format.numberHex.$or(undefined),
  gasPrice: format.numberHex.$or(undefined),
  gas: format.numberHex.$or(undefined),
  to: format.address.$or(null),
  value: format.numberHex.$or(undefined),
  storageLimit: format.numberHex.$or(undefined),
  epochHeight: format.uInt.$or(undefined),
  chainId: format.uInt.$or(undefined),
  data: format.hex.$or(undefined),
});

format.estimateTx = parser({
  from: format.address.$or(undefined),
  nonce: format.numberHex.$or(undefined),
  gasPrice: format.numberHex.$or(undefined),
  gas: format.numberHex.$or(undefined),
  to: format.address.$or(null).$or(undefined),
  value: format.numberHex.$or(undefined),
  storageLimit: format.numberHex.$or(undefined),
  epochHeight: format.uInt.$or(undefined),
  chainId: format.uInt.$or(undefined),
  data: format.hex.$or(undefined),
});

module.exports = format;
