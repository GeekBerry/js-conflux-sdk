const lodash = require('lodash');

function mergeTopic(array) {
  const set = new Set(array);
  if (set.has(undefined)) {
    return undefined;
  }
  if (set.has(null)) {
    return null;
  }
  if (set.size === 1) {
    return lodash.first([...set]);
  }
  return [...set];
}

class LogFilter {
  static concat(filterArray, event) {
    const address = mergeTopic(filterArray.map(filter => filter.address));

    const topics = lodash
      .unzip(filterArray.map(filter => filter.topics))
      .map(mergeTopic)
      .filter(v => v !== undefined);

    return new this({ address, topics }, event);
  }

  constructor({ address, topics, data }, event) {
    this.address = address;
    this.topics = topics;
    this.data = data;
    Reflect.defineProperty(this, 'event', { value: event }); // XXX: use defineProperty to avoid from JSON.stringify
  }

  async getLogs(options = {}) {
    const logs = await this.event.client.getLogs({ ...this, ...options });

    logs.forEach(log => {
      const object = this.event.contract.abi.decodeLog(log);
      lodash.defaults(log, object);
    });

    return logs;
  }

  async subscribeLogs(options = {}) {
    const subscription = await this.event.client.subscribeLogs({ ...this, ...options });

    subscription.on('data', log => {
      const object = this.event.contract.abi.decodeLog(log);
      lodash.defaults(log, object);
    });

    return subscription;
  }
}

module.exports = LogFilter;
