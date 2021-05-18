const lodash = require('lodash');
const { Ethereum } = require('../../src');
const { MockProvider } = require('../../mock');

const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';
const BLOCK_HASH = '0xe0b0000000000000000000000000000000000000000000000000000000000000';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';
const PASSWORD = '123456';

// ----------------------------------------------------------------------------
const client = new Ethereum({
  defaultGasPrice: lodash.random(0, 1000),
});
client.provider = new MockProvider();

// ------------------------------- address ----------------------------------
test('getBalance', async () => {
  await expect(client.getBalance()).rejects.toThrow('not match "address"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getBalance(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getBalance', ADDRESS, undefined);

  await client.getBalance(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('eth_getBalance', ADDRESS, 'latest_state');

  await client.getBalance(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getBalance', ADDRESS, '0x0');

  call.mockRestore();
});

test('getNextNonce', async () => {
  await expect(client.getNextNonce()).rejects.toThrow('not match regex');

  const call = jest.spyOn(client.provider, 'call');

  await client.getNextNonce(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getNextNonce', ADDRESS, undefined);

  await client.getNextNonce(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('eth_getNextNonce', ADDRESS, 'latest_state');

  await client.getNextNonce(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getNextNonce', ADDRESS, '0x0');

  call.mockRestore();
});

test('getAdmin', async () => {
  await expect(client.getAdmin()).rejects.toThrow('not match regex');

  const call = jest.spyOn(client.provider, 'call');

  await client.getAdmin(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getAdmin', ADDRESS, undefined);

  await client.getAdmin(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('eth_getAdmin', ADDRESS, 'latest_state');

  await client.getAdmin(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getAdmin', ADDRESS, '0x0');

  call.mockRestore();
});

test('getVoteList', async () => {
  await expect(client.getVoteList()).rejects.toThrow('not match regex');

  const call = jest.spyOn(client.provider, 'call');

  await client.getVoteList(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getVoteList', ADDRESS, undefined);

  await client.getVoteList(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('eth_getVoteList', ADDRESS, 'latest_state');

  await client.getVoteList(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getVoteList', ADDRESS, '0x0');

  call.mockRestore();
});

test('getDepositList', async () => {
  await expect(client.getDepositList()).rejects.toThrow('not match regex');

  const call = jest.spyOn(client.provider, 'call');

  await client.getDepositList(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getDepositList', ADDRESS, undefined);

  await client.getDepositList(ADDRESS, 'latest_state');
  expect(call).toHaveBeenLastCalledWith('eth_getDepositList', ADDRESS, 'latest_state');

  await client.getDepositList(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getDepositList', ADDRESS, '0x0');

  call.mockRestore();
});

// -------------------------------- epoch -----------------------------------
test('getEpochNumber', async () => {
  await expect(client.getEpochNumber(null)).rejects.toThrow('not match any');
  await expect(client.getEpochNumber('xxx')).rejects.toThrow('not match any');
  await expect(client.getEpochNumber('EARLIEST')).rejects.toThrow('not match any');

  const call = jest.spyOn(client.provider, 'call');

  await client.getEpochNumber();
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', undefined);

  await client.getEpochNumber(0);
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', '0x0');

  await client.getEpochNumber('100');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', '0x64');

  await client.getEpochNumber('0x0a');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', '0xa');

  await client.getEpochNumber('earliest');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', 'earliest');

  await client.getEpochNumber('latest_checkpoint');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', 'latest_checkpoint');

  await client.getEpochNumber('latest_confirmed');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', 'latest_confirmed');

  await client.getEpochNumber('latest_state');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', 'latest_state');

  await client.getEpochNumber('latest_mined');
  expect(call).toHaveBeenLastCalledWith('eth_blockNumber', 'latest_mined');

  call.mockRestore();
});

test('getBlockByEpochNumber', async () => {
  await expect(client.getBlockByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');
  await expect(client.getBlockByEpochNumber(0, 1)).rejects.toThrow('not match "boolean"');

  const call = jest.spyOn(client.provider, 'call');
  call.mockReturnValue(null);

  await client.getBlockByEpochNumber('latest_state', false);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByEpochNumber', 'latest_state', false);

  await client.getBlockByEpochNumber(0, true);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByEpochNumber', '0x0', true);

  call.mockRestore();
});

test('getBlocksByEpochNumber', async () => {
  await expect(client.getBlocksByEpochNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');

  const call = jest.spyOn(client.provider, 'call');

  await client.getBlocksByEpochNumber(0);
  expect(call).toHaveBeenLastCalledWith('eth_getBlocksByEpoch', '0x0');

  call.mockRestore();
});

test('getBlockRewardInfo', async () => {
  await expect(client.getBlockRewardInfo()).rejects.toThrow('Cannot convert undefined to a BigInt');

  const call = jest.spyOn(client.provider, 'call');

  await client.getBlockRewardInfo(10);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockRewardInfo', '0xa');

  call.mockRestore();
});

// -------------------------------- block -----------------------------------
test('getBlockByHash', async () => {
  await expect(client.getBlockByHash()).rejects.toThrow('not match "hex"');
  await expect(client.getBlockByHash(ADDRESS)).rejects.toThrow('not match "hex64"');
  await expect(client.getBlockByHash(BLOCK_HASH, 0)).rejects.toThrow('not match "boolean"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getBlockByHash(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByHash', BLOCK_HASH, false);

  await client.getBlockByHash(BLOCK_HASH, false);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByHash', BLOCK_HASH, false);

  await client.getBlockByHash(BLOCK_HASH, true);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByHash', BLOCK_HASH, true);

  call.mockRestore();
});

test('getBlockByHashWithPivotAssumption', async () => {
  await expect(client.getBlockByHashWithPivotAssumption()).rejects.toThrow('undefined not match "hex"');
  await expect(client.getBlockByHashWithPivotAssumption(BLOCK_HASH)).rejects.toThrow('undefined not match "hex"');
  await expect(client.getBlockByHashWithPivotAssumption(BLOCK_HASH, BLOCK_HASH)).rejects.toThrow('Cannot convert undefined to a BigInt');

  const blockNumber = 100;
  const blockHashArray = await client.getBlocksByEpochNumber(blockNumber);
  const blockHash = lodash.first(blockHashArray);
  const pivotHash = lodash.last(blockHashArray);

  const call = jest.spyOn(client.provider, 'call');

  await client.getBlockByHashWithPivotAssumption(blockHash, pivotHash, blockNumber);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByHashWithPivotAssumption', blockHash, pivotHash, '0x64');

  call.mockRestore();
});

test('getConfirmationRiskByHash', async () => {
  await expect(client.getConfirmationRiskByHash()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getConfirmationRiskByHash(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('eth_getConfirmationRiskByHash', BLOCK_HASH);

  call.mockRestore();
});

test('traceBlock', async () => {
  const call = jest.spyOn(client.provider, 'call');

  await client.traceBlock(BLOCK_HASH);
  expect(call).toHaveBeenLastCalledWith('trace_block', BLOCK_HASH);

  call.mockRestore();
});

// ----------------------------- transaction --------------------------------
test('getTransactionByHash', async () => {
  await expect(client.getTransactionByHash()).rejects.toThrow('not match "hex"');
  await expect(client.getTransactionByHash(ADDRESS)).rejects.toThrow('not match "hex64"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getTransactionByHash(TX_HASH);
  expect(call).toHaveBeenLastCalledWith('eth_getTransactionByHash', TX_HASH);

  call.mockRestore();
});

test('getTransactionReceipt', async () => {
  await expect(client.getTransactionReceipt()).rejects.toThrow('not match "hex"');
  await expect(client.getTransactionReceipt(ADDRESS)).rejects.toThrow('not match "hex64"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getTransactionReceipt(TX_HASH);
  expect(call).toHaveBeenLastCalledWith('eth_getTransactionReceipt', TX_HASH);

  call.mockRestore();
});

test('sendRawTransaction', async () => {
  await expect(client.sendRawTransaction()).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(client.provider, 'call');

  await client.sendRawTransaction('0x1ff');
  expect(call).toHaveBeenLastCalledWith('eth_sendRawTransaction', '0x01ff');

  await client.sendRawTransaction(Buffer.from([1, 255]));
  expect(call).toHaveBeenLastCalledWith('eth_sendRawTransaction', '0x01ff');

  call.mockRestore();
});

test('sendTransaction', async () => {
  const call = jest.spyOn(client.provider, 'call');
  await client.sendTransaction({
    from: ADDRESS,
    nonce: 100,
    gasPrice: '0x0abc',
    gas: 100,
    to: null,
    value: 0,
    storageLimit: 1000000,
    epochHeight: 200,
    chainId: 0,
    data: '0xabcd',
  }, PASSWORD);

  expect(call).toHaveBeenLastCalledWith('eth_sendTransaction', {
    from: ADDRESS,
    nonce: '0x64',
    gasPrice: '0xabc',
    gas: '0x64',
    to: null,
    value: '0x0',
    storageLimit: '0xf4240',
    epochHeight: '0xc8',
    chainId: '0x0',
    data: '0xabcd',
  }, PASSWORD);

  call.mockRestore();
});

// ------------------------------ contract ----------------------------------
test('getCode', async () => {
  await expect(client.getCode()).rejects.toThrow('not match regex');

  const call = jest.spyOn(client.provider, 'call');

  await client.getCode(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getCode', ADDRESS, undefined);

  await client.getCode(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getCode', ADDRESS, '0x0');

  call.mockRestore();
});

test('getCollateralForStorage', async () => {
  await expect(client.getCollateralForStorage()).rejects.toThrow('not match regex');

  const call = jest.spyOn(client.provider, 'call');

  await client.getCollateralForStorage(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getCollateralForStorage', ADDRESS, undefined);

  await client.getCollateralForStorage(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getCollateralForStorage', ADDRESS, '0x0');

  call.mockRestore();
});

test('call', async () => {
  await expect(client.call()).rejects.toThrow('undefined');

  const call = jest.spyOn(client.provider, 'call');
  await client.call({ from: ADDRESS, to: ADDRESS });
  expect(call).toHaveBeenLastCalledWith('eth_call', {
    from: ADDRESS,
    nonce: undefined,
    gasPrice: undefined,
    gas: undefined,
    storageLimit: undefined,
    to: ADDRESS,
    value: undefined,
    data: undefined,
    chainId: undefined,
    epochHeight: undefined,
  }, undefined);

  call.mockRestore();
});

test('estimateGas', async () => {
  await expect(client.estimateGas()).rejects.toThrow('undefined');

  const call = jest.spyOn(client.provider, 'call');
  await client.estimateGas({ to: ADDRESS });
  expect(call).toHaveBeenLastCalledWith('eth_estimateGas', {
    from: undefined,
    nonce: undefined,
    gasPrice: undefined,
    gas: undefined,
    storageLimit: undefined,
    to: ADDRESS,
    value: undefined,
    data: undefined,
    chainId: undefined,
    epochHeight: undefined,
  }, undefined);

  await client.estimateGas(
    {
      from: ADDRESS,
      to: ADDRESS,
      gas: '0x01',
      chainId: '0x01',
      value: 100,
      data: '0x',
    },
  );
  expect(call).toHaveBeenLastCalledWith('eth_estimateGas', {
    from: ADDRESS,
    nonce: undefined,
    gasPrice: undefined,
    gas: '0x1',
    storageLimit: undefined,
    to: ADDRESS,
    value: '0x64',
    data: '0x',
    chainId: '0x1',
    epochHeight: undefined,
  }, undefined);

  call.mockRestore();
});

test('getLogs', async () => {
  await expect(client.getLogs()).rejects.toThrow('Cannot read property');
  await expect(client.getLogs({ blockHashes: [], fromEpoch: 0 })).rejects.toThrow('OverrideError');
  await expect(client.getLogs({ topics: [[null]] })).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getLogs({});
  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: undefined,
    blockHashes: undefined,
    topics: undefined,
    limit: undefined,
  });

  await client.getLogs({
    blockHashes: BLOCK_HASH,
    address: ADDRESS,
    topics: [TX_HASH, null],
    limit: 100,
  });
  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: ADDRESS,
    blockHashes: BLOCK_HASH,
    topics: [TX_HASH, null],
    limit: '0x64',
  });

  await client.getLogs({
    blockHashes: [BLOCK_HASH, BLOCK_HASH],
    address: [ADDRESS, ADDRESS],
    topics: [[TX_HASH, TX_HASH], null],
    limit: 100,
  });
  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: [ADDRESS, ADDRESS],
    blockHashes: [BLOCK_HASH, BLOCK_HASH],
    topics: [[TX_HASH, TX_HASH], null],
    limit: '0x64',
  });

  call.mockRestore();
});

// ------------------------------- subscribe ----------------------------------
test('subscribe', async () => {
  const id = await client.subscribe('epochs');

  expect(id).toMatch(/^0x[\da-f]+$/);
});

test('subscribeEpochs', async () => {
  const call = jest.spyOn(client.provider, 'call');

  await client.subscribeEpochs();
  expect(call).toHaveBeenLastCalledWith('eth_subscribe', 'epochs');

  call.mockRestore();
});

test('subscribeNewHeads', async () => {
  const call = jest.spyOn(client.provider, 'call');

  await client.subscribeNewHeads();
  expect(call).toHaveBeenLastCalledWith('eth_subscribe', 'newHeads');

  call.mockRestore();
});

test('subscribeLogs', async () => {
  const call = jest.spyOn(client.provider, 'call');

  await client.subscribeLogs();
  expect(call).toHaveBeenLastCalledWith('eth_subscribe', 'logs', {});

  await client.subscribeLogs({
    address: ADDRESS,
    topics: [TX_HASH, null],
  });
  expect(call).toHaveBeenLastCalledWith('eth_subscribe', 'logs', {
    address: ADDRESS,
    topics: [TX_HASH, null],
  });

  await client.subscribeLogs({
    address: [ADDRESS, ADDRESS],
    topics: [[TX_HASH, TX_HASH], null],
  });
  expect(call).toHaveBeenLastCalledWith('eth_subscribe', 'logs', {
    address: [ADDRESS, ADDRESS],
    topics: [[TX_HASH, TX_HASH], null],
  });

  call.mockRestore();
});

test('unsubscribe', async () => {
  const result = await client.unsubscribe('');

  expect(lodash.isBoolean(result)).toEqual(true);
});
