const CONST = require('./CONST');
const format = require('./util/format');
const providerFactory = require('./provider');
const Wallet = require('./wallet');
const Contract = require('./contract');
const PendingTransaction = require('./subscribe/PendingTransaction');
const Subscription = require('./subscribe/Subscription');

/**
 * A sdk of ethereum.
 */
class Ethereum {
  /**
   * @param [options] {object} - Conflux and Provider constructor options.
   * @param [options.defaultGasPrice] {string|number} - The default gas price in drip to use for transactions.
   * @param [options.url] {string} - Url of Conflux node to connect.
   * @param [options.timeout] {number} - Request time out in ms
   * @param [options.logger] {Object} - Logger object with 'info' and 'error' method.
   *
   * @example
   * > const client = new Ethereum({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
   */
  constructor({
    defaultGasPrice,
    ...rest
  } = {}) {
    /**
     * Provider for rpc call
     *
     * @type {WebsocketProvider|HttpProvider|BaseProvider}
     */
    this.provider = providerFactory(rest);

    /**
     * Wallet for `sendTransaction` to get `Account` by `from` field
     *
     * @type {Wallet}
     */
    this.wallet = new Wallet();

    /**
     * Default gas price for following methods:
     * - `Conflux.sendTransaction`
     *
     * @deprecated
     * @type {number|string}
     */
    this.defaultGasPrice = defaultGasPrice;

    this.sendRawTransaction = this._decoratePendingTransaction(this.sendRawTransaction);
    this.sendTransaction = this._decoratePendingTransaction(this.sendTransaction);
  }

  _decoratePendingTransaction(func) {
    const client = this;
    return function (...args) {
      return new PendingTransaction(client, func.bind(this), args);
    };
  }

  /**
   * A shout cut for `new Contract(options, client);`
   *
   * @param options {object} - See [Contract.constructor](#Contract.js/constructor)
   * @return {Contract} - A Contract instance
   */
  Contract(options) {
    return new Contract(options, this);
  }

  /**
   * close connection.
   *
   * @example
   * > client.close();
   */
  close() {
    this.provider.close();
  }

  // --------------------------------------------------------------------------
  /**
   * Get node client version
   *
   * @private
   * @return {Promise<string>}
   *
   * @example
   * > await client.getClientVersion()
   "OpenEthereum//v3.2.5-rc.1-stable-2df74c2-20210428/x86_64-linux-gnu/rustc1.51.0"
   */
  async getClientVersion() {
    return this.provider.call('web3_clientVersion');
  }

  /**
   * @return {Promise<string>}
   *
   * @example
   * > await client.getNetVersion()
   "Mainnet"
   */
  async getNetVersion() {
    const result = await this.provider.call('net_version');
    return CONST.NET_VERSION[result] || result;
  }

  /**
   * @return {Promise<number>}
   *
   * @example
   * > await client.getChainId()
   42
   */
  async getChainId() {
    const result = await this.provider.call('eth_chainId');
    return format.uInt(result);
  }

  /**
   * @return {Promise<number>}
   *
   * @example
   * > await client.getProtocolVersion()
   65
   */
  async getProtocolVersion() {
    const result = await this.provider.call('eth_protocolVersion');
    return format.uInt(result);
  }

  /**
   * Returns the current price per gas in Wei.
   *
   * @return {Promise<BigInt>} Gas price in drip.
   *
   * @example
   * > await client.getGasPrice();
   1n
   */
  async getGasPrice() {
    const result = await this.provider.call('eth_gasPrice');
    return format.bigUInt(result);
  }

  // ------------------------------- address ----------------------------------
  /**
   * Returns the balance of the account of given address.
   *
   * @param address {string} - The address to get the balance of.
   * @param [blockNumber=CONST.BLOCK_NUMBER.LATEST] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<BigInt>} The balance in Wei.
   *
   * @example
   * > await client.getBalance("0x1c1e72f0c37968557b3d85a3f32747792798bbde");
   824812401057514588670n
   */
  async getBalance(address, blockNumber = CONST.BLOCK_NUMBER.LATEST) {
    const result = await this.provider.call('eth_getBalance',
      format.address(address),
      format.blockNumber(blockNumber),
    );
    return format.bigUInt(result);
  }

  /**
   * Returns the next nonce should be used by given address.
   *
   * @param address {string} - The address to get the numbers of transactions from.
   * @param [blockNumber] {string|number} - See [format.blockNumber](#util/format.js/format/(static)blockNumber)
   * @return {Promise<BigInt>} The next nonce should be used by given address.
   *
   * @example
   * > await client.getNextNonce("0x1c1e72f0c37968557b3d85a3f32747792798bbde");
   1449n
   */
  async getTransactionCount(address, blockNumber = CONST.BLOCK_NUMBER.LATEST) {
    const result = await this.provider.call('eth_getTransactionCount',
      format.address(address),
      format.blockNumber(blockNumber),
    );
    return format.uInt(result);
  }

  // -------------------------------- epoch -----------------------------------
  /**
   * Returns the epoch number of given parameter.
   *
   * @return {Promise<number>} integer of the current epoch number of given parameter.
   *
   * @example
   * > await client.getEpochNumber();
   443
   */
  async getBlockNumber() {
    const result = await this.provider.call('eth_blockNumber');

    return format.uInt(result);
  }

  /**
   * Returns information about a block by epoch number.
   *
   * @param blockNumber {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @param [detail=false] {boolean} - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
   * @return {Promise<object|null>} See `getBlockByHash`
   *
   * @example
   * > await client.getBlockByEpochNumber('latest_mined', true);
   {...}
   */
  async getBlockByNumber(blockNumber, detail = false) {
    const result = await this.provider.call('eth_getBlockByNumber',
      format.blockNumber(blockNumber),
      format.boolean(detail),
    );
    return format.block.$or(null)(result);
  }

  // -------------------------------- block -----------------------------------
  /**
   * Returns information about a block by hash.
   *
   * @param blockHash {string} - hash of a block.
   * @param [detail=false] {boolean} - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.
   * @return {Promise<object|null>} A block object, or null when no block was found:
   * - adaptive `boolean`: If `true` the weight of the block is adaptive under GHAST rule, if `false` otherwise.
   * - blame `number`: If 0, then no blocks are blamed on its parent path, If greater than 0, then the nearest blamed block on the parent path is blame steps away.
   * - deferredLogsBloomHash `string`: The bloom hash of deferred logs.
   * - deferredReceiptsRoot `string`: The hash of the receipts of the block after deferred execution.
   * - deferredStateRoot `string`: The root of the final state trie of the block after deferred execution.
   * - difficulty `string`: Integer string of the difficulty for this block.
   * - epochNumber `number|null`: The current block epoch number in the client's view. null when it's not in best block's past set and the epoch number is not determined.
   * - gasLimit `BigInt`: The maximum gas allowed in this block.
   * - hash `string|null`: Hash of the block. `null` when its pending block.
   * - height `number`: The block heights. `null` when its pending block.
   * - miner `string`: The address of the beneficiary to whom the mining rewards were given.
   * - nonce `string`: Hash of the generated proof-of-work. `null` when its pending block.
   * - parentHash `string`: Hash of the parent block.
   * - powQuality `string`:Hash of the generated proof-of-work. `null` when its pending block.
   * - refereeHashes `string[]`: Array of referee hashes.
   * - size `number`: Integer the size of this block in bytes.
   * - timestamp `number`: The unix timestamp for when the block was collated.
   * - transactions `string[]|object[]`: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
   * - transactionsRoot `string`: The hash of the transactions of the block.
   *
   * @example
   * > await client.getBlockByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390');
   {
      epochNumber: 6,
      blame: 0,
      height: 6,
      size: 352,
      timestamp: 1603901780,
      gasLimit: 30000000n,
      gasUsed: 61118n,
      difficulty: 20000000000n,
      transactions: [
        '0xaad69c8c814aec3e418b68f60917c607920a531e7082dd2c642323b43ecadb94',
        '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce'
      ],
      adaptive: false,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508',
      deferredStateRoot: '0x50c0fcbc5bafa7d1dba7b19c87629830106a6be8d0adf505cdc656bb43535d69',
      hash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      miner: 'NET1921:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0JABGHCD8E',
      nonce: '0x17d86f2f6',
      parentHash: '0xc8a412b4b77b48d61f694975f032d109f26bb0f9fc02e4b221d67a382fab386b',
      powQuality: '0x5a0f86a6f4',
      refereeHashes: [
        '0x73cd891aea310e2c0b8644de91746c7353cebfffb780126bc06101b20689c893'
      ],
      transactionsRoot: '0xd2f08676484ba2a3738194f44542eb29fb290b8ed74bf007f132fe51d89b2e7c'
    }
   */
  async getBlockByHash(blockHash, detail = false) {
    const result = await this.provider.call('eth_getBlockByHash',
      format.blockHash(blockHash),
      format.boolean(detail),
    );
    return format.block.$or(null)(result);
  }

  // ----------------------------- transaction --------------------------------
  /**
   * Returns the information about a transaction requested by transaction hash.
   *
   * @param transactionHash {string} - hash of a transaction
   * @return {Promise<object|null>} transaction object, or `null` when no transaction was found:
   * - blockHash `string`: hash of the block where this transaction was in and got executed. `null` when its pending.
   * - contractCreated `string|null`: address of created contract. `null` when it's not a contract creating transaction
   * - data `string`: the data send along with the transaction.
   * - epochHeight `number`: epoch height
   * - from `string`: address of the sender.
   * - gas `BigInt`: gas provided by the sender.
   * - gasPrice `number`: gas price provided by the sender in Wei.
   * - hash `string`: hash of the transaction.
   * - nonce `BigInt`: the number of transactions made by the sender prior to this one.
   * - r `string`: ECDSA signature r
   * - s `string`: ECDSA signature s
   * - status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
   * - storageLimit `BigInt`: storage limit in bytes
   * - chainId `number`: chain id
   * - to `string`: address of the receiver. null when its a contract creation transaction.
   * - transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
   * - v `string`: ECDSA recovery id
   * - value `BigInt`: value transferred in Wei.
   *
   * @example
   * > await client.getTransactionByHash('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      nonce: 0n,
      gasPrice: 10n,
      gas: 200000n,
      value: 0n,
      storageLimit: 1024n,
      epochHeight: 0,
      chainId: 1029,
      v: 1,
      status: 0,
      transactionIndex: 1,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      data: '0xfebe49090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000162788589c8e386863f217faef78840919fb2854',
      from: 'NET1921:TYPE.USER:AAP9KTHVCTUNVF030RBKK9K7ZBZYZ12DAJYFD4DBC8',
      hash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      r: '0x495da01ae9f445847022a8bc7df0198577ba75f88b26699f61afb435bb9c50bc',
      s: '0x2291051b1c53db1d6bfe2fb29be1bf512d063e726dc6b98aaf0f2259b7456be0',
      to: 'NET1921:TYPE.CONTRACT:ACB59FK6VRYH8DJ5VYVEHJ9APZHPD72RDPA1CTUUZH'
    }
   */
  async getTransactionByHash(transactionHash) {
    const result = await this.provider.call('eth_getTransactionByHash',
      format.transactionHash(transactionHash),
    );
    return format.transaction.$or(null)(result);
  }

  /**
   * Returns the information about a transaction receipt requested by transaction hash.
   *
   * @param transactionHash {string} - Hash of a transaction
   * @return {Promise<object|null>} A transaction receipt object, or null when no transaction was found or the transaction was not executed yet:
   * - transactionHash `string`: Hash of the given transaction.
   * - index `number`: Transaction index within the block.
   * - blockHash `string`: Hash of the block where this transaction was in and got executed.
   * - epochNumber `number`: Epoch number of the block where this transaction was in and got executed.
   * - from `string`: Address of the sender.
   * - to `string`: Address of the receiver. `null` when its a contract creation transaction.
   * - gasUsed `number`: Gas used the transaction.
   * - contractCreated `string|null`: Address of created contract. `null` when it's not a contract creating transaction.
   * - stateRoot `string`: Hash of the state root.
   * - outcomeStatus `number`:  the outcome status code, 0 was successful, 1 for an error occurred in the execution.
   * - logsBloom `string`: Bloom filter for light clients to quickly retrieve related logs.
   * - logs `object[]`: Array of log objects, which this transaction generated.
   * - gasCoveredBySponsor `boolean`: `true` if this transaction's gas fee was covered by the sponsor.
   * - storageCoveredBySponsor `boolean`: `true` if this transaction's storage collateral was covered by the sponsor.
   * - storageCollateralized `BigInt`: the amount of storage collateral this transaction required.
   * - storageReleased `array`: array of storage change objects, each specifying an address and the corresponding amount of storage collateral released
   *   - address `string`: address released
   *   - collaterals `BigInt`: corresponding amount of storage collateral released
   *
   * @example
   * > await client.getTransactionReceipt('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      index: 1,
      epochNumber: 6,
      outcomeStatus: 0,
      gasUsed: 30559n,
      gasFee: 1500000n,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      from: 'NET1921:TYPE.USER:AAP9KTHVCTUNVF030RBKK9K7ZBZYZ12DAJYFD4DBC8',
      logs: [],
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      stateRoot: '0xd6a7c2c14cb0d1233010acca98e114db5a10e0b94803d23b01a6777b7fd3b2fd',
      to: 'NET1921:TYPE.CONTRACT:ACB59FK6VRYH8DJ5VYVEHJ9APZHPD72RDPA1CTUUZH'
      transactionHash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      txExecErrorMsg: null,
      gasCoveredBySponsor: false,
      storageCoveredBySponsor: false,
      storageCollateralized: 0n,
      storageReleased: [
        address: 'NET1921:TYPE.BUILTIN:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE45419DJS',
        collaterals: 640n,
      ],
    }
   */
  async getTransactionReceipt(transactionHash) {
    const result = await this.provider.call('eth_getTransactionReceipt',
      format.transactionHash(transactionHash),
    );
    return format.receipt.$or(null)(result);
  }

  /**
   * Creates new message call transaction or a contract creation for signed transactions.
   *
   * @param hex {string|Buffer} - The signed transaction data.
   * @return {Promise<PendingTransaction>} The transaction hash, or the zero hash if the transaction is not yet available.
   *
   * @example
   * > await client.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
   */
  async sendRawTransaction(hex) {
    try {
      return await this.provider.call('eth_sendRawTransaction',
        format.hex(hex),
      );
    } catch (e) {
      e.message = e.data || e.message;
      throw e;
    }
  }

  /**
   * Create `Transaction` and sign by account which key by `from` filed in `client.wallet`, then send transaction
   *
   * @private
   * @param options {object}
   * @param options.from {string} - Key of account in client.wallet
   * @return {Promise<Transaction>}
   */
  async signTransaction(options) {
    const account = await this.wallet.get(options.from);

    if (options.nonce === undefined) {
      options.nonce = await this.getTransactionCount(account);
    }

    if (options.chainId === undefined) {
      options.chainId = await this.getChainId();
    }

    if (options.gasPrice === undefined) {
      if (this.defaultGasPrice === undefined) {
        options.gasPrice = await this.getGasPrice();
      } else {
        options.gasPrice = this.defaultGasPrice;
      }
    }

    if (options.gasLimit === undefined) {
      options.gasLimit = options.data
        ? await this.estimateGas(options)
        : CONST.TRANSACTION_GAS;
    }

    return account.signTransaction(options);
  }

  /**
   * @param options {object}
   * @return {Promise<PendingTransaction>}
   */
  async sendTransaction(options) {
    const transaction = await this.signTransaction(options);

    return this.sendRawTransaction(transaction.serialize());
  }

  // ------------------------------ contract ----------------------------------
  /**
   * Returns the code of given contract.
   *
   * @param address {string} - Address to contract.
   * @param [blockNumber=CONST.BLOCK_NUMBER.LATEST] {string|number} - See [format.blockNumber](#util/format.js/format/(static)blockNumber)
   * @return {Promise<string>} Byte code of contract, or 0x if the contract does not exist.
   *
   * @example
   * > await client.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
   */
  async getCode(address, blockNumber = CONST.BLOCK_NUMBER.LATEST) {
    return this.provider.call('eth_getCode',
      format.address(address),
      format.blockNumber(blockNumber),
    );
  }

  /**
   * Returns storage entries from a given contract.
   *
   * @param address {string} - Address to contract.
   * @param position {string} - The given position.
   * @param [blockNumber='latest_state'] {string|number} - See [format.blockNumber](#util/format.js/format/(static)blockNumber)
   * @return {Promise<string|null>} Storage entry of given query, or null if the it does not exist.
   *
   * @example
   * > await client.getStorageAt('0x866aca87ff33a0ae05d2164b3d999a804f583222', '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9')
   "0x000000000000000000000000000000000000000000000000000000000000162e"
   */
  async getStorageAt(address, position, blockNumber = CONST.BLOCK_NUMBER.LATEST) {
    return this.provider.call('eth_getStorageAt',
      format.address(address),
      format.hex(position),
      format.blockNumber(blockNumber),
    );
  }

  /**
   * Virtually call a contract, return the output data.
   *
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param [blockNumber=CONST.BLOCK_NUMBER.LATEST] {string|number} - See [format.blockNumber](#util/format.js/format/(static)blockNumber)
   * @return {Promise<string>} The output data.
   */
  async call(options, blockNumber = CONST.BLOCK_NUMBER.LATEST) {
    try {
      return await this.provider.call('eth_call',
        format.callTx(options),
        format.blockNumber(blockNumber),
      );
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * Virtually call a contract, return the estimate gas used and storage collateralized.
   *
   * @param options {object} - See [Transaction](#Transaction.js/Transaction/**constructor**)
   * @param [blockNumber=CONST.BLOCK_NUMBER.LATEST] {string|number} - See [format.epochNumber](#util/format.js/format/(static)epochNumber)
   * @return {Promise<object>} A estimate result object:
   * - `BigInt` gasUsed: The gas used.
   * - `BigInt` gasLimit: The gas limit.
   * - `BigInt` storageCollateralized: The storage collateralized in Byte.
   */
  async estimateGas(options, blockNumber = CONST.BLOCK_NUMBER.LATEST) {
    try {
      const result = await this.provider.call('eth_estimateGas',
        format.callTx(options),
        format.blockNumber(blockNumber),
      );
      return format.bigUInt(result);
    } catch (e) {
      throw Contract.decodeError(e);
    }
  }

  /**
   * Returns logs matching the filter provided.
   *
   * @param [options] {object}
   * @param [options.fromBlock=CONST.BLOCK_NUMBER.LATEST] {string|number} - See [format.blockNumber](#util/format.js/format/(static)blockNumber). Search will be applied from this epoch number.
   * @param [options.toBlock=CONST.BLOCK_NUMBER.LATEST] {string|number} - See [format.blockNumber](#util/format.js/format/(static)blockNumber). Search will be applied up until (and including) this epoch number.
   * @param [options.blockHash] {string} -  Array of up to 128 block hashes that the search will be applied to. This will override from/to epoch fields if it's not null
   * @param [options.address] {string|string[]} - Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
   * @param [options.topics] {array} - Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.
   * @return {Promise<object[]>} Array of log, that the logs matching the filter provided:
   * - address `string`: Address this event originated from.
   * - topics `string[]`: Array of topics.
   * - data `string`: The data containing non-indexed log parameter.
   * - blockHash `string`: Hash of the block where the log in.
   * - epochNumber `number`: Epoch number of the block where the log in.
   * - transactionHash `string`: Hash of the transaction where the log in.
   * - transactionIndex `string`: Transaction index in the block.
   * - logIndex `number`: Log index in block.
   * - transactionLogIndex `number`: Log index in transaction.
   *
   * @example
   * > await client.getLogs({
      address: '0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98',
      fromEpoch: 39802,
      toEpoch: 39802,
      limit: 1,
      topics: ['0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'],
    });
   [
   {
      epochNumber: 39802,
      logIndex: 2,
      transactionIndex: 0,
      transactionLogIndex: 2,
      address: '0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98',
      blockHash: '0xca00158a2a508170278d5bdc5ca258b6698306dd8c30fdba32266222c79e57e6',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde'
      ],
      transactionHash: '0xeb75f47002720311f1709e36d7f7e9a91ee4aaa469a1de892839cb1ef66a9939'
    }
   ]
   */
  async getLogs(options) {
    const result = await this.provider.call('eth_getLogs', format.getLogs(options));

    return format.logs(result);
  }

  // ----------------------------- subscription -------------------------------
  /**
   * Subscribe event by name and got id, and provider will emit event by id
   *
   * > Note: suggest use `client.subscribeXXX` to subscribe
   *
   * @param name {string} - Subscription name
   * @param args {array} - Subscription arguments
   * @return {Promise<string>} Id of subscription
   *
   * @example
   * > client = new Conflux({url:'ws://127.0.0.1:12535'})
   * > id = await client.subscribe('epochs');
   "0x8fe7879a1681e9b9"
   * > client.provider.on(id, data=>console.log(data));
   {
     epochHashesOrdered: [
       '0x0eff33578346b8e8347af3bae948eb7f4f5c27add9dbcfeb55eaf7cb3640088f',
       '0xb0cedac34a06ebcb42c3446a6bb2df1f0dcd9d83061f550460e387d19a4d8e91'
     ],
     epochNumber: '0x8cb32'
   }
   */
  async subscribe(name, ...args) {
    return this.provider.call('eth_subscribe', name, ...args);
  }

  /**
   * The newHeads topic streams all new block headers participating in the consensus.
   *
   * @return {Promise<Subscription>} EventEmitter instance with the follow events:
   * - 'data': see `getBlockByHash`
   *
   * @example
   * > subscription = await client.subscribeNewHeads()
   * > subscription.on('data', data=>console.log(data))
   {
      number: 24908378,
      hash: '0xb6b8641011e90f747c8addb8ae38c622348f07e852af50f688c2bcbd975b4402',
      parentHash: '0xf6ef56360d258f7ae1eb91c3dcee477c2022d1ce5e0780f9852b5a1ea953ae5b',
      sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      logsBloom: '0x000000400000200001000080000000000000010000100800020800000010000001800000000020000000040000000000002000100000000000000000002000000000002000000000000400080000000000010200000802000000a400c000000400000801820000008004601000002a20200000000000800010002030002000400800040200008010240000000900000001804001008000000000100080080200021000000000002000000010000103000000000000000000000000a00000020000020002000000000000800000000000000800000000080000008020800020020010000040080008000001000000200008000000800000480000000000814000',
      transactionsRoot: '0xf499abdb0439a896543f0bc9ca5b6f110452b3d1b3fa672626e917065b52139b',
      stateRoot: '0x0225ba245d86c0f64bd4cd7690b6af2a41ccef62034353f22ec6f72e8dc87b58',
      receiptsRoot: '0xb61ec060497fbb6208bc17255553ced836d1e9a468154d2f1a415825a1e66e57',
      miner: '0x03801efb0efe2a25ede5dd3a003ae880c0292e4d',
      author: '0x03801efb0efe2a25ede5dd3a003ae880c0292e4d',
      difficulty: 340282366920938463463374607431768211454n,
      extraData: '0xdb830302058c4f70656e457468657265756d86312e34372e30826c69',
      size: 5925,
      gasLimit: 12499988n,
      gasUsed: 1853185n,
      timestamp: 1621323232,
    }
   */
  async subscribeNewHeads() {
    const id = await this.subscribe('newHeads');
    const subscription = new Subscription(id);

    this.provider.on(id, data => {
      subscription.emit('data', format.subscribeHead(data));
    });

    return subscription;
  }

  /**
   * The logs topic streams all logs matching a certain filter, in order.
   * In case of a pivot chain reorg (which might affect recent logs), a special revert message is sent.
   * All logs received previously that belong to epochs larger than the one in this message should be considered invalid.
   *
   * @param [options] {object}
   * @param [options.address] {string|string[]} - Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
   * @param [options.topics] {array} - Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.
   * @return {Promise<Subscription>} EventEmitter instance with the follow events:
   * - 'data': see `getLogs`
   * - 'removed': see `getLogs`
   *
   * @example
   * > subscription = await client.subscribeLogs()
   * > subscription.on('data', data=>console.log(data))
   {
     epochNumber: 568224,
     logIndex: 0,
     transactionIndex: 0,
     transactionLogIndex: 0,
     address: '0x84ed30d7ddc5ff82ac271ae4e7add5a8b22a8d71',
     blockHash: '0xc02689eea6a507250838463c13e6b633479e2757dfb7e9b2593d5c31b54adb63',
     data: '0x0000000000000000000000000000000000000000000000000000000000000001',
     topics: [
       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
     ],
     transactionHash: '0x950ddec9ce3b42c4d8ca120722fa318ae64dc2e24553201f55f68c00bfd9cc4c'
   }
   * @example
   * > subscription.on('removed', data=>console.log(data))
   */
  async subscribeLogs(options = {}) {
    const id = await this.subscribe('logs', format.getLogs(options));

    const subscription = new Subscription(id);
    this.provider.on(id, data => {
      if (data.removed) {
        subscription.emit('removed', format.log(data));
      } else {
        subscription.emit('data', format.log(data));
      }
    });

    return subscription;
  }

  /**
   * @return {Promise<Subscription>}
   */
  async subscribeNewPendingTransactions() {
    const id = await this.subscribe('newPendingTransactions');

    const subscription = new Subscription(id);
    this.provider.on(id, data => {
      subscription.emit('data', format.transactionHash(data));
    });

    return subscription;
  }

  /**
   * Unsubscribe subscription.
   *
   * @param id {string|Subscription} - Subscription id
   * @return {Promise<boolean>} Is success
   *
   * @example
   * > id = await client.subscribe('epochs');
   * > await client.unsubscribe(id);
   true
   * > await client.unsubscribe(id);
   false

   * @example
   * > subscription = await client.subscribeLogs();
   * > await client.unsubscribe(subscription);
   true
   */
  async unsubscribe(id) {
    return this.provider.call('eth_unsubscribe', `${id}`);
  }
}

module.exports = Ethereum;
