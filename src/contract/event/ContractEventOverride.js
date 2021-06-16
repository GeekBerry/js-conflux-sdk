const lodash = require('lodash');
const callable = require('../../util/callable');

class ContractEventOverride {
  constructor(events, contract, client) {
    this.events = events;
    this.contract = contract;
    this.client = client;
    this.name = lodash.first(events).name;
    // XXX: assert all of event should have same name

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];

    let filter;
    for (const event of this.events) {
      try {
        filter = event(...args);
        acceptArray.push(event.type);
      } catch (e) {
        rejectArray.push(event.type);
      }
    }

    if (!acceptArray.length) {
      throw new Error(`can not match override "${rejectArray.join(',')}" with args (${args.join(',')})`);
    }
    if (acceptArray.length > 1) {
      throw new Error(`can not determine override "${acceptArray.join('|')}" with args (${args.join(',')})`);
    }

    return filter;
  }

  decodeLog(log) {
    const signatureToEvent = lodash.keyBy(this.events, 'signature');

    const signature = log.topics[0];
    const event = signatureToEvent[signature];
    return event.decodeLog(log);
  }
}

module.exports = ContractEventOverride;
