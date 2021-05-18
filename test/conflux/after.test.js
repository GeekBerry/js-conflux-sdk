const lodash = require('lodash');
const { Ethereum, format } = require('../../src');
const { MockProvider } = require('../../mock');

const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
const BLOCK_HASH = '0xe1b0000000000000000000000000000000000000000000000000000000000001';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const HEX64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// ----------------------------------------------------------------------------
const client = new Ethereum();
client.provider = new MockProvider();

test('getClientVersion', async () => {
  const version = await client.getClientVersion();

  expect(lodash.isString(version)).toEqual(true);
});

test('getNetVersion', async () => {
  const version = await client.getNetVersion();

  expect(lodash.isString(version)).toEqual(true);
});

test('getChainId', async () => {
  const chainId = await client.getChainId();

  expect(Number.isInteger(chainId)).toEqual(true);
});

test('getProtocolVersion', async () => {
  const protocolVersion = await client.getProtocolVersion();

  expect(Number.isInteger(protocolVersion)).toEqual(true);
});

test('getGasPrice', async () => {
  const gasPrice = await client.getGasPrice();

  expect(typeof gasPrice).toEqual('bigint');
});

// ------------------------------- address ----------------------------------
test('getBalance', async () => {
  const balance = await client.getBalance(ADDRESS);

  expect(typeof balance).toEqual('bigint');
});

test('getTransactionCount', async () => {
  const txCount = await client.getTransactionCount(ADDRESS);

  expect(Number.isInteger(txCount)).toEqual(true);
});

// -------------------------------- block -----------------------------------
test('getBlockNumber', async () => {
  const getBlockNumber = await client.getBlockNumber();

  expect(Number.isInteger(getBlockNumber)).toEqual(true);
});

test('getBlockByNumber', async () => {
  const block = await client.getBlockByNumber(1);
  expect(block.blockNumber).toEqual(1);
});

test('getBlockByHash', async () => {
  const block = await client.getBlockByHash(BLOCK_HASH);

  expect(block.hash.startsWith('0x')).toEqual(true);
  expect(block.miner.startsWith('0x')).toEqual(true);
  expect(block.parentHash.startsWith('0x')).toEqual(true);
  expect(block.transactionsRoot.startsWith('0x')).toEqual(true);
  expect(block.deferredLogsBloomHash.startsWith('0x')).toEqual(true);
  expect(block.deferredReceiptsRoot.startsWith('0x')).toEqual(true);
  expect(block.deferredStateRoot.startsWith('0x')).toEqual(true);
  expect(lodash.isBoolean(block.adaptive)).toEqual(true);
  expect(Number.isInteger(block.blockNumber)).toEqual(true);
  expect(Number.isInteger(block.size)).toEqual(true);
  expect(Number.isInteger(block.height)).toEqual(true);
  expect(Number.isInteger(block.timestamp)).toEqual(true);
  expect(block.nonce.startsWith('0x')).toEqual(true);
  expect(typeof block.gasLimit).toEqual('bigint');
  expect(typeof block.difficulty).toEqual('bigint');
  expect(Array.isArray(block.refereeHashes)).toEqual(true);
  expect(Array.isArray(block.transactions)).toEqual(true);
  block.transactions.forEach(transactionHash => {
    expect(transactionHash.startsWith('0x')).toEqual(true);
  });

  const blockDetail = await client.getBlockByHash(BLOCK_HASH, true);
  expect(Array.isArray(blockDetail.transactions)).toEqual(true);
  blockDetail.transactions.forEach(transaction => {
    expect(lodash.isPlainObject(transaction)).toEqual(true);
  });
});

// ----------------------------- transaction --------------------------------
test('getTransactionByHash', async () => {
  const transaction = await client.getTransactionByHash(TX_HASH);

  expect(transaction.blockHash.startsWith('0x')).toEqual(true);
  expect(transaction.hash.startsWith('0x')).toEqual(true);
  expect(transaction.from.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(transaction.to) || transaction.to.startsWith('0x')).toEqual(true);
  expect(transaction.data.startsWith('0x')).toEqual(true);
  expect(transaction.r.startsWith('0x')).toEqual(true);
  expect(transaction.s.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(transaction.contractCreated) || transaction.contractCreated.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(transaction.transactionIndex)).toEqual(true);
  expect(Number.isInteger(transaction.nonce)).toEqual(true);
  expect(lodash.isNull(transaction.status) || Number.isInteger(transaction.status)).toEqual(true);
  expect(Number.isInteger(transaction.v)).toEqual(true);
  expect(typeof transaction.gas).toEqual('bigint');
  expect(typeof transaction.gasPrice).toEqual('bigint');
  expect(typeof transaction.value).toEqual('bigint');
  expect(typeof transaction.storageLimit).toEqual('bigint');
  expect(Number.isInteger(transaction.chainId)).toEqual(true);
  expect(Number.isInteger(transaction.epochHeight)).toEqual(true);
});

test('getTransactionReceipt', async () => {
  const receipt = await client.getTransactionReceipt(TX_HASH);

  expect(receipt.blockHash.startsWith('0x')).toEqual(true);
  expect(receipt.transactionHash.startsWith('0x')).toEqual(true);
  expect(receipt.from.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(receipt.to) || receipt.to.startsWith('0x')).toEqual(true);
  expect(receipt.logsBloom.startsWith('0x')).toEqual(true);
  expect(receipt.stateRoot.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(receipt.contractCreated) || receipt.contractCreated.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(receipt.index)).toEqual(true);
  expect(Number.isInteger(receipt.blockNumber)).toEqual(true);
  expect(lodash.isNull(receipt.outcomeStatus) || Number.isInteger(receipt.outcomeStatus)).toEqual(true);
  expect(typeof receipt.gasUsed).toEqual('bigint');
  expect(typeof receipt.gasFee).toEqual('bigint');
  expect(Array.isArray(receipt.logs)).toEqual(true);
  expect(receipt.txExecErrorMsg).not.toBeUndefined();
  expect(lodash.isBoolean(receipt.gasCoveredBySponsor)).toEqual(true);
  expect(lodash.isBoolean(receipt.storageCoveredBySponsor)).toEqual(true);
  expect(typeof receipt.storageCollateralized).toEqual('bigint');
  expect(Array.isArray(receipt.storageReleased)).toEqual(true);
  expect(receipt.storageReleased[0].address.startsWith('0x')).toEqual(true);
  expect(typeof receipt.storageReleased[0].collaterals).toEqual('bigint');
});

test('sendTransaction', async () => {
  const promise = client.sendTransaction({
    from: ADDRESS,
    gasPrice: 100,
    gas: 21000,
    value: 1,
    storageLimit: 1000,
  });

  const transactionHash = await promise;
  expect(transactionHash.startsWith('0x')).toEqual(true);

  const transactionCreated = await promise.get({ delta: 0 });
  expect(transactionCreated.hash.startsWith('0x')).toEqual(true);

  const transactionMined = await promise.mined();
  expect(transactionMined.blockHash.startsWith('0x')).toEqual(true);

  const receiptExecute = await promise.executed();
  expect(receiptExecute.outcomeStatus).toEqual(0);

  const receiptConfirmed = await promise.confirmed({ threshold: 1 });
  expect(receiptConfirmed.outcomeStatus).toEqual(0);

  await expect(promise.confirmed({ timeout: 0 })).rejects.toThrow('timeout');
});

// ------------------------------ contract ----------------------------------
test('getCode', async () => {
  const code = await client.getCode(ADDRESS);

  expect(code.startsWith('0x')).toEqual(true);
});

test('getStorageAt', async () => {
  const storage = await client.getStorageAt(ADDRESS, '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

  expect(storage.startsWith('0x')).toEqual(true);
});

test('call', async () => {
  const hex = await client.call({ to: ADDRESS });

  expect(hex.startsWith('0x')).toEqual(true);
});

test('estimateGas', async () => {
  const estimateGas = await client.estimateGas({});

  expect(typeof estimateGas).toEqual('bigint');
});

test('getLogs', async () => {
  const eventLogs = await client.getLogs({ fromEpoch: 0 }); // `fromEpoch` for mock parse
  expect(Array.isArray(eventLogs)).toEqual(true);

  const [eventLog] = eventLogs;
  expect(eventLog.address.startsWith('0x')).toEqual(true);
  expect(eventLog.blockHash.startsWith('0x')).toEqual(true);
  expect(eventLog.transactionHash.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(eventLog.blockNumber)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.logIndex)).toEqual(true);
  expect(Number.isInteger(eventLog.transactionLogIndex)).toEqual(true);
  expect(eventLog.data.startsWith('0x')).toEqual(true);
  eventLog.topics.forEach(topic => {
    expect(topic.startsWith('0x')).toEqual(true);
  });
});

// ------------------------------- subscribe ----------------------------------
test('subscribeNewHeads', async () => {
  const subscription = await client.subscribeNewHeads();

  subscription.on('data', data => {
    expect(data).toEqual({
      difficulty: format.bigInt('1048575'),
      blockNumber: null,
      gasLimit: format.bigInt('1'),
      height: 10,
      powQuality: '0xfff',
      timestamp: 1602644636,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: HEX64,
      deferredReceiptsRoot: HEX64,
      deferredStateRoot: HEX64,
      hash: BLOCK_HASH,
      miner: ADDRESS,
      nonce: '0x1000000000000000',
      parentHash: BLOCK_HASH,
      refereeHashes: [BLOCK_HASH],
      transactionsRoot: HEX64,
    });
  });
  client.provider.emit(subscription.id, {
    adaptive: false,
    blame: 0,
    deferredLogsBloomHash: HEX64,
    deferredReceiptsRoot: HEX64,
    deferredStateRoot: HEX64,
    difficulty: '0xfffff',
    blockNumber: null,
    gasLimit: '0x1',
    hash: BLOCK_HASH,
    height: '0xa',
    miner: ADDRESS,
    nonce: '0x1000000000000000',
    parentHash: BLOCK_HASH,
    powQuality: '0xfff',
    refereeHashes: [BLOCK_HASH],
    timestamp: 1602644636,
    transactionsRoot: HEX64,
  });
});

test('subscribeLogs', async () => {
  const subscription = await client.subscribeLogs();

  subscription.on('data', data => {
    expect(data).toEqual({
      blockNumber: 65535,
      logIndex: 0,
      transactionIndex: 0,
      transactionLogIndex: 0,
      address: ADDRESS,
      blockHash: BLOCK_HASH,
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      topics: [HEX64, HEX64, HEX64],
      transactionHash: HEX64,
    });
  });
  client.provider.emit(subscription.id, {
    blockNumber: '0xffff',
    logIndex: '0x0',
    transactionIndex: '0x0',
    transactionLogIndex: '0x0',
    address: ADDRESS,
    blockHash: BLOCK_HASH,
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [HEX64, HEX64, HEX64],
    transactionHash: HEX64,
  });

  subscription.on('revert', data => {
    expect(data).toEqual({
      revertTo: 65535,
    });
  });
  client.provider.emit(subscription.id, {
    revertTo: '0xffff',
  });
});

afterAll(() => {
  client.close();
});
