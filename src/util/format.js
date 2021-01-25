const Big = require('big.js');
const lodash = require('lodash');
const CONST = require('../CONST');
const JSBI = require('./jsbi');
const parser = require('./parser');
const sign = require('./sign');

// ----------------------------------------------------------------------------
function toHex(value) {
  let hex;

  if (lodash.isString(value)) {
    hex = value.toLowerCase(); // XXX: lower case for support checksum address
  } else if (Number.isInteger(value) || (typeof value === 'bigint') || (value instanceof JSBI)) {
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
    throw new Error(`${value} not match "hex"`);
  }
  return hex.length % 2 ? `0x0${hex.slice(2)}` : hex;
}

function toNumber(value) {
  if (value === null) {
    throw new Error(`${value} not match "number"`);
  } else if (Buffer.isBuffer(value)) {
    value = `0x${value.toString('hex')}`;
  }
  return Number(value);
}

function toBigInt(value) {
  if (Number.isInteger(value) || (typeof value === 'bigint') || (value instanceof JSBI)) {
    return JSBI.BigInt(value);
  }
  if (lodash.isBoolean(value)) {
    throw new Error(`${value} not match "BigInt"`);
  }
  if (Buffer.isBuffer(value)) {
    throw new Error(`${value} not match "BigInt"`);
  }

  value = `${value}`.replace(/^(-?\d+)(.0+)?$/, '$1'); // replace "number.000" to "number"
  return JSBI.BigInt(value);
}

function toBig(value) {
  if (/^0[xob]/i.test(value)) {
    value = JSBI.BigInt(value);
  }
  return new Big(value);
}

// ----------------------------------------------------------------------------
const format = new Proxy(() => undefined, {
  apply(target, thisArg, argArray) {
    return parser(...argArray);
  },
});

/**
 * @param arg {any}
 * @return {any} arg
 *
 * @example
 * > format.any(1)
 1
 */
format.any = format(v => v);

/**
 * @param arg {number|BigInt|string|boolean}
 * @return {Number}
 *
 * @example
 * > format.uInt(-3.14)
 Error("not match uint")
 * > format.uInt(null)
 Error("not match number")
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
format.uInt = format(toNumber).$validate(v => Number.isSafeInteger(v) && v >= 0, 'uint');

/**
 * @param arg {number|string|BigInt}
 * @return {BigInt}
 *
 * @example
 * > format.bigInt(-3.14)
 Error("Cannot convert -3.14 to a BigInt")
 * > format.bigInt('0.0')
 0n
 * > format.bigInt('-1')
 -1n
 * > format.bigInt(1)
 1n
 * > format.bigInt(BigInt(100))
 100n
 * > format.bigInt('0x10')
 16n
 * > format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 9007199254740992n
 */
format.bigInt = format(toBigInt);

/**
 * @param arg {number|string|BigInt}
 * @return {BigInt}
 *
 * @example
 * > format.bigUInt('0.0')
 0n
 * > format.bigUInt('-1')
 Error("not match bigUInt")
 */
format.bigUInt = format.bigInt.$validate(v => v >= 0, 'bigUInt');

/**
 * When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")
 *
 * @param arg {number|string|BigInt}
 * @return {string} Hex string
 *
 * @example
 * > format.bigUIntHex(100)
 "0x64"
 * > format.bigUIntHex('0x0a')
 "0xa"
 * > format.bigUIntHex(-1))
 Error("not match uintHex")
 */
format.bigUIntHex = format.bigUInt.$after(v => `0x${v.toString(16)}`);

/**
 * @param arg {number|string|BigInt}
 * @return {Big} Big instance
 *
 * @example
 * > format.big('0b10').toString()
 '2'
 * > format.big('0O10').toString()
 '8'
 * > format.big('010').toString()
 '10'
 * > format.big('0x10').toString()
 '16'
 * > format.big(3.14).toString()
 '3.14'
 * > format.big('-03.140').toString()
 '-3.14'
 * > format.big(null)
 Error('Invalid number')
 */
format.big = format(toBig);

/**
 * @param arg {string|number|BigInt|Big}
 * @return {Number}
 *
 * @example
 * > format.fixed64('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
 * > format.fixed64('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 0.5
 */
format.fixed64 = format.big.$after(v => Number(v.div(CONST.MAX_UINT)));

/**
 * @param arg {number|string} - number or label, See [EPOCH_NUMBER](#CONST.js/EPOCH_NUMBER)
 * @return {string}
 *
 * @example
 * > format.epochNumber(10)
 "0xa"
 * > format.epochNumber(EPOCH_NUMBER.LATEST_STATE)
 "latest_state"
 * > format.epochNumber('latest_mined')
 "latest_mined"
 */
format.epochNumber = format.bigUIntHex
  .$or(CONST.EPOCH_NUMBER.LATEST_MINED)
  .$or(CONST.EPOCH_NUMBER.LATEST_STATE)
  .$or(CONST.EPOCH_NUMBER.LATEST_CONFIRMED)
  .$or(CONST.EPOCH_NUMBER.LATEST_CHECKPOINT)
  .$or(CONST.EPOCH_NUMBER.EARLIEST);

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
format.hex = format(toHex);

format.hex40 = format.hex.$validate(v => v.length === 2 + 40, 'hex40');

/**
 * Checks if a given string is a valid address.
 * It will also check the checksum, if the address has upper and lowercase letters.
 *
 * @param arg {string|Buffer}
 * @return {string} Hex string
 *
 * @example
 * > format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
 */
format.address = format.hex40; // alias

format.hex64 = format.hex.$validate(v => v.length === 2 + 64, 'hex64');

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
format.transactionHash = format.hex64; // alias

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
 *
 * @example
 * > format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 * > format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
 */
format.publicKey = format.hex.$validate(v => v.length === 2 + 128, 'publicKey');

/**
 * @param arg {number|string|BigInt|Buffer|boolean|null}
 * @return {Buffer}
 *
 * @example
 * > format.hexBuffer(Buffer.from([0, 1]))
 <Buffer 00 01>
 * > format.hexBuffer(null)
 <Buffer >
 * > format.hexBuffer(1024)
 <Buffer 04 00>
 * > format.hexBuffer('0x0a')
 <Buffer 0a>
 * > format.hexBuffer(true)
 <Buffer 01>
 * > format.hexBuffer(3.14)
 Error("not match hex")
 */
format.hexBuffer = format.hex.$after(v => Buffer.from(v.substr(2), 'hex'));

/**
 * @param arg {string|Buffer|array}
 * @return {Buffer}
 *
 * @example
 * > format.bytes('abcd')
 <Buffer 61 62 63 64>
 * > format.bytes([0, 1])
 <Buffer 00 01>
 * > format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
 */
format.bytes = format(v => (Buffer.isBuffer(v) ? v : Buffer.from(v)));

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

/**
 * Compute the keccak256 cryptographic hash of a value, returned as a hex string.
 *
 * @param arg {string|Buffer}
 * @return {string}
 *
 * @example
 * > format.keccak256('Transfer(address,address,uint256)')
 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

 * > format.keccak256(Buffer.from([0x42]))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
 * > format.keccak256(format.hexBuffer('0x42'))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
 * > format.keccak256('0x42') // "0x42" as string and transfer to <Buffer 30 78 34 32> by ascii
 "0x3c1b2d38851281e9a7b59d10973b0c87c340ff1e76bde7d06bf6b9f28df2b8c0"
 */
format.keccak256 = format.bytes.$after(sign.keccak256).$after(format.hex);

// -------------------------- format method arguments -------------------------
format.getLogs = format({
  limit: format.bigUIntHex,
  fromEpoch: format.epochNumber,
  toEpoch: format.epochNumber,
  blockHashes: format.blockHash.$or([format.blockHash]),
  address: format.address.$or([format.address]),
  topics: format([format.hex64.$or([format.hex64]).$or(null)]),
}, { pick: true });

format.signTx = format({
  nonce: format.bigUInt.$after(format.hexBuffer),
  gasPrice: format.bigUInt.$after(format.hexBuffer),
  gas: format.bigUInt.$after(format.hexBuffer),
  to: format(format.address.$or(null).$default(null)).$after(format.hexBuffer),
  value: format.bigUInt.$default(0).$after(format.hexBuffer),
  storageLimit: format.bigUInt.$after(format.hexBuffer),
  epochHeight: format.uInt.$after(format.hexBuffer),
  chainId: format.uInt.$default(0).$after(format.hexBuffer),
  data: format.hex.$default('0x').$after(format.hexBuffer),
  r: (format.bigUInt.$after(format.hexBuffer)).$or(undefined),
  s: (format.bigUInt.$after(format.hexBuffer)).$or(undefined),
  v: (format.uInt.$after(format.hexBuffer)).$or(undefined),
}, { strict: true, pick: true });

format.callTx = format({
  from: format.address,
  nonce: format.bigUIntHex,
  gasPrice: format.bigUIntHex,
  gas: format.bigUIntHex,
  to: format.address.$or(null),
  value: format.bigUIntHex,
  storageLimit: format.bigUIntHex,
  epochHeight: format.bigUIntHex,
  chainId: format.bigUIntHex,
  data: format.hex,
}, { pick: true });

// ----------------------------- parse rpc returned ---------------------------
format.status = format({
  chainId: format.uInt,
  epochNumber: format.uInt,
  blockNumber: format.uInt,
  pendingTxNumber: format.uInt,
});

format.account = format({
  accumulatedInterestReturn: format.bigUInt,
  balance: format.bigUInt,
  collateralForStorage: format.bigUInt,
  nonce: format.bigUInt,
  stakingBalance: format.bigUInt,
});

format.estimate = format({
  gasUsed: format.bigUInt,
  gasLimit: format.bigUInt,
  storageCollateralized: format.bigUInt,
});

format.transaction = format({
  nonce: format.bigUInt,
  gasPrice: format.bigUInt,
  gas: format.bigUInt,
  value: format.bigUInt,
  storageLimit: format.bigUInt,
  epochHeight: format.uInt,
  chainId: format.uInt,
  v: format.uInt,
  status: format.uInt.$or(null),
  transactionIndex: format.uInt.$or(null),
});

format.block = format({
  epochNumber: format.uInt.$or(null),
  blame: format.uInt,
  height: format.uInt,
  size: format.uInt,
  timestamp: format.uInt,
  gasLimit: format.bigUInt,
  gasUsed: format.bigUInt.$or(null).$or(undefined), // XXX: undefined before main net upgrade
  difficulty: format.bigUInt,
  transactions: [(format.transaction).$or(format.transactionHash)],
});

format.receipt = format({
  index: format.uInt,
  epochNumber: format.uInt,
  outcomeStatus: format.uInt.$or(null),
  gasUsed: format.bigUInt,
  gasFee: format.bigUInt,
  storageCollateralized: format.bigUInt,
  storageReleased: [{
    collaterals: format.bigUInt,
  }],
});

format.log = format({
  epochNumber: format.uInt,
  logIndex: format.uInt,
  transactionIndex: format.uInt,
  transactionLogIndex: format.uInt,
});

format.logs = format([format.log]);

format.supplyInfo = format({
  totalIssued: format.bigUInt,
  totalStaking: format.bigUInt,
  totalCollateral: format.bigUInt,
});

format.sponsorInfo = format({
  sponsorBalanceForCollateral: format.bigUInt,
  sponsorBalanceForGas: format.bigUInt,
  sponsorGasBound: format.bigUInt,
});

format.rewardInfo = format([
  {
    baseReward: format.bigUInt,
    totalReward: format.bigUInt,
    txFee: format.bigUInt,
  },
]);

format.voteList = format([
  {
    amount: format.bigUInt,
  },
]);

format.depositList = format([
  {
    amount: format.bigUInt,
    accumulatedInterestRate: format.bigUInt,
  },
]);

format.traceBlock = format({
  transactionTraces: [
    {
      traces: [
        {
          action: {
            init: format.hex.$parse(Buffer.from, Array.isArray),
            input: format.hex.$parse(Buffer.from, Array.isArray),
            value: format.bigUInt,
            gas: format.bigUInt,
          },
        },
      ],
    },
  ],
});

// ---------------------------- parse subscribe event -------------------------
format.head = format({
  difficulty: format.bigUInt,
  epochNumber: format.uInt.$or(null),
  gasLimit: format.bigUInt,
  height: format.uInt,
  timestamp: format.uInt,
});

format.revert = format({
  revertTo: format.uInt,
});

format.epoch = format({
  epochNumber: format.uInt,
});

module.exports = format;
