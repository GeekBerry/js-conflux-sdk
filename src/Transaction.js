const { keccak256, ecdsaSign, ecdsaRecover, privateKeyToAddress } = require('./util/sign');
const rlp = require('./util/rlp');
const format = require('./util/format');

class Transaction {
  /**
   * Create a transaction.
   *
   * @param options {object}
   * @param [options.from] {string} - The sender address.
   * @param [options.nonce] {string|number} - This allows to overwrite your own pending transactions that use the same nonce.
   * @param [options.gasPrice] {string|number} - The price of gas for this transaction in drip.
   * @param [options.to] {string} - The destination address of the message, left undefined for a contract-creation transaction.
   * @param [options.value] {string|number} - The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
   * @param [options.chainId] {string|number} - The chain ID specified by the sender.
   * @param [options.data] {string|Buffer} - Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
   * @param [options.r] {string|Buffer} - ECDSA signature r
   * @param [options.s] {string|Buffer} - ECDSA signature s
   * @param [options.v] {number} - ECDSA recovery id
   * @return {Transaction}
   */
  constructor({ from, nonce, gasPrice, gas, to, value, data, chainId, v, r, s }) {
    this.from = from;
    this.nonce = nonce;
    this.gasPrice = gasPrice;
    this.gas = gas;
    this.to = to;
    this.value = value;
    this.data = data;
    this.chainId = chainId;
    this.v = v;
    this.r = r;
    this.s = s;
  }

  /**
   * Getter of transaction hash include signature.
   *
   * > Note: calculate every time.
   *
   * @return {string|undefined} If transaction has r,s,v return hex string, else return undefined.
   */
  get hash() {
    try {
      return format.hex(keccak256(this.encode(true)));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Sign transaction and set 'r','s','v'.
   *
   * @param privateKey {string} - Private key hex string.
   * @return {Transaction}
   */
  sign(privateKey) {
    const privateKeyBuffer = format.hexBuffer(privateKey);
    const addressBuffer = privateKeyToAddress(privateKeyBuffer);
    const { r, s, recovery } = ecdsaSign(keccak256(this.encode(false)), privateKeyBuffer);

    this.from = format.address(addressBuffer);
    this.r = format.hex(r);
    this.s = format.hex(s);
    this.v = recovery + 27 + this.chainId * 2 + 8; // EIP-155

    return this;
  }

  /**
   * Recover public key from signed Transaction.
   *
   * @return {string}
   */
  recover() {
    const publicKey = ecdsaRecover(keccak256(this.encode(false)), {
      r: format.hexBuffer(this.r),
      s: format.hexBuffer(this.s),
      recovery: format.uInt(this.v - 27 - this.chainId * 2 - 8),
    });
    return format.publicKey(publicKey);
  }

  /**
   * Encode rlp.
   * > TODO: EIP-2718, EIP-2930
   *
   * @param [includeSignature=false] {boolean} - Whether or not to include the signature.
   * @return {Buffer}
   */
  encode(includeSignature) {
    const { nonce, gasPrice, gas, to, value, data, chainId, v, r, s } = format.signTx(this);

    const raw = includeSignature
      ? [nonce, gasPrice, gas, to, value, data, v, r, s]
      : [nonce, gasPrice, gas, to, value, data, chainId, format.hexBuffer(null), format.hexBuffer(null)];

    return rlp.encode(raw);
  }

  /**
   * Get the raw transaction hex string.
   *
   * @return {string} Hex string
   */
  serialize() {
    return format.hex(this.encode(true));
  }
}

module.exports = Transaction;
