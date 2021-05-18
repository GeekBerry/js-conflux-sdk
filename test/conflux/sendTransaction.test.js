const JSBI = require('../../src/util/jsbi');
const { Ethereum, format, CONST } = require('../../src');
const { MockProvider } = require('../../mock');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0x0123456789012345678901234567890123456789';
const PASSWORD = 'password';

// ----------------------------------------------------------------------------
const client = new Ethereum({});
client.provider = new MockProvider();
const account = client.wallet.addPrivateKey(PRIVATE_KEY);

test('sendTransaction error', async () => {
  await expect(client.sendTransaction()).rejects.toThrow('Cannot read property');
});

test('sendTransaction remote', async () => {
  // const call = jest.spyOn(client.provider, 'call');
  //
  // expect(client.wallet.has(ADDRESS)).toEqual(false);
  //
  // await client.sendTransaction({}, PASSWORD);
  // expect(call).toHaveBeenLastCalledWith('eth_sendTransaction', {}, PASSWORD);
  //
  // await client.sendTransaction({
  //   from: ADDRESS,
  //   gasPrice: 10,
  //   gas: format.bigUInt(1024),
  //   storageLimit: format.bigUInt(2048),
  // }, PASSWORD);
  //
  // expect(call).toHaveBeenLastCalledWith('eth_sendTransaction', {
  //   from: ADDRESS,
  //   gasPrice: '0xa',
  //   gas: '0x400',
  //   storageLimit: '0x800',
  // }, PASSWORD);
  //
  // call.mockRestore();
});

test('sendTransaction local', async () => {
  const call = jest.spyOn(client.provider, 'call');

  await client.sendTransaction({
    from: account,
    to: account,
    nonce: 100,
    gasPrice: 10,
    gas: format.bigUInt(1024),
    value: 0,
    chainId: 1,
    data: undefined,
  });

  expect(call).toHaveBeenLastCalledWith('eth_sendRawTransaction', '0xf85f640a82520894fcad0b19bb29d4674531d6f115237e16afce377c808026a0bc73fd0eb4e7acd990f0ccbf69ffa884169b5583ee0eb37fe6103440a7efb232a05a328b08fac46973429e7e0f2f5398eb314faea1213678e6cdc9edb47d8f9063');

  call.mockRestore();
});

test('sendTransaction defaultGasPrice', async () => {
  const signTransaction = jest.spyOn(account, 'signTransaction');

  client.defaultGasPrice = 1;

  await client.sendTransaction({
    from: account,
    nonce: 100,
    gasPrice: undefined,
    gasLimit: format.bigUInt(1024),
    storageLimit: format.bigUInt(2048),
    epochHeight: 1000,
    chainId: 1,
  });

  expect(signTransaction).toHaveBeenLastCalledWith({
    from: account,
    nonce: 100,
    gasPrice: client.defaultGasPrice,
    gasLimit: format.bigUInt(1024),
    to: undefined,
    value: undefined,
    storageLimit: format.bigUInt(2048),
    epochHeight: 1000,
    chainId: 1,
    data: undefined,
  });

  signTransaction.mockRestore();
  client.defaultGasPrice = undefined;
});

test('sendTransaction gasPrice:0', async () => {
  const signTransaction = jest.spyOn(account, 'signTransaction');

  const getGasPrice = jest.spyOn(client, 'getGasPrice');
  getGasPrice.mockReturnValue(JSBI.BigInt(0));

  await client.sendTransaction({
    from: account,
    nonce: 100,
    gasPrice: undefined,
    gasLimit: format.bigUInt(1024),
    chainId: 1,
  });

  expect(signTransaction).toHaveBeenLastCalledWith({
    from: account,
    nonce: 100,
    gasLimit: JSBI.BigInt(1024),
    gasPrice: JSBI.BigInt(0),
    to: undefined,
    value: undefined,
    chainId: 1,
    data: undefined,
  });

  getGasPrice.mockRestore();
  signTransaction.mockRestore();
});

test('sendTransaction auto', async () => {
  const getTransactionCount = jest.spyOn(client, 'getTransactionCount');
  getTransactionCount.mockReturnValue('100');

  const getChainId = jest.spyOn(client, 'getChainId');
  getChainId.mockReturnValue(1);

  const getGasPrice = jest.spyOn(client, 'getGasPrice');
  getGasPrice.mockReturnValue('10');

  const estimateGas = jest.spyOn(client, 'estimateGas');
  estimateGas.mockReturnValue(format.bigUInt(1024));

  const call = jest.spyOn(client.provider, 'call');
  const signTransaction = jest.spyOn(account, 'signTransaction');

  await client.sendTransaction({
    from: account.address,
    to: account.address,
  });
  expect(getTransactionCount).toHaveBeenCalledTimes(1);
  expect(getChainId).toHaveBeenCalledTimes(1);
  expect(getGasPrice).toHaveBeenCalledTimes(1);
  expect(estimateGas).toHaveBeenCalledTimes(0);
  expect(signTransaction).toHaveBeenLastCalledWith({
    chainId: 1,
    from: account.address,
    to: account.address,
    gasLimit: CONST.TRANSACTION_GAS,
    gasPrice: '10',
    nonce: '100',
  });

  await client.sendTransaction({
    from: account.address,
    data: '0xabcd',
  });
  expect(getTransactionCount).toHaveBeenCalledTimes(2);
  expect(getChainId).toHaveBeenCalledTimes(2);
  expect(getGasPrice).toHaveBeenCalledTimes(2);
  expect(estimateGas).toHaveBeenCalledTimes(1);
  expect(signTransaction).toHaveBeenLastCalledWith({
    chainId: 1,
    from: account.address,
    gasLimit: JSBI.BigInt(1024),
    gasPrice: '10',
    nonce: '100',
    data: '0xabcd',
  });

  await client.sendTransaction({
    from: account.address,
    gasLimit: 1000,
    data: '0xabcd',
  });
  expect(estimateGas).toHaveBeenCalledTimes(1);
  expect(signTransaction).toHaveBeenLastCalledWith({
    chainId: 1,
    from: account.address,
    gasLimit: 1000,
    gasPrice: '10',
    nonce: '100',
    data: '0xabcd',
  });

  await client.sendTransaction({
    from: account.address,
    data: '0xabcd',
  });
  expect(estimateGas).toHaveBeenCalledTimes(2);
  expect(signTransaction).toHaveBeenLastCalledWith({
    chainId: 1,
    from: account.address,
    gasLimit: JSBI.BigInt(1024),
    gasPrice: '10',
    nonce: '100',
    data: '0xabcd',
  });

  signTransaction.mockRestore();
  call.mockRestore();
  estimateGas.mockRestore();
  getGasPrice.mockRestore();
  getChainId.mockRestore();
  getTransactionCount.mockRestore();
});
