const lodash = require('lodash');
const { assert, decorate } = require('../util');
const { EventCoder } = require('../abi');
const callable = require('../lib/callable');

/**
 * @memberOf ContractEvent
 */
class EventLog {
  constructor(cfx, eventLog, { address, topics }) {
    this.cfx = cfx;
    this.eventLog = eventLog;
    this.address = address;
    this.topics = topics;
  }

  getLogs(options = {}) {
    const _decodeLog = log => {
      if (log !== undefined) {
        log.params = this.eventLog.decodeLog(log);
      }
      return log;
    };

    // new LogIterator and decorate for decode params
    const iter = this.cfx.getLogs({
      ...options,
      address: this.address,
      topics: this.topics,
    });

    decorate(iter, 'next', async (func, args) => {
      return _decodeLog(await func(...args));
    });

    decorate(iter, 'then', (func, [resolve, reject]) => {
      return func(logs => resolve(logs.map(_decodeLog)), reject);
    });

    return iter;
  }
}

class ContractEvent {
  constructor(cfx, contract, fragment) {
    this.cfx = cfx;
    this.contract = contract;

    this.coder = new EventCoder(fragment);
    this.name = fragment.name; // example: "Event"
    this.type = this.coder.type; // example: "Event(address)"
    this.signature = this.coder.signature(); // example: "0x50d7c806d0f7913f321946784dee176a42aa55b5dd83371fc57dcedf659085e0"

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const topics = [this.signature, ...this.coder.encodeTopics(args)];

    return new EventLog(this.cfx, this, { address: this.contract.address, topics });
  }

  decodeLog(log) {
    const topic = log.topics[0];

    assert(topic === this.signature, {
      message: 'unexpected decodeLog signature',
      expect: this.signature,
      got: topic,
      coder: this.coder,
    });

    const namedTuple = this.coder.decodeLog(log);
    return {
      name: this.name,
      fullName: this.coder.fullName,
      type: this.coder.type,
      signature: topic,
      array: [...namedTuple],
      object: namedTuple.toObject(),
    };
  }
}

/**
 * @memberOf ContractEvent
 */
class ContractEventOverride extends ContractEvent {
  constructor(cfx, contract, events) {
    super(cfx, contract, {});

    this.signatureToEvent = lodash.keyBy(events, 'signature');
  }

  call(...args) {
    const matrix = [];
    const types = [];
    for (const event of Object.values(this.signatureToEvent)) {
      try {
        matrix.push(event(...args).topics);
      } catch (e) {
        types.push(event.type);
      }
    }

    if (!matrix.length) {
      throw new Error(`can not match "${types.join(',')}" with args (${args.join(',')})`);
    }

    // transpose matrix
    const topics = lodash.zip(...matrix).map(array => {
      array = array.filter(Boolean);
      return array.length ? array : null;
    });

    return new EventLog(this.cfx, this, { address: this.contract.address, topics });
  }

  decodeLog(log) {
    const topic = log.topics[0];
    const event = this.signatureToEvent[topic];
    return event.decodeLog(log);
  }
}

module.exports = ContractEvent;
module.exports.ContractEventOverride = ContractEventOverride;
module.exports.EventLog = EventLog;
