const format = require('./util/format');

class Wei extends String {
  /**
   * Get `Wei` string from `Ether`
   *
   * @param value {string|number}
   * @return {Wei}
   *
   * @example
   * > Wei.fromEther(3.14)
   [String (Wei): '3140000000000000000']
   * > Wei.fromEther('0xab')
   [String (Wei): '171000000000000000000']
   */
  static fromEther(value) {
    return new this(format.big(value).times(1e18));
  }

  /**
   * @param value {string|number}
   * @return {Wei}
   *
   * @example
   * > Wei.fromMilliEther(1)
   [String (Wei): '1000000000000']
   */
  static fromMilliEther(value) {
    return new this(format.big(value).times(1e15));
  }

  /**
   * @param value {string|number}
   * @return {Wei}
   *
   * @example
   * > Wei.fromMicroEther(1)
   [String (Wei): '1000000000']
   */
  static fromMicroEther(value) {
    return new this(format.big(value).times(1e12));
  }

  /**
   * Get `Wei` string from `GWei`
   *
   * @param value {string|number}
   * @return {Wei}
   *
   * @example
   * > Wei.fromGWei(3.14)
   [String (Wei): '3140000000']
   * > Wei.fromGWei('0xab')
   [String (Wei): '171000000000']
   */
  static fromGWei(value) {
    return new this(format.big(value).times(1e9));
  }

  /**
   * @param value {string|number}
   * @return {Wei}
   *
   * @example
   * > Wei.fromMWei(1)
   [String (Wei): '1000000']
   */
  static fromMWei(value) {
    return new this(format.big(value).times(1e6));
  }

  /**
   * @param value {string|number}
   * @return {Wei}
   *
   * @example
   * > Wei.fromKWei(1)
   [String (Wei): '1000']
   */
  static fromKWei(value) {
    return new this(format.big(value).times(1e3));
  }

  constructor(value) {
    super(format.bigUInt(value).toString(10));
  }

  /**
   * Get `Ether` number string
   * @return {string}
   *
   * @example
   * > Wei(1e18).toEther()
   "2"
   */
  toEther() {
    return format.big(this).div(1e18).toFixed();
  }

  /**
   * Get `GWei` number string
   * @return {string}
   *
   * @example
   * > Wei(1e18).toMilliEther()
   "1000"
   */
  toMilliEther() {
    return format.big(this).div(1e15).toFixed();
  }

  /**
   * Get `GWei` number string
   * @return {string}
   *
   * @example
   * > Wei(1e18).toMicroEther()
   "1000000"
   */
  toMicroEther() {
    return format.big(this).div(1e12).toFixed();
  }

  /**
   * Get `GWei` number string
   * @return {string}
   *
   * @example
   * > Wei(1e9).toGWei()
   "1"
   */
  toGWei() {
    return format.big(this).div(1e9).toFixed();
  }

  /**
   * Get `MWei` number string
   * @return {string}
   *
   * @example
   * > Wei(1e9).toMWei()
   "1000"
   */
  toMWei() {
    return format.big(this).div(1e6).toFixed();
  }

  /**
   * Get `KWei` number string
   * @return {string}
   *
   * @example
   * > Wei(1e9).toKWei()
   "1000000"
   */
  toKWei() {
    return format.big(this).div(1e3).toFixed();
  }
}

module.exports = new Proxy(Wei, {
  apply(target, thisArg, argArray) {
    return new Wei(...argArray);
  },
});
