const Conflux = require('../../src');
const sign = require('../../src/util/sign');
const format = require('../../src/util/format');
const { MockProvider } = require('../../mock');
const { abi, code, address } = require('./contract.json');

const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';
const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// ----------------------------------------------------------------------------
const cfx = new Conflux({
  defaultGasPrice: 100,
  defaultGas: 1000000,
});
cfx.provider = new MockProvider();

const contract = cfx.Contract({ abi, code, address });

test('without code', async () => {
  const contractWithoutCode = cfx.Contract({ abi, address });
  expect(() => contractWithoutCode.constructor(100)).toThrow('contract.constructor.code is empty');
});

test('without constructor', () => {
  expect(() => cfx.Contract({ abi: [], address })).toThrow('contract "constructor" abi is missing');
});

test('Contract', async () => {
  let value;

  expect(contract.address).toEqual(address);
  expect(contract.constructor.code).toEqual(code);

  const { contractCreated } = await contract.constructor(100).sendTransaction({ from: ADDRESS, nonce: 0 }).confirmed();
  expect(contractCreated === null || contractCreated.startsWith('0x')).toEqual(true);

  value = await contract.constructor(100);
  expect(value.startsWith('0x')).toEqual(true);

  value = await contract.count();
  expect(value.toString()).toEqual('100');

  value = await contract.inc(0).call({ from: ADDRESS, nonce: 0 });
  expect(value.toString()).toEqual('100');

  value = await contract.count().estimateGas({ gasPrice: 101 });
  expect(value.constructor).toEqual(BigInt);

  const logs = await contract.SelfEvent(ADDRESS).getLogs({ fromEpoch: 0 }); // `fromEpoch` for mock parse
  expect(logs.length).toEqual(2);

  const iter = contract.SelfEvent(undefined, 10).getLogs({ toEpoch: 0x00 });
  expect(Boolean(await iter.next())).toEqual(true);
  expect(Boolean(await iter.next())).toEqual(true);
  expect(Boolean(await iter.next())).toEqual(false);
});

test('contract.StringEvent', () => {
  const string = 'string';
  const index = format.hex(sign.sha3(string));

  const { topics } = contract.StringEvent(string);

  expect(topics.length).toEqual(2);
  expect(topics[0]).toEqual(contract.StringEvent.code);
  expect(topics[1]).toEqual(format.hex(sign.sha3(string)));

  const params = contract.StringEvent.decode({ data: '0x', topics });
  expect(params.length).toEqual(1);
  expect(params[0]).toEqual(index);
});

test('contract.ArrayEvent', () => {
  const { topics } = contract.ArrayEvent(HEX_64);

  expect(topics.length).toEqual(2);
  expect(topics[0]).toEqual(contract.ArrayEvent.code);
  expect(topics[1]).toEqual(HEX_64);
  expect(() => contract.ArrayEvent(['a', 'b', 'c'])).toThrow('not supported encode');

  const params = contract.ArrayEvent.decode({ data: '0x', topics });
  expect(params.length).toEqual(1);
  expect(params[0]).toEqual(HEX_64);
});

test('contract.StructEvent', () => {
  const { topics } = contract.StructEvent(HEX_64);

  expect(topics.length).toEqual(2);
  expect(topics[0]).toEqual(contract.StructEvent.code);
  expect(topics[1]).toEqual(HEX_64);

  expect(() => contract.StructEvent(['Tom', 18])).toThrow('not supported encode');

  const params = contract.StructEvent.decode({ data: '0x', topics });
  expect(params.length).toEqual(1);
  expect(params[0]).toEqual(HEX_64);
});

test('decodeData.constructor', () => {
  const data = contract.constructor(50).data;

  const value = contract.abi.decodeData(data);
  expect(value.name).toEqual('constructor');
  expect(value.params.length).toEqual(1);
  expect(value.params[0]).toEqual(BigInt(50));
});

test('decodeData.function', () => {
  const data = contract.inc(100).data;

  const value = contract.abi.decodeData(data);
  expect(value.name).toEqual('inc');
  expect(value.params.length).toEqual(1);
  expect(value.params[0]).toEqual(BigInt(100));

  expect(contract.abi.decodeData('0x')).toEqual(undefined);
});

test('decodeLog', () => {
  const log = {
    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
    topics: [
      '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      '0x000000000000000000000000a000000000000000000000000000000000000001',
    ],
  };

  const value = contract.abi.decodeLog(log);
  expect(value.name).toEqual('SelfEvent');
  expect(value.params.length).toEqual(2);
  expect(value.params[0]).toEqual('0xa000000000000000000000000000000000000001');
  expect(value.params[1]).toEqual(BigInt(100));

  expect(contract.abi.decodeLog({ topics: [] })).toEqual(undefined);
});
