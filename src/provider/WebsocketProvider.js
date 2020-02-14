const EventEmitter = require('events');
const WS = require('ws');
const BaseProvider = require('./BaseProvider');

/**
 * Web socket protocol json rpc provider.
 */
class WebsocketProvider extends BaseProvider {
  /**
   * @param url {string} - Full json rpc web socket url
   * @param [options] {object} - See `BaseProvider.constructor`
   * @return {WebsocketProvider}
   *
   * @example
   * > const provider = new WebsocketProvider('ws://testnet-jsonrpc.conflux-chain.org:8080', {logger: console});
   */
  constructor(url, options) {
    super(url, options);
    this.messageEvent = new EventEmitter();
  }

  async _getWS() {
    if (!this.ws || this.ws.readyState !== WS.OPEN) {
      const ws = new WS(this.url);

      // catch connecting error
      ws.once('error', e => {
        throw new Error(e);
      });

      // wait till open
      await new Promise(resolve => {
        ws.once('open', () => {
          // ignore message error
          ws.removeEventListener('error');
          ws.on('error', () => {
            if (ws.readyState === WS.OPEN) {
              ws.terminate();
            }
          });
          resolve();
        });
      });

      // transfer message by id
      ws.on('message', message => {
        const body = JSON.parse(message);
        this.messageEvent.emit(body.id, body);
      });

      // XXX: is the garbage collection will control the old `this.ws` ?
      this.ws = ws;
    }

    return this.ws;
  }

  async call(method, ...params) {
    const startTime = Date.now();
    const data = { jsonrpc: '2.0', id: this.requestId(), method, params };

    const ws = await this._getWS();

    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(
        () => reject(new Error(`timeout when call ${method}(${params.join(',')}) after ${this.timeout} ms`)),
        this.timeout,
      );

      this.messageEvent.once(data.id, ({ error, result }) => {
        clearTimeout(timeoutHandle);

        if (error) {
          this.logger.error({ data, error, duration: Date.now() - startTime });
          reject(new BaseProvider.RPCError(error));
        } else {
          this.logger.info({ data, result, duration: Date.now() - startTime });
          resolve(result);
        }
      });

      ws.send(JSON.stringify(data));
    });
  }

  close() {
    if (this.ws) {
      this.ws.terminate();
      this.messageEvent.removeAllListeners();
    }
  }
}

module.exports = WebsocketProvider;
