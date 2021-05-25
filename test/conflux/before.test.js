const lodash = require('lodash');
const { Ethereum } = require('../../src');
const { MockProvider } = require('../../mock');

const ADDRESS = '0x1Cad0B19bB29d4674531d6f115237E16afce377C';
const BLOCK_HASH = '0xe0b0000000000000000000000000000000000000000000000000000000000000';
const TX_HASH = '0xb0a0000000000000000000000000000000000000000000000000000000000000';

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
  expect(call).toHaveBeenLastCalledWith('eth_getBalance', ADDRESS, 'latest');

  await client.getBalance(ADDRESS, 'latest');
  expect(call).toHaveBeenLastCalledWith('eth_getBalance', ADDRESS, 'latest');

  await client.getBalance(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getBalance', ADDRESS, '0x0');

  call.mockRestore();
});

test('getTransactionCount', async () => {
  await expect(client.getTransactionCount()).rejects.toThrow('not match "address"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getTransactionCount(ADDRESS, 'latest');
  expect(call).toHaveBeenLastCalledWith('eth_getTransactionCount', ADDRESS, 'latest');

  await client.getTransactionCount(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getTransactionCount', ADDRESS, '0x0');

  call.mockRestore();
});

// -------------------------------- block -----------------------------------
test('getBlockByNumber', async () => {
  await expect(client.getBlockByNumber()).rejects.toThrow('Cannot convert undefined to a BigInt');
  await expect(client.getBlockByNumber(0, 1)).rejects.toThrow('not match "boolean"');

  const call = jest.spyOn(client.provider, 'call');
  call.mockReturnValue(null);

  await client.getBlockByNumber('latest', false);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByNumber', 'latest', false);

  await client.getBlockByNumber(0, true);
  expect(call).toHaveBeenLastCalledWith('eth_getBlockByNumber', '0x0', true);

  call.mockRestore();
});

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

// test('sendTransaction', async () => {
//   const call = jest.spyOn(client.provider, 'call');
//   await client.sendTransaction({
//     from: ADDRESS,
//     nonce: 100,
//     gasPrice: '0x0abc',
//     gas: 100,
//     to: null,
//     value: 0,
//     storageLimit: 1000000,
//     epochHeight: 200,
//     chainId: 0,
//     data: '0xabcd',
//   }, PASSWORD);
//
//   expect(call).toHaveBeenLastCalledWith('eth_sendTransaction', {
//     from: ADDRESS,
//     nonce: '0x64',
//     gasPrice: '0xabc',
//     gas: '0x64',
//     to: null,
//     value: '0x0',
//     storageLimit: '0xf4240',
//     epochHeight: '0xc8',
//     chainId: '0x0',
//     data: '0xabcd',
//   }, PASSWORD);
//
//   call.mockRestore();
// });

// ------------------------------ contract ----------------------------------
test('getCode', async () => {
  await expect(client.getCode()).rejects.toThrow('not match "address"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getCode(ADDRESS);
  expect(call).toHaveBeenLastCalledWith('eth_getCode', ADDRESS, 'latest');

  await client.getCode(ADDRESS, 0);
  expect(call).toHaveBeenLastCalledWith('eth_getCode', ADDRESS, '0x0');

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
  }, 'latest');

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
    gasLimit: undefined,
    to: ADDRESS,
    value: undefined,
    data: undefined,
  }, 'latest');

  await client.estimateGas(
    {
      from: ADDRESS,
      to: ADDRESS,
      gasLimit: '0x01',
      value: 100,
      data: '0x',
    },
  );
  expect(call).toHaveBeenLastCalledWith('eth_estimateGas', {
    from: ADDRESS,
    nonce: undefined,
    gasPrice: undefined,
    gasLimit: '0x1',
    to: ADDRESS,
    value: '0x64',
    data: '0x',
  }, 'latest');

  call.mockRestore();
});

test('getLogs', async () => {
  await expect(client.getLogs()).rejects.toThrow('got undefined');
  await expect(client.getLogs({ topics: [[null]] })).rejects.toThrow('not match "hex"');

  const call = jest.spyOn(client.provider, 'call');

  await client.getLogs({});
  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: undefined,
    blockHashes: undefined,
    topics: undefined,
  });

  await client.getLogs({
    blockHash: BLOCK_HASH,
    address: ADDRESS,
    topics: [TX_HASH, null],
  });
  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    fromBlock: undefined,
    toBlock: undefined,
    address: ADDRESS,
    blockHash: BLOCK_HASH,
    topics: [TX_HASH, null],
  });

  await client.getLogs({
    address: [ADDRESS, ADDRESS],
    topics: [[TX_HASH, TX_HASH], null],
  });
  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    fromEpoch: undefined,
    toEpoch: undefined,
    address: [ADDRESS, ADDRESS],
    blockHashes: undefined,
    topics: [[TX_HASH, TX_HASH], null],
  });

  call.mockRestore();
});

// ------------------------------- subscribe ----------------------------------
test('subscribe', async () => {
  const id = await client.subscribe('epochs');

  expect(id).toMatch(/^0x[\da-f]+$/);
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
