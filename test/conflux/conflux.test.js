const Conflux = require('../../src');

// ----------------------------------------------------------------------------

test('constructor()', async () => {
  const cfx = new Conflux();

  expect(cfx.provider.constructor.name).toEqual('BaseProvider');

  await expect(cfx.provider.call()).rejects.toThrow('call not implement');
});

test('constructor({...})', () => {
  const cfx = new Conflux({
    url: 'http://localhost:12537',
  });

  expect(cfx.provider.constructor.name).toEqual('HttpProvider');
});

test('cfx.setProvider', () => {
  const cfx = new Conflux();

  expect(cfx.provider.constructor.name).toEqual('BaseProvider');
  expect(cfx.provider.timeout).toEqual(5 * 60 * 1000);

  cfx.setProvider('http://localhost:80', { timeout: 30 * 1000 });
  expect(cfx.provider.constructor.name).toEqual('HttpProvider');
  expect(cfx.provider.timeout).toEqual(30 * 1000);

  cfx.setProvider('http://localhost:80', { timeout: 60 * 1000 });
  expect(cfx.provider.constructor.name).toEqual('HttpProvider');
  expect(cfx.provider.timeout).toEqual(60 * 1000);

  cfx.setProvider('');
  expect(cfx.provider.constructor.name).toEqual('BaseProvider');
  expect(cfx.provider.timeout).toEqual(60 * 1000);

  expect(() => cfx.setProvider()).toThrow('url must be string');
});

test('cfx.close', () => {
  const cfx = new Conflux();
  cfx.close();

  cfx.provider = undefined;
  cfx.close();
});
