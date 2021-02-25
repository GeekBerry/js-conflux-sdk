/* eslint-disable camelcase,no-unused-vars */

const EventEmitter = require('events');
const lodash = require('lodash');
const { toHex, padHex, randomHex, HexStruct } = require('./util');
const { Contract, ChecksumAddress } = require('../src');

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
    chainId = 1029,
    netName = 'CFX',
  } = {}) {
    super();

    this.startTimestamp = startTimestamp;
    this.epochNumber = epochNumber;
    this.blockDelta = blockDelta;
    this.epochBlockCount = epochBlockCount;
    this.blockTxCount = blockTxCount;
    this.epochTxCount = epochTxCount;
    this.chainId = chainId;
    this.netName = netName;

    this.accountAddressArray = lodash.range(addressCount)
      .map(i => ChecksumAddress.fromHex(accountAddressStruct.encode({ address: i }), netName).toString());
    this.tokenAddressArray = lodash.range(epochTxCount)
      .map(i => ChecksumAddress.fromHex(tokenAddressStruct.encode({ index: i }), netName).toString());
  }

  async call(method, ...params) {
    return this[method](...params);
  }

  close() {}

  // --------------------------------------------------------------------------
  cfx_clientVersion() {
    return 'mock';
  }

  cfx_getStatus() {
    return {
      chainId: toHex(this.chainId),
      epochNumber: randomHex(4),
      blockNumber: randomHex(4),
      pendingTxNumber: randomHex(4),
      bestHash: randomHex(64),
    };
  }

  cfx_gasPrice() {
    return randomHex(2);
  }

  cfx_getSupplyInfo(epochNumber) {
    return {
      totalIssued: randomHex(20),
      totalStaking: randomHex(18),
      totalCollateral: randomHex(18),
      totalCirculating: randomHex(18),
    };
  }

  cfx_getInterestRate(epochNumber) {
    return randomHex(10);
  }

  cfx_getAccumulateInterestRate(epochNumber) {
    return randomHex(10);
  }

  // ------------------------------- address ----------------------------------
  cfx_getAccount(address, epochNumber) {
    return {
      accumulatedInterestReturn: randomHex(4),
      balance: randomHex(8),
      collateralForStorage: randomHex(4),
      nonce: randomHex(2),
      stakingBalance: randomHex(2),
      admin: ChecksumAddress.fromHex('0x0000000000000000000000000000000000000000', this.netName),
      codeHash: randomHex(64),
    };
  }

  cfx_getBalance(address, epochNumber) {
    return Number(epochNumber) ? randomHex(8) : '0x0';
  }

  cfx_getStakingBalance(address, epochNumber) {
    return Number(epochNumber) ? randomHex(8) : '0x0';
  }

  cfx_getNextNonce(address, epochNumber) {
    if ([undefined, 'latest_state', 'latest_mined'].includes(epochNumber)) {
      return toHex(Number.MAX_SAFE_INTEGER);
    }

    const number = (Number(epochNumber) * this.epochBlockCount * this.blockTxCount) / this.accountAddressArray.length;
    return toHex(Math.floor(number));
  }

  cfx_getAdmin(address, epochNumber) {
    return ChecksumAddress.fromHex('0x0000000000000000000000000000000000000000', this.netName);
  }

  cfx_getVoteList(address, epochNumber) {
    return lodash.range(2).map(() => ({
      amount: randomHex(8),
      unlockBlockNumber: epochNumber === undefined ? lodash.random(0, 1000) : epochNumber * 2,
    }));
  }

  cfx_getDepositList(address, epochNumber) {
    return lodash.range(2).map(() => ({
      amount: randomHex(8),
      accumulatedInterestRate: randomHex(16),
      depositTime: epochNumber === undefined ? lodash.random(100000, 999999) : epochNumber,
    }));
  }

  // -------------------------------- epoch -----------------------------------
  cfx_epochNumber(epochNumber) {
    if (/^0x[0-9a-f]+$/.test(epochNumber)) {
      return epochNumber;
    }
    return toHex(this.epochNumber);
  }

  cfx_getBlocksByEpoch(epochNumber) {
    const blockHashArray = lodash.range(this.epochBlockCount).map(
      i => blockHashStruct.encode({ epochNumber, blockIndex: i }),
    );
    return blockHashArray.reverse(); // pivot to last one
  }

  cfx_getBlockByEpochNumber(epochNumber, detail) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    return this.cfx_getBlockByHash(lodash.last(blockHashArray), detail);
  }

  cfx_getBlockRewardInfo(epochNumber) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    return blockHashArray.map(blockHash => {
      const block = this.cfx_getBlockByHash(blockHash);
      return {
        blockHash,
        author: block.miner,
        baseReward: randomHex(8),
        totalReward: randomHex(10),
        txFee: randomHex(12),
      };
    });
  }

  // -------------------------------- block -----------------------------------
  cfx_getBestBlockHash() {
    return blockHashStruct.encode({ epochNumber: 0, blockIndex: 0 });
  }

  cfx_getBlockByHash(blockHash, detail = false) {
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
      transactions = transactions.map(transactionHash => this.cfx_getTransactionByHash(transactionHash));
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

  cfx_getBlockByHashWithPivotAssumption(blockHash, pivotHash, epochNumber) {
    const blockHashArray = this.cfx_getBlocksByEpoch(epochNumber);
    if (lodash.last(blockHashArray) !== pivotHash || !blockHashArray.includes(blockHash)) {
      throw new Error('{"code":-32602,"message":"Error: pivot chain assumption failed"}');
    }

    return this.cfx_getBlockByHash(blockHash, true);
  }

  cfx_getConfirmationRiskByHash() {
    return randomHex(64);
  }

  trace_block(blockHash) {
    const { transactions } = this.cfx_getBlockByHash(blockHash, true);
    return {
      transactionTraces: transactions.map(({ from, to, value, gas, data }) => ({
        traces: [{
          type: 'call',
          action: { callType: 'call', from, to, value, gas, input: data },
        }],
      })),
    };
  }

  // ----------------------------- transaction --------------------------------
  cfx_getTransactionByHash(transactionHash) {
    const { epochNumber, blockIndex, transactionIndex } = txHashStruct.decode(transactionHash);
    const blockCount = epochNumber * this.epochBlockCount + blockIndex;
    const txCount = blockCount * this.blockTxCount + transactionIndex;

    const blockHash = blockHashStruct.encode({ epochNumber, blockIndex });
    const nonce = Math.floor(txCount / this.accountAddressArray.length);
    const from = this.accountAddressArray[txCount % this.accountAddressArray.length];
    const to = transactionIndex === 0 ? null : this.accountAddressArray[(txCount + 1) % this.accountAddressArray.length];
    const contractCreated = to ? null : ChecksumAddress.fromHex(contractAddressStruct.encode({ epochNumber, blockIndex }), this.netName).toString();

    return {
      blockHash,
      chainId: toHex(this.chainId),
      contractCreated,
      data: randomHex(100),
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

  cfx_getTransactionReceipt(transactionHash) {
    const { epochNumber } = txHashStruct.decode(transactionHash);
    const { blockHash, contractCreated, from, to, transactionIndex, status } = this.cfx_getTransactionByHash(transactionHash);

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

  cfx_sendRawTransaction(hex) {
    return randomHex(64);
  }

  cfx_sendTransaction(options) {
    return randomHex(64);
  }

  // ------------------------------ contract ----------------------------------
  cfx_getCode(address, epochNumber) {
    return randomHex(100);
  }

  cfx_getStorageAt(address, position, epochNumber) {
    return randomHex(64);
  }

  cfx_getStorageRoot(address, epochNumber) {
    return {
      delta: randomHex(64),
      intermediate: randomHex(64),
      snapshot: randomHex(64),
    };
  }

  cfx_getSponsorInfo(address, epochNumber) {
    return {
      sponsorBalanceForCollateral: randomHex(2),
      sponsorBalanceForGas: randomHex(2),
      sponsorGasBound: randomHex(2),
      sponsorForCollateral: ChecksumAddress.fromHex('0x0000000000000000000000000000000000000000', this.netName).toString(),
      sponsorForGas: ChecksumAddress.fromHex('0x0000000000000000000000000000000000000000', this.netName).toString(),
    };
  }

  cfx_getCollateralForStorage(address, epochNumber) {
    return randomHex(10);
  }

  cfx_call(hex) {
    return padHex(100, 64);
  }

  cfx_estimateGasAndCollateral(hex, epochNumber) {
    return {
      gasUsed: randomHex(4),
      gasLimit: randomHex(4),
      storageCollateralized: randomHex(4),
    };
  }

  cfx_getLogs({ blockHashes, address, topics, fromEpoch, toEpoch, limit }) {
    const epochNumber = Number(fromEpoch); // Number or NaN
    if (!Number.isInteger(epochNumber)) {
      return [];
    }

    const { hash: blockHash, transactions: [transactionHash] } = this.cfx_getBlockByEpochNumber(epochNumber);

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

  cfx_subscribe() {
    return randomHex(16);
  }

  cfx_unsubscribe() {
    return lodash.sample([true, false]);
  }
}

module.exports = MockProvider;
