const Transaction = require('../src/Transaction');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

test('Transaction', () => {
  const tx = new Transaction({
    nonce: 0,
    gasPrice: 1,
    gas: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
  });

  expect(tx.nonce).toEqual(0);
  expect(tx.gasPrice).toEqual(1);
  expect(tx.gas).toEqual(21000);
  expect(tx.to).toEqual('0x0123456789012345678901234567890123456789');
  expect(tx.value).toEqual(0);
  expect(tx.data).toEqual(undefined);
  expect(tx.r).toEqual(undefined);
  expect(tx.s).toEqual(undefined);
  expect(tx.v).toEqual(undefined);
  expect(tx.from).toEqual(undefined); // virtual attribute
  expect(tx.hash).toEqual(undefined); // virtual attribute

  tx.sign(KEY);

  expect(tx.r).toEqual('0x489153a772628dd224e516f5231740a526dd4a7af90fe6d9b270286cb8cf2d68');
  expect(tx.s).toEqual('0x40d27551b593ffba7a69a997690fc0461aed760a78236d4ed33e26c9c1a7c97b');
  expect(tx.v).toEqual(0);
  expect(tx.from).toEqual(ADDRESS);
  expect(tx.hash).toEqual('0x449fce992f97790a1f10d7c703658ad3c1246a01fb3e52a5e0cd2915da67520b');
  expect(tx.recover()).toEqual('0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559');
  expect(tx.serialize()).toEqual('0xf860dc8001825208940123456789012345678901234567890123456789808080a0489153a772628dd224e516f5231740a526dd4a7af90fe6d9b270286cb8cf2d68a040d27551b593ffba7a69a997690fc0461aed760a78236d4ed33e26c9c1a7c97b');

  tx.value = 1;
  expect(tx.from).not.toEqual(ADDRESS);
});
