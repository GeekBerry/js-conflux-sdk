const { Wei } = require('../src');

test('Wei.fromXXX', () => {
  expect(() => Wei.fromEther(null)).toThrow('Invalid number');
  expect(() => Wei.fromEther(-1)).toThrow('not match "bigUInt"');
  expect(Wei.fromEther(3.14).toString()).toEqual('3140000000000000000');
  expect(Wei.fromEther(1e-18).toString()).toEqual('1');
  expect(() => Wei.fromEther(1e-19)).toThrow('Cannot');

  expect(() => Wei.fromEther('')).toThrow('Invalid number');
  expect(Wei.fromEther('0.0').toString()).toEqual('0');
  expect(Wei.fromEther('0x0a').toString()).toEqual('10000000000000000000');
  expect(Wei.fromEther('1e-18').toString()).toEqual('1');
  expect(() => Wei.fromEther('1e-19')).toThrow('Cannot');

  expect(Wei.fromEther(1).toString()).toEqual('1000000000000000000');
  expect(Wei.fromMilliEther(1).toString()).toEqual('1000000000000000');
  expect(Wei.fromMicroEther(1).toString()).toEqual('1000000000000');
  expect(Wei.fromGWei(1).toString()).toEqual('1000000000');
  expect(Wei.fromMWei(1).toString()).toEqual('1000000');
  expect(Wei.fromKWei(1).toString()).toEqual('1000');
});

test('Wei', () => {
  expect(Wei('').toString()).toEqual('0');
  expect(Wei('0.0').toString()).toEqual('0');
  expect(Wei('0x0a').toString()).toEqual('10');
  expect(Wei(1e2).toString()).toEqual('100');
  expect((new Wei(1e2)).toString()).toEqual('100');

  expect(() => Wei()).toThrow('Cannot');
  expect(() => Wei(null)).toThrow('Cannot');
  expect(() => Wei(-1)).toThrow('not match "bigUInt"');
  expect(() => Wei(3.14)).toThrow('Cannot');
});

test('Wei.toXXX', () => {
  const drip = Wei.fromGWei(3.14);

  expect(drip.toString()).toEqual('3140000000');
  expect(drip.toKWei()).toEqual('3140000');
  expect(drip.toMWei()).toEqual('3140');
  expect(drip.toGWei()).toEqual('3.14');
  expect(drip.toMicroEther()).toEqual('0.00314');
  expect(drip.toMilliEther()).toEqual('0.00000314');
  expect(drip.toEther()).toEqual('0.00000000314');

  expect(JSON.stringify(drip)).toEqual('"3140000000"');
});
