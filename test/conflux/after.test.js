const lodash = require('lodash');
const { Ethereum } = require('../../src');
const { MockProvider } = require('../../mock');

const ADDRESS = '0x1Cad0B19bB29d4674531d6f115237E16afce377C';
const BLOCK_HASH = '0xe1b0000000000000000000000000000000000000000000000000000000000001';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';

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
  expect(block.number).toEqual(1);
});

test('getBlockByHash', async () => {
  const block = await client.getBlockByHash(BLOCK_HASH);

  expect(block.author.startsWith('0x')).toEqual(true);
  expect(typeof block.difficulty).toEqual('bigint');
  expect(block.extraData.startsWith('0x')).toEqual(true);
  expect(typeof block.gasLimit).toEqual('bigint');
  expect(typeof block.gasUsed).toEqual('bigint');
  expect(block.hash.startsWith('0x')).toEqual(true);
  expect(block.logsBloom.startsWith('0x')).toEqual(true);
  expect(block.miner.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(block.number)).toEqual(true);
  expect(block.parentHash.startsWith('0x')).toEqual(true);
  expect(block.receiptsRoot.startsWith('0x')).toEqual(true);
  expect(Array.isArray(block.sealFields)).toEqual(true);
  expect(block.sha3Uncles.startsWith('0x')).toEqual(true);
  expect(block.signature.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(block.size)).toEqual(true);
  expect(block.stateRoot.startsWith('0x')).toEqual(true);
  expect(/[0-9]+/.test(block.step)).toEqual(true);
  expect(Number.isInteger(block.timestamp)).toEqual(true);
  expect(typeof block.totalDifficulty).toEqual('bigint');
  expect(Array.isArray(block.transactions)).toEqual(true);
  expect(block.transactionsRoot.startsWith('0x')).toEqual(true);
  expect(Array.isArray(block.uncles)).toEqual(true);

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
  expect(Number.isInteger(transaction.blockNumber)).toEqual(true);
  expect(Number.isInteger(transaction.chainId)).toEqual(true);
  expect(transaction.condition).toEqual(null);
  expect(lodash.isNull(transaction.creates) || transaction.creates.startsWith('0x')).toEqual(true);
  expect(transaction.from.startsWith('0x')).toEqual(true);
  expect(typeof transaction.gas).toEqual('bigint');
  expect(typeof transaction.gasPrice).toEqual('bigint');
  expect(transaction.hash.startsWith('0x')).toEqual(true);
  expect(transaction.data.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(transaction.nonce)).toEqual(true);
  expect(transaction.publicKey.startsWith('0x')).toEqual(true);
  expect(transaction.r.startsWith('0x')).toEqual(true);
  expect(transaction.raw.startsWith('0x')).toEqual(true);
  expect(transaction.s.startsWith('0x')).toEqual(true);
  expect(transaction.standardV.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(transaction.to) || transaction.to.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(transaction.transactionIndex)).toEqual(true);
  expect(Number.isInteger(transaction.v)).toEqual(true);
  expect(typeof transaction.value).toEqual('bigint');
});

test('getTransactionReceipt', async () => {
  const receipt = await client.getTransactionReceipt(TX_HASH);

  expect(receipt.blockHash.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(receipt.blockNumber)).toEqual(true);
  expect(lodash.isNull(receipt.contractAddress) || receipt.contractAddress.startsWith('0x')).toEqual(true);
  expect(typeof receipt.cumulativeGasUsed).toEqual('bigint');
  expect(receipt.from.startsWith('0x')).toEqual(true);
  expect(typeof receipt.gasUsed).toEqual('bigint');
  expect(Array.isArray(receipt.logs)).toEqual(true);
  expect(receipt.logsBloom.startsWith('0x')).toEqual(true);
  expect(lodash.isNull(receipt.status) || Number.isInteger(receipt.status)).toEqual(true);
  expect(lodash.isNull(receipt.to) || receipt.to.startsWith('0x')).toEqual(true);
  expect(receipt.transactionHash.startsWith('0x')).toEqual(true);
  expect(Number.isInteger(receipt.transactionIndex)).toEqual(true);
});

// test('sendTransaction', async () => {
//   const promise = client.sendTransaction({
//     from: ADDRESS,
//     gasPrice: 100,
//     gas: 21000,
//     value: 1,
//     storageLimit: 1000,
//   });
//
//   const transactionHash = await promise;
//   expect(transactionHash.startsWith('0x')).toEqual(true);
//
//   const transactionCreated = await promise.get({ delta: 0 });
//   expect(transactionCreated.hash.startsWith('0x')).toEqual(true);
//
//   const transactionMined = await promise.mined();
//   expect(transactionMined.blockHash.startsWith('0x')).toEqual(true);
//
//   const receiptExecute = await promise.executed();
//   expect(receiptExecute.outcomeStatus).toEqual(0);
//
//   const receiptConfirmed = await promise.confirmed({ threshold: 1 });
//   expect(receiptConfirmed.outcomeStatus).toEqual(0);
//
//   await expect(promise.confirmed({ timeout: 0 })).rejects.toThrow('timeout');
// });

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
  const eventLogs = await client.getLogs({ fromBlock: 0 }); // `fromBlock` for mock parse
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
    expect(typeof data.difficulty).toEqual('bigint');
    expect(typeof data.gasLimit).toEqual('bigint');
    expect(typeof data.gasUsed).toEqual('bigint');
    expect(Number.isInteger(data.number)).toEqual(true);
    expect(Number.isInteger(data.size)).toEqual(true);
    expect(Number.isInteger(data.timestamp)).toEqual(true);
  });
  client.provider._emitNewHeads(subscription.id);
});

test('subscribeNewPendingTransactions', async () => {
  const subscription = await client.subscribeNewPendingTransactions();

  subscription.on('data', data => {
    expect(data.startsWith('0x')).toEqual(true);
  });

  client.provider._emitNewPendingTransactions(subscription.id);
});

test('subscribeLogs', async () => {
  const subscription = await client.subscribeLogs();

  subscription.on('data', data => {
    expect(data.address.startsWith('0x')).toEqual(true);
    expect(data.blockHash.startsWith('0x')).toEqual(true);
    expect(data.transactionHash.startsWith('0x')).toEqual(true);
    expect(Number.isInteger(data.blockNumber)).toEqual(true);
    expect(Number.isInteger(data.transactionIndex)).toEqual(true);
    expect(Number.isInteger(data.logIndex)).toEqual(true);
    expect(Number.isInteger(data.transactionLogIndex)).toEqual(true);
    expect(data.data.startsWith('0x')).toEqual(true);
  });

  client.provider._emitLogs(subscription.id);
});

afterAll(() => {
  client.close();
});
