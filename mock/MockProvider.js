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
const contractAddressStruct = new HexStruct('0x80', { epochNumber: 6, blockIndex: 6 }, 40);
const tokenAddressStruct = new HexStruct('0x80', { index: 6 }, 40);
const blockHashStruct = new HexStruct('0xb0', { epochNumber: 6, blockIndex: 6 }, 64);
const txHashStruct = new HexStruct('0xf0', { epochNumber: 6, blockIndex: 6, transactionIndex: 6 }, 64);

class MockProvider extends EventEmitter {
  constructor({
    startTimestamp = Math.floor(Date.now() / 1000) - 2 * 30 * 24 * 3600,
    epochNumber = Number.MAX_SAFE_INTEGER,
    blockDelta = 1, // in secords
    addressCount = 10,
    epochBlockCount = 5,
    blockTxCount = 2,
    epochTxCount = 2,
    chainId = 0,
    dataSize = 0,
  } = {}) {
    super();

    this.startTimestamp = startTimestamp;
    this.epochNumber = epochNumber;
    this.blockDelta = blockDelta;
    this.epochBlockCount = epochBlockCount;
    this.blockTxCount = blockTxCount;
    this.epochTxCount = epochTxCount;
    this.chainId = chainId;
    this.dataSize = dataSize;

    this.accountAddressArray = lodash.range(addressCount)
      .map(i => accountAddressStruct.encode({ address: i }));
    this.tokenAddressArray = lodash.range(epochTxCount)
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
    return randomHex(2);
  }

  // ------------------------------- address ----------------------------------
  eth_getBalance(address, epochNumber) {
    return Number(epochNumber) ? randomHex(8) : '0x0';
  }

  eth_getTransactionCount(address, epochNumber) {
    if ([undefined, 'latest_state', 'latest_mined'].includes(epochNumber)) {
      return toHex(Number.MAX_SAFE_INTEGER);
    }

    const number = (Number(epochNumber) * this.epochBlockCount * this.blockTxCount) / this.accountAddressArray.length;
    return toHex(Math.floor(number));
  }

  // -------------------------------- block -----------------------------------
  eth_blockNumber(blockNumber) {
    if (/^0x[0-9a-f]+$/.test(blockNumber)) {
      return blockNumber;
    }
    return toHex(this.epochNumber);
  }

  eth_getBlockByNumber(epochNumber, detail) {
    const blockHash = blockHashStruct.encode({ epochNumber, blockIndex: 0 });
    return this.eth_getBlockByHash(blockHash, detail);
  }

  eth_getBlockByHash(blockHash, detail = false) {
    const { epochNumber, blockIndex } = blockHashStruct.decode(blockHash);
    const blockCount = epochNumber * this.epochBlockCount + blockIndex;
    const timestamp = this.startTimestamp + (blockCount * this.blockDelta); // in secords
    const miner = this.accountAddressArray[blockCount % this.accountAddressArray.length];

    const parentHash = blockIndex === 0
      ? blockHashStruct.encode({ epochNumber: epochNumber ? epochNumber - 1 : 0, blockIndex })
      : blockHashStruct.encode({ epochNumber, blockIndex: blockIndex - 1 });

    const refereeHashes = [blockHashStruct.encode({ epochNumber, blockIndex })];

    let transactions = lodash.range(this.blockTxCount).map(
      i => txHashStruct.encode({ epochNumber, blockIndex, transactionIndex: i }),
    );

    if (detail) {
      transactions = transactions.map(transactionHash => this.eth_getTransactionByHash(transactionHash));
    }

    return {
      adaptive: lodash.sample([true, false]),
      blame: randomHex(1),
      custom: [[1]],
      deferredLogsBloomHash: randomHex(64),
      deferredReceiptsRoot: randomHex(64),
      deferredStateRoot: randomHex(64),
      difficulty: randomHex(8),
      epochNumber: toHex(epochNumber),
      gasLimit: randomHex(4),
      gasUsed: randomHex(2),
      hash: blockHash,
      height: toHex(epochNumber),
      miner,
      nonce: randomHex(16),
      parentHash,
      powQuality: randomHex(4),
      refereeHashes,
      size: randomHex(4),
      timestamp,
      transactions,
      transactionsRoot: randomHex(64),
    };
  }

  // ----------------------------- transaction --------------------------------
  eth_getTransactionByHash(transactionHash) {
    const { epochNumber, blockIndex, transactionIndex } = txHashStruct.decode(transactionHash);
    const blockCount = epochNumber * this.epochBlockCount + blockIndex;
    const txCount = blockCount * this.blockTxCount + transactionIndex;

    const blockHash = blockHashStruct.encode({ epochNumber, blockIndex });
    const nonce = Math.floor(txCount / this.accountAddressArray.length);
    const from = this.accountAddressArray[txCount % this.accountAddressArray.length];
    const to = transactionIndex === 0 ? null : this.accountAddressArray[(txCount + 1) % this.accountAddressArray.length];
    const contractCreated = to ? null : contractAddressStruct.encode({ epochNumber, blockIndex });

    return {
      blockHash,
      chainId: toHex(this.chainId),
      contractCreated,
      data: randomHex(this.dataSize * 2),
      epochHeight: epochNumber,
      from,
      gas: randomHex(5), // gasLimit
      gasPrice: randomHex(2),
      hash: transactionHash,
      nonce: toHex(nonce),
      r: randomHex(64),
      s: randomHex(64),
      status: (blockIndex === 0 && transactionIndex === 1) ? '0x1' : '0x0',
      storageLimit: randomHex(10),
      to,
      transactionIndex: toHex(transactionIndex),
      v: lodash.sample(['0x0', '0x1']),
      value: randomHex(4),
    };
  }

  eth_getTransactionReceipt(transactionHash) {
    const { epochNumber } = txHashStruct.decode(transactionHash);
    const { blockHash, contractCreated, from, to, transactionIndex, status } = this.eth_getTransactionByHash(transactionHash);

    return {
      blockHash,
      contractCreated,
      epochNumber: toHex(epochNumber),
      from,
      gasCoveredBySponsor: lodash.sample([true, false]),
      gasFee: randomHex(5),
      gasUsed: randomHex(5),
      index: transactionIndex,
      logs: [],
      logsBloom: randomHex(512),
      outcomeStatus: status,
      stateRoot: randomHex(64),
      storageCollateralized: randomHex(4),
      storageCoveredBySponsor: lodash.sample([true, false]),
      storageReleased: [
        { address: from, collaterals: randomHex(4) },
      ],
      to,
      transactionHash,
      txExecErrorMsg: status === null ? null : 'mock error message',
    };
  }

  eth_sendRawTransaction(hex) {
    return randomHex(64);
  }

  eth_sendTransaction(options) {
    return randomHex(64);
  }

  // ------------------------------ contract ----------------------------------
  eth_getCode(address, epochNumber) {
    return randomHex(100);
  }

  eth_getStorageAt(address, position, epochNumber) {
    return randomHex(64);
  }

  eth_call(hex) {
    return padHex(100, 64);
  }

  eth_estimateGas(hex, epochNumber) {
    return randomHex(4);
  }

  eth_getLogs({ blockHashes, address, topics, fromEpoch, toEpoch, limit }) {
    const epochNumber = Number(fromEpoch); // Number or NaN
    if (!Number.isInteger(epochNumber)) {
      return [];
    }

    const { hash: blockHash, transactions: [transactionHash] } = this.eth_getBlockByEpochNumber(epochNumber);

    return lodash.range(this.epochTxCount).map(index => {
      const { topics: topicArray, data } = contract.Transfer(
        accountAddressStruct.encode({ address: index }),
        accountAddressStruct.encode({ address: index + 1 }),
        epochNumber,
      );

      return {
        address: this.tokenAddressArray[index],
        blockHash,
        data,
        epochNumber: toHex(epochNumber),
        logIndex: randomHex(1),
        topics: topicArray,
        transactionHash,
        transactionIndex: toHex(0),
        transactionLogIndex: toHex(index),
      };
    });
  }

  // ----------------------------- subscription -------------------------------
  eth_subscribe() {
    return randomHex(16);
  }

  eth_unsubscribe() {
    return lodash.sample([true, false]);
  }
}

module.exports = MockProvider;
