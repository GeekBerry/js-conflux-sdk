/* eslint-disable no-bitwise */
const lodash = require('lodash');
const assert = require('assert');
const JSBI = require('./util/jsbi');
const { convertBit, polyMod } = require('./util/sign');
const { ADDRESS_TYPE } = require('./CONST');

const BYTE_TO_BASE32 = 'ABCDEFGHJKMNPRSTUVWXYZ0123456789';
const BASE32_TO_BYTE = lodash.mapValues(lodash.invert(BYTE_TO_BASE32), Number);

const NULL_ADDRESS_BUFFER = Buffer.alloc(20);
const VERSION_BYTE = 0; // 20 bytes length => version 0

const REGEX = /^(CFX|CFXTEST|NET\d+):TYPE\.(USER|CONTRACT|BUILTIN|NULL):([ABCDEFGHJKMNPRSTUVWXYZ0123456789]{34})([ABCDEFGHJKMNPRSTUVWXYZ0123456789]{8})$/;
const SIMPLE_REGEX = /^(CFX|CFXTEST|NET\d+):([ABCDEFGHJKMNPRSTUVWXYZ0123456789]{34})([ABCDEFGHJKMNPRSTUVWXYZ0123456789]{8})$/;

class ChecksumAddress extends String {
  static getType(buffer) {
    if (Buffer.compare(buffer, NULL_ADDRESS_BUFFER) === 0) {
      return ADDRESS_TYPE.NULL;
    }

    switch (buffer[0] & 0xf0) {
      case 0x00:
        return ADDRESS_TYPE.BUILTIN;
      case 0x10:
        return ADDRESS_TYPE.USER;
      case 0x80:
        return ADDRESS_TYPE.CONTRACT;
      default:
        throw new Error(`unexpected address prefix ${buffer.toString('hex')}`);
    }
  }

  static fromObject({ netName, addressType, payload, checksum }) {
    return new this(`${netName}:TYPE.${addressType}:${payload}${checksum}`);
  }

  static fromSimple(string) {
    assert(lodash.isString(string), `expected a string, got ${string}`);

    const [, netName, payload, checksum] = string.toUpperCase().match(SIMPLE_REGEX) || [];
    const noTypeAddress = this.fromObject({ netName, addressType: ADDRESS_TYPE.NULL, payload, checksum });
    const addressType = this.getType(noTypeAddress.toBuffer());
    return this.fromObject({ netName, addressType, payload, checksum });
  }

  static fromBuffer(buffer, netName = 'CFX') {
    assert(Buffer.isBuffer(buffer), `expected buffer to Buffer, got ${buffer}`);
    assert(buffer.length > 0, `buffer.length shuold > 0, got ${buffer.length}`);

    const addressType = this.getType(buffer);

    const netName5Bits = Buffer.from(netName).map(byte => byte & 0b11111);
    const payload5Bits = convertBit([VERSION_BYTE, ...buffer], 8, 5, true);
    const checksumBigInt = polyMod([...netName5Bits, 0, ...payload5Bits, 0, 0, 0, 0, 0, 0, 0, 0]);
    const checksumBytes = Buffer.from(lodash.padStart(checksumBigInt.toString(16), 10, '0'), 'hex'); // 10 hex == 5bytes == 40 bits
    const checksum5Bits = convertBit(checksumBytes, 8, 5, true);

    const payload = payload5Bits.map(byte => BYTE_TO_BASE32[byte]).join('');
    const checksum = checksum5Bits.map(byte => BYTE_TO_BASE32[byte]).join('');
    return this.fromObject({ netName, addressType, payload, checksum });
  }

  static fromHex(hex, netName) {
    assert(/^0x[0-9a-f]{40}$/.test(hex), 'hex not match regex /0x[0-9a-f]{40}/');

    const addressBytes = Buffer.from(hex.replace('0x', ''), 'hex');
    return this.fromBuffer(addressBytes, netName);
  }

  constructor(string) {
    assert(lodash.isString(string), `expected a string, got ${string}`);

    const uppercase = string.toUpperCase();
    assert(REGEX.test(uppercase), `string "${string}" not match regex ${REGEX}`);
    super(uppercase);
  }

  isValid() {
    const { netName, payload, checksum } = this.toObject();

    const prefix5Bits = Buffer.from(netName).map(byte => byte & 0b11111);
    const payload5Bits = lodash.map(payload, char => BASE32_TO_BYTE[char]);
    const checksum5Bits = lodash.map(checksum, char => BASE32_TO_BYTE[char]);

    const bigInt = polyMod([...prefix5Bits, 0, ...payload5Bits, ...checksum5Bits]);
    return JSBI.equal(bigInt, JSBI.BigInt(0));
  }

  toObject() {
    const [, netName, addressType, payload, checksum] = this.match(REGEX) || [];
    return { netName, addressType, payload, checksum };
  }

  toSimple() {
    const { netName, payload, checksum } = this.toObject();
    return `${netName}:${payload}${checksum}`.toLowerCase();
  }

  toBuffer() {
    const { payload } = this.toObject();
    const payload5Bits = lodash.map(payload, char => BASE32_TO_BYTE[char]);
    const [version, ...addressBytes] = convertBit(payload5Bits, 5, 8);
    assert(version === VERSION_BYTE);

    return Buffer.from(addressBytes);
  }

  toHex() {
    return `0x${this.toBuffer().toString('hex')}`;
  }
}

module.exports = new Proxy(ChecksumAddress, {
  apply(target, thisArg, argArray) {
    return new ChecksumAddress(...argArray);
  },
});
