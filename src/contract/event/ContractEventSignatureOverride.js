const lodash = require('lodash');
const callable = require('../../util/callable');
const LogFilter = require('./LogFilter');
const ContractEventOverride = require('./ContractEventOverride');

class ContractEventSignatureOverride extends ContractEventOverride {
  constructor(events, contract, client) {
    super(events, contract, client);
    this.signature = lodash.first(events).signature;
    this.type = lodash.first(events).type;
    // XXX: assert all of event should have same signature, type

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const acceptArray = [];
    const rejectArray = [];

    const filterArray = [];
    for (const event of this.events) {
      try {
        filterArray.push(event(...args));
        acceptArray.push(event.fullType);
      } catch (e) {
        rejectArray.push(event.fullType);
      }
    }

    if (!acceptArray.length) {
      throw new Error(`can not match override "${rejectArray.join(',')}" with args (${args.join(',')})`);
    }

    return LogFilter.concat(filterArray, this);
  }

  decodeLog(log) {
    const rejectArray = [];

    for (const event of this.events) {
      try {
        return event.decodeLog(log);
      } catch (e) {
        rejectArray.push(event.fullType);
      }
    }
    throw new Error(`can not decode log by "${rejectArray.join('|')}"`);
  }
}

module.exports = ContractEventSignatureOverride;
