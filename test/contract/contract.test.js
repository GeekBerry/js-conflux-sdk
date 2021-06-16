const JSBI = require('../../src/util/jsbi');
const { Ethereum, Contract, format, CONST } = require('../../src');
const { MockProvider } = require('../../mock');
const { abi, bytecode, address } = require('./contract.json');
const ContractConstructor = require('../../src/contract/method/ContractConstructor');

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';
const HEX64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// ----------------------------------------------------------------------------
const client = new Ethereum();
client.provider = new MockProvider();

const contract = client.Contract({ abi, bytecode, address });

test('without code', async () => {
  const contractWithoutCode = new Contract({ abi, address });
  expect(() => contractWithoutCode.constructor(100)).toThrow('bytecode is empty');
});

test('with empty abi', () => {
  const contractWithEmptyABI = new Contract({ abi: [], address });
  expect(contractWithEmptyABI.constructor instanceof ContractConstructor).toEqual(true);
});

test('Contract', async () => {
  let value;

  expect(contract.address).toEqual(address);
  expect(contract.constructor.bytecode).toEqual(bytecode);

  value = await contract.constructor(100);
  expect(value.startsWith('0x')).toEqual(true);

  value = await contract.count();
  expect(value.toString()).toEqual('100');

  value = await contract.inc(0).call({ from: ADDRESS, nonce: 0 });
  expect(value.toString()).toEqual('100');
});

test('contract.call', async () => {
  const call = jest.spyOn(client.provider, 'call');
  call.mockReturnValueOnce('0x00000000000000000000000000000000000000000000000000000000000000ff');

  const value = await contract.count();
  expect(value.toString()).toEqual('255');

  expect(call).toHaveBeenLastCalledWith('eth_call', {
    to: address,
    data: '0x06661abd',
  }, CONST.BLOCK_NUMBER.LATEST);

  const error = new Error();
  error.data = '0x08c379a0' +
    '0000000000000000000000000000000000000000000000000000000000000020' +
    '0000000000000000000000000000000000000000000000000000000000000005' +
    '4552524f52000000000000000000000000000000000000000000000000000000';
  call.mockRejectedValueOnce(error);
  await expect(contract.count()).rejects.toThrow('ERROR');

  call.mockReturnValueOnce('0x0');
  await expect(contract.count()).rejects.toThrow('length not match');

  call.mockRestore();
});

test('contract.call catch', async () => {
  const call = jest.spyOn(client.provider, 'call');

  call.mockReturnValueOnce('0x00000000000000000000000000000000000000000000000000000000000000ff');
  const value = await contract.count().catch(v => v);
  expect(`${value}`).toEqual('255');

  call.mockRejectedValueOnce(new Error('XXX'));
  const error = await contract.count().catch(v => v);
  expect(error.message).toEqual('XXX');

  call.mockRestore();
});

test('contract.call finally', async () => {
  const call = jest.spyOn(client.provider, 'call');

  let called;

  called = false;
  await contract.count().finally(() => {
    called = true;
  });
  expect(called).toEqual(true);

  called = false;
  call.mockRejectedValueOnce(new Error('XXX'));
  await expect(
    contract.count().finally(() => {
      called = true;
    }),
  ).rejects.toThrow('XXX');
  expect(called).toEqual(true);

  call.mockRestore();
});

test('contract.estimateGas', async () => {
  const call = jest.spyOn(client.provider, 'call');

  await contract.count().estimateGas({});

  expect(call).toHaveBeenLastCalledWith('eth_estimateGas', {
    to: address,
    data: '0x06661abd',
  }, CONST.BLOCK_NUMBER.LATEST);

  call.mockRestore();
});

test('contract.sendTransaction', async () => {
  // const call = jest.spyOn(conflux.provider, 'call');
  //
  // await contract.count().sendTransaction({ from: ADDRESS, gasPrice: 0, gas: 0, storageLimit: 0 });
  //
  // expect(call).toHaveBeenLastCalledWith('eth_sendTransaction', {
  //   from: ADDRESS,
  //   to: address,
  //   data: '0x06661abd',
  //   gasPrice: '0x0',
  //   gas: '0x0',
  // }, undefined);
  //
  // call.mockRestore();
});

test('contract.getLogs', async () => {
  const call = jest.spyOn(client.provider, 'call');

  const topics = [format.keccak256('StringEvent(string)'), format.keccak256('string')];
  call.mockReturnValueOnce([
    {
      blockNumber: '0x0',
      logIndex: '0x0',
      transactionIndex: '0x0',
      transactionLogIndex: '0x0',
      topics,
      data: '0x',
    },
  ]);

  const result = await contract.StringEvent('string').getLogs();
  expect(result[0].arguments).toEqual([topics[1]]);

  expect(call).toHaveBeenLastCalledWith('eth_getLogs', {
    address,
    topics,
  });

  call.mockRestore();
});

test('contract.override', () => {
  expect(contract.override(Buffer.from('bytes')).method.type).toEqual('override(bytes)');

  expect(() => contract.override('str')).toThrow('can not determine override "override(bytes)|override(string)" with args (str)');
  expect(contract['override(string)']('str').method.type).toEqual('override(string)');
  expect(contract['0x227ffd52']('str').method.type).toEqual('override(string)');

  expect(() => contract.override(100)).toThrow('can not match override "override(bytes)|override(string)|override(uint256,string)" with args (100)');

  let event;

  expect(() => contract.OverrideEvent()).toThrow('can not match override "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args ()');

  event = contract.OverrideEvent('str');
  expect(event).toEqual({
    address,
    topics: [
      format.keccak256('OverrideEvent(string)'),
      format.keccak256('str'),
    ],
    data: '0x',
  });

  event = contract.OverrideEvent(Buffer.from('bytes'));
  expect(event).toEqual({
    address,
    topics: [
      format.keccak256('OverrideEvent(bytes)'),
      format.keccak256('bytes'),
    ],
    data: '0x',
  });

  event = contract.OverrideEvent(100, null);
  expect(event).toEqual({
    address,
    topics: [
      format.keccak256('OverrideEvent(uint256,string)'),
      '0x0000000000000000000000000000000000000000000000000000000000000064',
    ],
  });

  expect(() => contract.OverrideEvent(100)).toThrow('can not match override "OverrideEvent(bytes),OverrideEvent(string),OverrideEvent(uint256,string)" with args (100)');
  expect(() => contract.OverrideEvent(null)).toThrow('can not determine override "OverrideEvent(bytes)|OverrideEvent(string)" with args ()');

  event = contract.OverrideEvent(null, null);
  expect(event).toEqual({
    address,
    topics: [
      format.keccak256('OverrideEvent(uint256,string)'),
      null,
    ],
  });

  const result = contract.OverrideEvent.decodeLog({
    topics: [
      format.keccak256('OverrideEvent(string)'),
      format.keccak256('str'),
    ],
    data: '0x',
  });
  expect(result[0]).toEqual(format.keccak256('str'));
});

test('contract.StringEvent', () => {
  const { topics } = contract.StringEvent('string');
  expect(topics).toEqual([
    format.keccak256('StringEvent(string)'),
    format.keccak256('string'),
  ]);

  const result = contract.abi.decodeLog({ data: '0x', topics });
  expect(result).toEqual({
    name: 'StringEvent',
    type: 'StringEvent(string)',
    signature: '0x617cf8a4400dd7963ed519ebe655a16e8da1282bb8fea36a21f634af912f54ab',
    arguments: [format.keccak256('string')],
  });
});

test('contract.ArrayEvent', () => {
  const { topics } = contract.ArrayEvent(HEX64);
  expect(topics).toEqual([
    format.keccak256('ArrayEvent(string[3])'),
    HEX64,
  ]);

  expect(() => contract.ArrayEvent(['a', 'b', 'c'])).toThrow('not supported encode array to index');

  const result = contract.abi.decodeLog({ data: '0x', topics });
  expect(result).toEqual({
    name: 'ArrayEvent',
    type: 'ArrayEvent(string[3])',
    signature: '0xf0649dda320ad8f215db285953bf6fe6d78d3c6daf333e1df5efe1ba4b6af7b1',
    arguments: [HEX64],
  });
});

test('contract.StructEvent', () => {
  const { topics } = contract.StructEvent(HEX64);
  expect(topics).toEqual([
    format.keccak256('StructEvent((string,int32))'),
    HEX64,
  ]);

  expect(() => contract.StructEvent(['Tom', 18])).toThrow('not supported encode tuple to index');

  const result = contract.abi.decodeLog({ data: '0x', topics });
  expect(result).toEqual({
    name: 'StructEvent',
    type: 'StructEvent((string,int32))',
    signature: '0x7d981fdb9aef6924cc36d62bd0e5f0412d0ab59392f22611254d824379a79e4f',
    arguments: [HEX64],
  });
});

test('decodeData.constructor', () => {
  const data = contract.constructor(50).data;

  const result = contract.abi.decodeData(data);
  expect(result).toEqual({
    name: 'constructor',
    type: 'constructor(uint256)',
    signature: '',
    arguments: [JSBI.BigInt(50)],
  });
});

test('decodeData.function', () => {
  const data = contract.inc(100).data;

  const result = contract.abi.decodeData(data);
  expect(result).toEqual({
    name: 'inc',
    type: 'inc(uint256)',
    signature: '0x812600df',
    arguments: [JSBI.BigInt(100)],
  });

  expect(contract.abi.decodeData('0x')).toEqual(undefined);
});

test('decodeData.override', () => {
  const data = contract.override(Buffer.from('bytes')).data;

  const tuple = contract.override.decodeData(data);

  expect(tuple[0]).toEqual(Buffer.from('bytes'));
});

test('decodeLog', () => {
  const log = {
    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
    topics: [
      '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      '0x000000000000000000000000a000000000000000000000000000000000000001',
    ],
  };

  const result = contract.abi.decodeLog(log);
  expect(result).toEqual({
    name: 'SelfEvent',
    type: 'SelfEvent(address,uint256)',
    signature: '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
    arguments: [
      '0xa000000000000000000000000000000000000001',
      JSBI.BigInt(100),
    ],
  });

  expect(contract.abi.decodeLog({ topics: [] })).toEqual(undefined);
});
