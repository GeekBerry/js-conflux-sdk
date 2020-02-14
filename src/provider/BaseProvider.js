class RPCError extends Error {
  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

class BaseProvider {
  /**
   * @param url {string} - Full json rpc http url
   * @param [options] {object}
   * @param [options.timeout=60*1000] {number} - Request time out in ms
   * @param [options.logger] {object} - Logger with `info` and `error`
   * @return {BaseProvider}
   */
  constructor(url, {
    timeout = 5 * 60 * 1000,
    logger = { info: () => undefined, error: () => undefined },
  } = {}) {
    this.url = url;
    this.timeout = timeout;
    this.logger = logger;
  }

  /**
   * Gen a random json rpc id.
   * It is used in `call` method, overwrite it to gen your own id.
   *
   * @return {string}
   */
  requestId() {
    return `${Date.now()}${Math.random().toFixed(7).substring(2)}`; // 13+7=20 int string
  }

  /**
   * Call a json rpc method with params
   *
   * @param method {string} - Json rpc method name.
   * @param [params] {array} - Json rpc method params.
   * @return {Promise<*>} Json rpc method return value.
   *
   * @example
   * > await provider.call('cfx_epochNumber');
   * > await provider.call('cfx_getBlockByHash', blockHash);
   */
  async call(method, ...params) {
    throw new Error(`NotImplementError: ${this.constructor.name}.call not implement. Send method=${method} params=${params} abort.`);
  }

  /**
   * Disconnect
   */
  close() {}
}

module.exports = BaseProvider;
module.exports.RPCError = RPCError;
