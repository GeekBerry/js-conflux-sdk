class ContractABI {
  constructor(contract) {
    this.contract = contract;
  }

  decodeData(data) {
    const method = this.contract[data.slice(0, 10)] || this.contract.constructor;

    try {
      const tuple = method.decodeData(data);
      return {
        name: method.name,
        type: method.type,
        signature: method.signature,
        arguments: tuple,
      };
    } catch (e) {
      return undefined;
    }
  }

  decodeLog(log) {
    const event = this.contract[log.topics[0]];

    try {
      const tuple = event.decodeLog(log);
      return {
        name: event.name,
        type: event.type,
        signature: event.signature,
        arguments: tuple,
      };
    } catch (e) {
      return undefined;
    }
  }
}

module.exports = ContractABI;
