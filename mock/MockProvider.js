/* eslint-disable camelcase,no-unused-vars */

const EventEmitter = require('events');
const lodash = require('lodash');
const { toHex, padHex, randomHex, HexStruct } = require('./util');
const { Contract } = require('../src');

const contract = new Contract({
  abi: [
    {
      anonymous: false,
      type: 'event',
      name: 'Transfer',
      inputs: [
        { type: 'address', name: 'from', indexed: true },
        { type: 'address', name: 'to', indexed: true },
        { type: 'uint256', name: 'value' },
      ],
    },
  ],
});

const accountAddressStruct = new HexStruct('0x10', { address: 6 }, 40);
const contractAddressStruct = new HexStruct('0x80', { blockNumber: 6 }, 40);
const tokenAddressStruct = new HexStruct('0x80', { index: 6 }, 40);
const blockHashStruct = new HexStruct('0xb0', { blockNumber: 6 }, 64);
const txHashStruct = new HexStruct('0xf0', { blockNumber: 6, transactionIndex: 6 }, 64);

class MockProvider extends EventEmitter {
  constructor({
    startTimestamp = Math.floor(Date.now() / 1000) - 2 * 30 * 24 * 3600,
    blockNumber = Number.MAX_SAFE_INTEGER,
    blockTime = 15, // in secords
    blockTxCount = 2,
    addressCount = 10,
    chainId = 0,
    dataSize = 0,
  } = {}) {
    super();

    this.startTimestamp = startTimestamp;
    this.blockNumber = blockNumber;
    this.blockTime = blockTime;
    this.blockTxCount = blockTxCount;
    this.chainId = chainId;
    this.dataSize = dataSize;

    this.accountAddressArray = lodash.range(addressCount)
      .map(i => accountAddressStruct.encode({ address: i }));
    this.tokenAddressArray = lodash.range(blockTxCount)
      .map(i => tokenAddressStruct.encode({ index: i }));
  }

  async call(method, ...params) {
    return this[method](...params);
  }

  close() {}

  // --------------------------------------------------------------------------
  web3_clientVersion() {
    return 'mock';
  }

  net_version() {
    return 'mock';
  }

  eth_chainId() {
    return toHex(this.chainId);
  }

  eth_protocolVersion() {
    return 0;
  }

  eth_gasPrice() {
    return randomHex(10);
  }

  // ------------------------------- address ----------------------------------
  eth_getBalance(address, blockNumber) {
    return Number(blockNumber) ? randomHex(8) : '0x0';
  }

  eth_getTransactionCount(address, blockNumber) {
    if ([undefined, 'latest', 'pending'].includes(blockNumber)) {
      return toHex(Number.MAX_SAFE_INTEGER);
    }

    const number = (Number(blockNumber) * this.blockTxCount) / this.accountAddressArray.length;
    return toHex(Math.floor(number));
  }

  // -------------------------------- block -----------------------------------
  eth_blockNumber(blockNumber) {
    if (/^0x[0-9a-f]+$/.test(blockNumber)) {
      return blockNumber;
    }
    return toHex(this.blockNumber);
  }

  eth_getBlockByNumber(blockNumber, detail) {
    const blockHash = blockHashStruct.encode({ blockNumber });
    return this.eth_getBlockByHash(blockHash, detail);
  }

  eth_getBlockByHash(blockHash, detail = false) {
    const { blockNumber } = blockHashStruct.decode(blockHash);
    const timestamp = this.startTimestamp + (blockNumber * this.blockTime); // in secords
    const miner = this.accountAddressArray[blockNumber % this.accountAddressArray.length];

    const parentHash = blockHashStruct.encode({ blockNumber: blockNumber ? blockNumber - 1 : 0 });

    let transactions = lodash.range(this.blockTxCount).map(
      i => txHashStruct.encode({ blockNumber, transactionIndex: i }),
    );

    if (detail) {
      transactions = transactions.map(transactionHash => this.eth_getTransactionByHash(transactionHash));
    }

    return {
      author: miner,
      difficulty: randomHex(8),
      extraData: randomHex(64), // ??
      gasLimit: randomHex(4),
      gasUsed: randomHex(2),
      hash: blockHash,
      logsBloom: randomHex(100),
      miner,
      number: toHex(blockNumber),
      parentHash,
      receiptsRoot: randomHex(64), // ??
      sealFields: [],
      sha3Uncles: randomHex(64),
      signature: randomHex(64),
      size: randomHex(4),
      stateRoot: randomHex(64),
      step: blockNumber.toString(),
      timestamp,
      totalDifficulty: randomHex(8),
      transactions,
      transactionsRoot: randomHex(64),
      uncles: [],
    };
  }

  // ----------------------------- transaction --------------------------------
  eth_getTransactionByHash(transactionHash) {
    const { blockNumber, transactionIndex } = txHashStruct.decode(transactionHash);
    const txCount = blockNumber * this.blockTxCount + transactionIndex;

    const blockHash = blockHashStruct.encode({ blockNumber });
    const nonce = Math.floor(txCount / this.accountAddressArray.length);
    const from = this.accountAddressArray[txCount % this.accountAddressArray.length];
    const to = transactionIndex === 0 ? null : this.accountAddressArray[(txCount + 1) % this.accountAddressArray.length];
    const creates = to ? null : contractAddressStruct.encode({ blockNumber });

    return {
      blockHash,
      blockNumber,
      chainId: toHex(this.chainId),
      condition: null,
      creates,
      from,
      gas: randomHex(5),
      gasPrice: randomHex(2),
      hash: transactionHash,
      data: randomHex(this.dataSize * 2),
      nonce: toHex(nonce),
      publicKey: randomHex(128),
      r: randomHex(64),
      raw: randomHex(282),
      s: randomHex(64),
      standardV: lodash.sample(['0x0', '0x1']),
      to,
      transactionIndex: toHex(transactionIndex),
      v: lodash.sample(['0x0', '0x1']),
      value: randomHex(4),
    };
  }

  eth_getTransactionReceipt(transactionHash) {
    const { blockNumber } = txHashStruct.decode(transactionHash);
    const { blockHash, contractCreated, from, to, transactionIndex } = this.eth_getTransactionByHash(transactionHash);

    return {
      blockHash,
      blockNumber: toHex(blockNumber),
      contractAddress: contractCreated || null,
      cumulativeGasUsed: randomHex(6),
      from,
      gasUsed: randomHex(5),
      logs: [],
      logsBloom: randomHex(128),
      status: toHex(1),
      to,
      transactionHash,
      transactionIndex,
    };
  }

  eth_sendRawTransaction(hex) {
    return randomHex(64);
  }

  eth_sendTransaction(options) {
    return randomHex(64);
  }

  // ------------------------------ contract ----------------------------------
  eth_getCode(address, blockNumber) {
    return randomHex(100);
  }

  eth_getStorageAt(address, position, blockNumber) {
    return randomHex(64);
  }

  eth_call(hex) {
    return padHex(100, 64);
  }

  eth_estimateGas(hex, blockNumber) {
    return randomHex(4);
  }

  eth_getLogs({ blockHashes, address, topics, fromBlock, toEpoch }) {
    const blockNumber = Number(fromBlock); // Number or NaN
    if (!Number.isInteger(blockNumber)) {
      return [];
    }

    const { hash: blockHash, transactions: [transactionHash] } = this.eth_getBlockByNumber(blockNumber);

    return lodash.range(this.blockTxCount).map(index => {
      const { topics: topicArray, data } = contract.Transfer(
        accountAddressStruct.encode({ address: index }),
        accountAddressStruct.encode({ address: index + 1 }),
        blockNumber,
      );

      return {
        address: this.tokenAddressArray[index],
        blockHash,
        blockNumber: toHex(blockNumber),
        data,
        logIndex: randomHex(1),
        remove: false,
        topics: topicArray,
        transactionHash,
        transactionIndex: toHex(0),
        transactionLogIndex: toHex(index),
        type: 'mined',
      };
    });
  }

  // ----------------------------- subscription -------------------------------
  eth_subscribe() {
    return randomHex(16);
  }

  _emitNewHeads(id) {
    const block = this.eth_getBlockByNumber(0);

    this.emit(id, block);
  }

  _emitNewPendingTransactions(id) {
    this.emit(id, randomHex(64));
  }

  _emitLogs(id) {
    const [log] = this.eth_getLogs({ fromBlock: 0 });
    this.emit(id, log);
  }

  eth_unsubscribe() {
    return lodash.sample([true, false]);
  }
}

module.exports = MockProvider;
