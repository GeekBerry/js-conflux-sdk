const { Transaction } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c';

test('Transaction', () => {
  const transaction = new Transaction({
    nonce: 0,
    gasPrice: 1,
    gasLimit: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
    storageLimit: 0,
    epochHeight: 0,
    chainId: 0,
  });

  expect(transaction.nonce).toEqual(0);
  expect(transaction.gasPrice).toEqual(1);
  expect(transaction.gasLimit).toEqual(21000);
  expect(transaction.to).toEqual('0x0123456789012345678901234567890123456789');
  expect(transaction.value).toEqual(0);
  expect(transaction.chainId).toEqual(0);
  expect(transaction.data).toEqual(undefined);
  expect(transaction.r).toEqual(undefined);
  expect(transaction.s).toEqual(undefined);
  expect(transaction.v).toEqual(undefined);
  expect(transaction.from).toEqual(undefined); // virtual attribute
  expect(transaction.hash).toEqual(undefined); // virtual attribute

  transaction.sign(KEY);

  expect(transaction.r).toEqual('0xa370e3562713fb50513ff5d77f18a7dffe7588d3d05413d28211e300a262c7ee');
  expect(transaction.s).toEqual('0x784961a41aba10dfd5d97193d6c35bfc50a15030254bc91ae5a85df6d79d77b1');
  expect(transaction.v).toEqual(35);
  expect(transaction.from).toEqual(ADDRESS);
  expect(transaction.hash).toEqual('0xd2f8b8b3217493cde2a3994fc9171b11f4830525be9df79c7c136e12cbc5b5a0');
  expect(transaction.recover()).toEqual('0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559');
  expect(transaction.serialize()).toEqual('0xf85f8001825208940123456789012345678901234567890123456789808023a0a370e3562713fb50513ff5d77f18a7dffe7588d3d05413d28211e300a262c7eea0784961a41aba10dfd5d97193d6c35bfc50a15030254bc91ae5a85df6d79d77b1');
});

test('s starts with 0x00', () => {
  const transaction = new Transaction({
    nonce: 127,
    gasPrice: 1,
    gasLimit: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
    chainId: 0,
  });

  transaction.sign(KEY);

  expect(transaction.s).toEqual('0x004a7de333450a596f51dcdc67272f0005ead211645af2dc6d0a9be4688b26c1');
  expect(transaction.serialize()).toEqual('0xf85f7f01825208940123456789012345678901234567890123456789808024a07eab45f2aa3366c28b78f206fac37aac9549a92fa53e7e773be7b73d882d134fa0004a7de333450a596f51dcdc67272f0005ead211645af2dc6d0a9be4688b26c1');
});
