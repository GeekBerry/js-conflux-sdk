const { Ethereum } = require('../../src');
const MockProvider = require('../../mock/MockProvider');

const client = new Ethereum({
  defaultGasPrice: 1000000,
});
client.provider = new MockProvider();

test('PendingTransaction', async () => {
  const getTransactionByHash = jest.spyOn(client, 'getTransactionByHash');
  getTransactionByHash
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ blockHash: 'blockHash' });

  const getTransactionReceipt = jest.spyOn(client, 'getTransactionReceipt');
  getTransactionReceipt
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ status: 1, contractCreated: 'address' });

  const pending = client.sendRawTransaction('0x');

  expect((await pending).startsWith('0x')).toEqual(true);
  expect(await pending.mined({ delta: 0 })).toEqual({ blockHash: 'blockHash' });
  expect(await pending.executed({ delta: 0 })).toEqual({ status: 1, contractCreated: 'address' });

  getTransactionByHash.mockRestore();
  getTransactionReceipt.mockRestore();
});

test('PendingTransaction failed', async () => {
  client.getTransactionByHash = jest.fn();
  client.getTransactionByHash.mockResolvedValue({ blockHash: 'blockHash' });

  client.getTransactionReceipt = jest.fn();
  client.getTransactionReceipt.mockResolvedValue({ status: 0 });

  const pending = client.sendRawTransaction('0x');

  await expect(pending.executed()).rejects.toThrow('executed failed, status 0');
});

test('PendingTransaction catch', async () => {
  const call = jest.spyOn(client.provider, 'call');

  const hash = await client.sendRawTransaction('0x').catch(v => v);
  expect(hash).toMatch(/0x.{64}/);

  call.mockRejectedValueOnce(new Error('XXX'));
  const e = await client.sendRawTransaction('0x').catch(v => v);
  expect(e.message).toEqual('XXX');

  call.mockRestore();
});

test('PendingTransaction finally', async () => {
  const call = jest.spyOn(client.provider, 'call');
  let called;

  called = false;
  await client.sendRawTransaction('0x').finally(() => {
    called = true;
  });
  expect(called).toEqual(true);

  called = false;
  call.mockRejectedValueOnce(new Error('XXX'));
  await expect(
    client.sendRawTransaction('0x').finally(() => {
      called = true;
    }),
  ).rejects.toThrow('XXX');
  expect(called).toEqual(true);

  call.mockRestore();
});
