const Big = require('big.js');
const { format } = require('../../src');
const JSBI = require('../../src/util/jsbi');

const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const HEX_40 = '0x0123456789012345678901234567890123456789';

test('any', () => {
  expect(format.any()).toEqual(undefined);
  expect(format.any(null)).toEqual(null);
  expect(format.any(1)).toEqual(1);
  expect(format.any(true)).toEqual(true);
  expect(format.any('string')).toEqual('string');
});

test('hex(null)', () => {
  expect(format.hex(null)).toEqual('0x');

  expect(() => format.hex()).toThrow('not match "hex"');
  expect(() => format.hex(undefined)).toThrow('not match "hex"');
});

test('hex(Number)', () => {
  expect(() => format.hex(-1)).toThrow('not match "hex"');
  expect(format.hex(0)).toEqual('0x00');
  expect(format.hex(1)).toEqual('0x01');
  expect(() => format.hex(3.14)).toThrow('not match "hex"');
  expect(format.hex(256)).toEqual('0x0100');
  expect(format.hex(0x1fffffffffffff)).toEqual('0x1fffffffffffff');
});

test('hex(Buffer)', () => {
  expect(format.hex(Buffer.from([]))).toEqual('0x');
  expect(format.hex(Buffer.from([1, 10, 255]))).toEqual('0x010aff');
});

test('hex(bool)', () => {
  expect(format.hex(false)).toEqual('0x00');
  expect(format.hex(true)).toEqual('0x01');
  expect(() => format.hex('true')).toThrow('not match "hex"');
});

test('hex(string)', () => {
  expect(() => format.hex('')).toThrow('not match "hex"');
  expect(format.hex('0x')).toEqual('0x');

  expect(format.hex('0x1234')).toEqual('0x1234');
  expect(() => format.hex('1234')).toThrow('not match "hex"');

  expect(format.hex('0x0a')).toEqual('0x0a');
  expect(format.hex('0X0A')).toEqual('0x0a');
  expect(format.hex('0xa')).toEqual('0x0a');
  expect(() => format.hex('a')).toThrow('not match "hex"');
  expect(() => format.hex(' a')).toThrow('not match "hex"');
  expect(() => format.hex('a ')).toThrow('not match "hex"');
});

test('uint', () => {
  expect(() => format.uInt()).toThrow('not match "uint"');
  expect(() => format.uInt(null)).toThrow('not match "number"');
  expect(() => format.uInt(3.14)).toThrow('not match "uint"');
  expect(() => format.uInt('3.14')).toThrow('not match "uint"');
  expect(() => format.uInt(-1)).toThrow('not match "uint"');
  expect(format.uInt(0)).toEqual(0);
  expect(format.uInt(1)).toEqual(1);
  expect(format.uInt(3.00)).toEqual(3);
  expect(format.uInt('3.00')).toEqual(3);
  expect(format.uInt(JSBI.BigInt(100))).toEqual(100);
  expect(format.uInt('0x10')).toEqual(16);
  expect(format.uInt(true)).toEqual(1);
  expect(format.uInt(false)).toEqual(0);
  expect(format.uInt('')).toEqual(0);
  expect(format.uInt(Buffer.from([0, 1, 2]))).toEqual(0x102);
  expect(() => format.uInt(Number.MAX_SAFE_INTEGER + 1)).toThrow('not match "uint"');
  expect(() => format.uInt(Infinity)).toThrow('not match "uint"');
});

test('bigInt', () => {
  expect(() => format.bigInt(false)).toThrow('false not match "BigInt"');
  expect(() => format.bigInt(true)).toThrow('true not match "BigInt"');
  expect(() => format.bigInt(3.14)).toThrow('Cannot convert 3.14 to a BigInt');
  expect(() => format.bigInt('3.14')).toThrow('Cannot convert 3.14 to a BigInt');
  expect(() => format.bigInt(Buffer.from([0, 1, 2]))).toThrow('not match "BigInt"');
  expect(format.bigInt('')).toEqual(JSBI.BigInt(0));
  expect(format.bigInt('-1')).toEqual(JSBI.BigInt(-1));
  expect(format.bigInt('0')).toEqual(JSBI.BigInt(0));
  expect(format.bigInt(1)).toEqual(JSBI.BigInt(1));
  expect(format.bigInt(3.00)).toEqual(JSBI.BigInt(3));
  expect(format.bigInt('3.00')).toEqual(JSBI.BigInt(3));
  expect(format.bigInt('0x10')).toEqual(JSBI.BigInt(16));
  expect(format.bigInt(BigInt(20))).toEqual(JSBI.BigInt(20));
  expect(format.bigInt(Number.MAX_SAFE_INTEGER + 1)).toEqual(JSBI.BigInt(2 ** 53));
});

test('bigUInt', () => {
  expect(() => format.bigUInt(3.14)).toThrow('Cannot');
  expect(() => format.bigUInt('3.14')).toThrow('Cannot');
  expect(() => format.bigUInt(-1)).toThrow('not match "bigUInt"');
  expect(() => format.bigUInt('-1')).toThrow('not match "bigUInt"');
  expect(format.bigUInt('0')).toEqual(JSBI.BigInt(0));
  expect(format.bigUInt('0.0')).toEqual(JSBI.BigInt(0));
});

test('bigUIntHex', () => {
  expect(format.bigUIntHex('')).toEqual('0x0');
  expect(format.bigUIntHex(100)).toEqual('0x64');
  expect(format.bigUIntHex('10')).toEqual('0xa');
  expect(format.bigUIntHex('0x000a')).toEqual('0xa');
  expect(format.bigUIntHex(JSBI.BigInt(10))).toEqual('0xa');
  expect(format.bigUIntHex(Number.MAX_SAFE_INTEGER)).toEqual('0x1fffffffffffff');
  expect(() => format.bigUIntHex(Buffer.from([0, 1, 2]))).toThrow('not match "BigInt"');
  expect(() => format.bigUIntHex(3.50)).toThrow('Cannot');
  expect(() => format.bigUIntHex(-0.5)).toThrow('Cannot');
  expect(() => format.bigUIntHex(-1)).toThrow('not match "bigUInt"');
  expect(() => format.bigUIntHex(null)).toThrow('Cannot');
});

test('big', () => {
  expect(format.big('0b10')).toEqual(Big(2));
  expect(format.big('0O10')).toEqual(Big(8));
  expect(format.big('010')).toEqual(Big(10));
  expect(format.big('0x10')).toEqual(Big(16));
  expect(format.big(3.14)).toEqual(Big(3.14));
  expect(format.big('-03.140')).toEqual(Big(-3.14));
  expect(format.big(BigInt(10))).toEqual(Big(10));
  expect(() => format.big()).toThrow('Invalid number');
  expect(() => format.big(null)).toThrow('Invalid number');
  expect(() => format.big(true)).toThrow('Invalid number');
  expect(() => format.big('-0x10')).toThrow('Invalid number');
});

test('blockNumber', () => {
  expect(() => format.blockNumber(-1)).toThrow('not match any');
  expect(format.blockNumber(0)).toEqual('0x0');
  expect(format.blockNumber(10)).toEqual('0xa');
  expect(format.blockNumber('pending')).toEqual('pending');
  expect(format.blockNumber('latest')).toEqual('latest');
  expect(() => format.blockNumber('LATEST')).toThrow('not match any');
});

test('address', () => {
  expect(() => format.address()).toThrow('not match');
  expect(() => format.address(null)).toThrow('not match');

  expect(format.address(Buffer.from('bbb62a2252f998225886fed4f2a9dac3c94de681', 'hex')))
    .toEqual('0xBbb62A2252F998225886FEd4f2A9DaC3C94dE681');
  expect(format.address('0xbbb62a2252f998225886fed4f2a9dac3c94de681'))
    .toEqual('0xBbb62A2252F998225886FEd4f2A9DaC3C94dE681');
  expect(format.address('0XBBB62A2252F998225886FED4F2A9DAC3C94DE681'))
    .toEqual('0xBbb62A2252F998225886FEd4f2A9DaC3C94dE681');
  expect(format.address('0xBbb62A2252F998225886FEd4f2A9DaC3C94dE681'))
    .toEqual('0xBbb62A2252F998225886FEd4f2A9DaC3C94dE681');

  expect(() => format.address('0xbbb62A2252F998225886FEd4f2A9DaC3C94dE681'))
    .toThrow('checksum error');
});

test('hex64', () => {
  expect(format.hex64(HEX_64)).toEqual(HEX_64);
  expect(() => format.hex64(HEX_40)).toThrow('not match "hex64"');

  expect(format.privateKey(HEX_64)).toEqual(HEX_64);
  expect(() => format.privateKey(HEX_40)).toThrow('not match "hex64"');

  expect(format.blockHash(HEX_64)).toEqual(HEX_64);
  expect(() => format.blockHash(HEX_40)).toThrow('not match "hex64"');

  expect(format.transactionHash(HEX_64)).toEqual(HEX_64);
  expect(() => format.transactionHash(HEX_40)).toThrow('not match "hex64"');
});

test('hexBuffer', () => {
  expect(() => format.hexBuffer(undefined)).toThrow('not match "hex"');

  expect(format.hexBuffer(Buffer.from([0, 1]))).toEqual(Buffer.from([0, 1]));

  expect(format.hexBuffer(null)).toEqual(Buffer.from([]));

  expect(format.hexBuffer(0)).toEqual(Buffer.from([0]));
  expect(() => format.hexBuffer(3.14)).toThrow('not match "hex"');
  expect(format.hexBuffer(1024)).toEqual(Buffer.from([4, 0]));
  expect(format.hexBuffer('0x0a')).toEqual(Buffer.from([10]));

  expect(format.hexBuffer(false)).toEqual(Buffer.from([0]));
  expect(format.hexBuffer(true)).toEqual(Buffer.from([1]));
});

test('bytes', () => {
  expect(() => format.bytes(undefined)).toThrow('type');
  expect(() => format.bytes(null)).toThrow('type');
  expect(() => format.bytes(0)).toThrow('type');
  expect(() => format.bytes(3.14)).toThrow('type');

  expect(format.bytes('abcd')).toEqual(Buffer.from([97, 98, 99, 100]));
  expect(format.bytes('0x0a')).toEqual(Buffer.from([48, 120, 48, 97]));
  expect(format.bytes([0, 1])).toEqual(Buffer.from([0, 1]));
  expect(format.bytes(Buffer.from([0, 1]))).toEqual(Buffer.from([0, 1]));
});

test('boolean', () => {
  expect(() => format.boolean(undefined)).toThrow('not match "boolean"');
  expect(() => format.boolean(1)).toThrow('not match "boolean"');

  expect(format.boolean(true)).toEqual(true);
  expect(format.boolean(false)).toEqual(false);
});

test('keccak256', () => {
  expect(() => format.keccak256(undefined)).toThrow('Received');
  expect(() => format.keccak256(null)).toThrow('Received');
  expect(() => format.keccak256(0)).toThrow('Received');

  expect(format.keccak256('')).toEqual('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
  expect(format.keccak256([])).toEqual(format.keccak256(''));
  expect(format.keccak256(Buffer.from(''))).toEqual(format.keccak256(''));

  expect(format.keccak256([0x42])).toEqual('0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111');
  expect(format.keccak256([0x42])).not.toEqual(format.keccak256('0x42'));
  expect(format.keccak256([0x42])).toEqual(format.keccak256(format.hexBuffer('0x42')));
});
