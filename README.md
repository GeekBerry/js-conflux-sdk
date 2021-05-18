
# @geekberry/js-ethereum-sdk

- CONST.js
    - [BLOCK_NUMBER](#CONST.js/BLOCK_NUMBER)
    - [TRANSACTION_GAS](#CONST.js/TRANSACTION_GAS)
- contract
    - Contract.js
        - Contract
            - [**constructor**](#contract/Contract.js/Contract/**constructor**)
- Ethereum.js
    - Ethereum
        - [**constructor**](#Ethereum.js/Ethereum/**constructor**)
        - [provider](#Ethereum.js/Ethereum/provider)
        - [wallet](#Ethereum.js/Ethereum/wallet)
        - [defaultGasPrice](#Ethereum.js/Ethereum/defaultGasPrice)
        - [Contract](#Ethereum.js/Ethereum/Contract)
        - [close](#Ethereum.js/Ethereum/close)
        - [getNetVersion](#Ethereum.js/Ethereum/getNetVersion)
        - [getChainId](#Ethereum.js/Ethereum/getChainId)
        - [getProtocolVersion](#Ethereum.js/Ethereum/getProtocolVersion)
        - [getGasPrice](#Ethereum.js/Ethereum/getGasPrice)
        - [getBalance](#Ethereum.js/Ethereum/getBalance)
        - [getTransactionCount](#Ethereum.js/Ethereum/getTransactionCount)
        - [getBlockNumber](#Ethereum.js/Ethereum/getBlockNumber)
        - [getBlockByNumber](#Ethereum.js/Ethereum/getBlockByNumber)
        - [getBlockByHash](#Ethereum.js/Ethereum/getBlockByHash)
        - [getTransactionByHash](#Ethereum.js/Ethereum/getTransactionByHash)
        - [getTransactionReceipt](#Ethereum.js/Ethereum/getTransactionReceipt)
        - [sendRawTransaction](#Ethereum.js/Ethereum/sendRawTransaction)
        - [sendTransaction](#Ethereum.js/Ethereum/sendTransaction)
        - [getCode](#Ethereum.js/Ethereum/getCode)
        - [getStorageAt](#Ethereum.js/Ethereum/getStorageAt)
        - [call](#Ethereum.js/Ethereum/call)
        - [estimateGas](#Ethereum.js/Ethereum/estimateGas)
        - [getLogs](#Ethereum.js/Ethereum/getLogs)
        - [subscribe](#Ethereum.js/Ethereum/subscribe)
        - [subscribeNewHeads](#Ethereum.js/Ethereum/subscribeNewHeads)
        - [subscribeLogs](#Ethereum.js/Ethereum/subscribeLogs)
        - [subscribeNewPendingTransactions](#Ethereum.js/Ethereum/subscribeNewPendingTransactions)
        - [unsubscribe](#Ethereum.js/Ethereum/unsubscribe)
- provider
    - BaseProvider.js
        - BaseProvider
            - [**constructor**](#provider/BaseProvider.js/BaseProvider/**constructor**)
            - [requestId](#provider/BaseProvider.js/BaseProvider/requestId)
            - [call](#provider/BaseProvider.js/BaseProvider/call)
            - [batch](#provider/BaseProvider.js/BaseProvider/batch)
    - HttpProvider.js
        - [HttpProvider](#provider/HttpProvider.js/HttpProvider)
    - index.js
        - [providerFactory](#provider/index.js/providerFactory)
    - WebSocketProvider.js
        - WebSocketProvider
            - [**constructor**](#provider/WebSocketProvider.js/WebSocketProvider/**constructor**)
- subscribe
    - PendingTransaction.js
        - PendingTransaction
            - [get](#subscribe/PendingTransaction.js/PendingTransaction/get)
            - [mined](#subscribe/PendingTransaction.js/PendingTransaction/mined)
            - [executed](#subscribe/PendingTransaction.js/PendingTransaction/executed)
    - Subscription.js
        - [Subscription](#subscribe/Subscription.js/Subscription)
- Transaction.js
    - Transaction
        - [**constructor**](#Transaction.js/Transaction/**constructor**)
        - [hash(getter)](#Transaction.js/Transaction/hash(getter))
        - [sign](#Transaction.js/Transaction/sign)
        - [recover](#Transaction.js/Transaction/recover)
        - [encode](#Transaction.js/Transaction/encode)
        - [serialize](#Transaction.js/Transaction/serialize)
- util
    - format.js
        - format
            - [(static)any](#util/format.js/format/(static)any)
            - [(static)uInt](#util/format.js/format/(static)uInt)
            - [(static)bigInt](#util/format.js/format/(static)bigInt)
            - [(static)bigUInt](#util/format.js/format/(static)bigUInt)
            - [(static)bigUIntHex](#util/format.js/format/(static)bigUIntHex)
            - [(static)big](#util/format.js/format/(static)big)
            - [(static)blockNumber](#util/format.js/format/(static)blockNumber)
            - [(static)address](#util/format.js/format/(static)address)
            - [(static)hex](#util/format.js/format/(static)hex)
            - [(static)blockHash](#util/format.js/format/(static)blockHash)
            - [(static)transactionHash](#util/format.js/format/(static)transactionHash)
            - [(static)privateKey](#util/format.js/format/(static)privateKey)
            - [(static)publicKey](#util/format.js/format/(static)publicKey)
            - [(static)hexBuffer](#util/format.js/format/(static)hexBuffer)
            - [(static)bytes](#util/format.js/format/(static)bytes)
            - [(static)boolean](#util/format.js/format/(static)boolean)
            - [(static)keccak256](#util/format.js/format/(static)keccak256)
    - sign.js
        - [keccak256](#util/sign.js/keccak256)
        - [checksumAddress](#util/sign.js/checksumAddress)
        - [randomBuffer](#util/sign.js/randomBuffer)
        - [randomPrivateKey](#util/sign.js/randomPrivateKey)
        - [privateKeyToPublicKey](#util/sign.js/privateKeyToPublicKey)
        - [publicKeyToAddress](#util/sign.js/publicKeyToAddress)
        - [privateKeyToAddress](#util/sign.js/privateKeyToAddress)
        - [ecdsaSign](#util/sign.js/ecdsaSign)
        - [ecdsaRecover](#util/sign.js/ecdsaRecover)
        - [encrypt](#util/sign.js/encrypt)
        - [decrypt](#util/sign.js/decrypt)
- wallet
    - PrivateKeyAccount.js
        - PrivateKeyAccount
            - [(static)random](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)random)
            - [(static)decrypt](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)decrypt)
            - [**constructor**](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/**constructor**)
            - [encrypt](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/encrypt)
            - [signTransaction](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/signTransaction)
            - [signMessage](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/signMessage)
    - Wallet.js
        - Wallet
            - [has](#wallet/Wallet.js/Wallet/has)
            - [delete](#wallet/Wallet.js/Wallet/delete)
            - [clear](#wallet/Wallet.js/Wallet/clear)
            - [set](#wallet/Wallet.js/Wallet/set)
            - [get](#wallet/Wallet.js/Wallet/get)
            - [addPrivateKey](#wallet/Wallet.js/Wallet/addPrivateKey)
            - [addRandom](#wallet/Wallet.js/Wallet/addRandom)
            - [addKeystore](#wallet/Wallet.js/Wallet/addKeystore)

----------------------------------------

## BLOCK_NUMBER <a id="CONST.js/BLOCK_NUMBER"></a>

blockNumber label

- `PENDING` 'pending': the currently mined block (including pending transactions)
- `LATEST` 'latest': the latest block (current head of the block chain)
- `EARLIEST` 'earliest': earliest epoch number, same as 0.

----------------------------------------

## TRANSACTION_GAS <a id="CONST.js/TRANSACTION_GAS"></a>

`number`

gas use for pure transfer transaction

* **Examples**

```
> CONST.TRANSACTION_GAS
 21000
```

----------------------------------------

### Contract <a id="contract/Contract.js/Contract"></a>

Contract with all its methods and events defined in its abi.

#### Contract.prototype.**constructor** <a id="contract/Contract.js/Contract/**constructor**"></a>

> contract "code" definition:
```
6080................6080.................a264.........0033...............................
| <-                     create contract transaction `data`                          -> |
| <- deploy code -> | <- runtime code -> | <- metadata -> | <- constructor arguments -> |
| <-                contract `bytecode`                -> |
                    | <-       code as `getCode`       -> |
```

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------------------------------------------------------------------
options          | `object`  | true     |         |
options.abi      | `array`   | true     |         | The json interface for the contract to instantiate
options.address  | `string`  | false    |         | The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
options.bytecode | `string`  | false    |         | The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
client           | `Conflux` | true     |         | Conflux instance.

* **Returns**

`object` 

* **Examples**

```
> const contract = client.Contract({ abi, bytecode, address });
   {
      abi: ContractABI { contract: [Circular *1] },
      address: '0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98',
      constructor: [Function: bound call],
      name: [Function: bound call],
      'name()': [Function: bound call],
      '0x06fdde03': [Function: bound call],
      balanceOf: [Function: bound call],
      'balanceOf(address)': [Function: bound call],
      '0x70a08231': [Function: bound call],
      send: [Function: bound call],
      'send(address,uint256,bytes)': [Function: bound call],
      '0x9bd9bbc6': [Function: bound call],
      Transfer: [Function: bound call],
      'Transfer(address,address,uint256)': [Function: bound call],
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': [Function: bound call]
   }
> contract.constructor.bytecode; // input code
   "0x6080..."
```

```
> const contract = client.Contract({
   address: '0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98',
   abi: [
      {
        type: 'function',
        name: 'name',
        inputs: [],
        outputs: [{ type: 'string' }],
      },
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
      {
        name: 'send',
        type: 'function',
        inputs: [
          { type: 'address', name: 'recipient' },
          { type: 'uint256', name: 'amount' },
          { type: 'bytes', name: 'data' },
        ],
        outputs: [{ type: 'bool' }],
      },
    ]
   });
> contract.address
   "0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98"
> await contract.name(); // call a method without parameter, get decoded return value.
   "FansCoin"
> await contract.name().call({ to: '0x8b8689c7f3014a4d86e4d1d0daaf74a47f5e0f27' }); // call a method with options
   "client USDT"
> await contract.balanceOf('0x19c742cec42b9e4eff3b84cdedcde2f58a36f44f'); // call a method with parameters, get decoded return value.
   10000000000000000000n
> transaction = await client.getTransactionByHash('0x2055f3287f1a6ce77d91f5dfdf7517a531b3a560fee1265f27dc1ff92314530b');
> contract.abi.decodeData(transaction.data)
   {
      name: 'send',
      fullName: 'send(address recipient, uint256 amount, bytes data)',
      type: 'send(address,uint256,bytes)',
      signature: '0x9bd9bbc6',
      array: [
        '0x80bb30efc5683758128b404fe5da03432eb16634',
        60000000000000000000n,
        <Buffer 1f 3c 6b 96 96 60 4c dc 3c e1 ca 27 7d 4c 69 a9 c2 77 0c 9f>
      ],
      object: {
        recipient: '0x80bb30efc5683758128b404fe5da03432eb16634',
        amount: 60000000000000000000n,
        data: <Buffer 1f 3c 6b 96 96 60 4c dc 3c e1 ca 27 7d 4c 69 a9 c2 77 0c 9f>
      }
    }
> receipt = await client.getTransactionReceipt('0x2055f3287f1a6ce77d91f5dfdf7517a531b3a560fee1265f27dc1ff92314530b');
> contract.abi.decodeLog(receipt.logs[1]);
   {
      name: 'Transfer',
      fullName: 'Transfer(address indexed from, address indexed to, uint256 value)',
      type: 'Transfer(address,address,uint256)',
      signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      array: [
        '0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f',
        '0x80bb30efc5683758128b404fe5da03432eb16634',
        60000000000000000000n
      ],
      object: {
        from: '0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f',
        to: '0x80bb30efc5683758128b404fe5da03432eb16634',
        value: 60000000000000000000n
      }
    }
```

----------------------------------------

## Ethereum <a id="Ethereum.js/Ethereum"></a>

A sdk of ethereum.

### Ethereum.prototype.**constructor** <a id="Ethereum.js/Ethereum/**constructor**"></a>

* **Parameters**

Name                    | Type            | Required | Default | Description
------------------------|-----------------|----------|---------|-------------------------------------------------------
options                 | `object`        | false    |         | Conflux and Provider constructor options.
options.defaultGasPrice | `string,number` | false    |         | The default gas price in drip to use for transactions.
options.url             | `string`        | false    |         | Url of Conflux node to connect.
options.timeout         | `number`        | false    |         | Request time out in ms
options.logger          | `Object`        | false    |         | Logger object with 'info' and 'error' method.

* **Examples**

```
> const client = new Ethereum({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
```

### Ethereum.prototype.provider <a id="Ethereum.js/Ethereum/provider"></a>

`WebsocketProvider,HttpProvider,BaseProvider`

Provider for rpc call

### Ethereum.prototype.wallet <a id="Ethereum.js/Ethereum/wallet"></a>

`Wallet`

Wallet for `sendTransaction` to get `Account` by `from` field

### ~~Ethereum.prototype.defaultGasPrice~~ <a id="Ethereum.js/Ethereum/defaultGasPrice"></a>

`number,string`

Default gas price for following methods:
- `Conflux.sendTransaction`

### Ethereum.prototype.Contract <a id="Ethereum.js/Ethereum/Contract"></a>

A shout cut for `new Contract(options, client);`

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-----------------------------------------------------
options | `object` | true     |         | See [Contract.constructor](#Contract.js/constructor)

* **Returns**

`Contract` - A Contract instance

### Ethereum.prototype.close <a id="Ethereum.js/Ethereum/close"></a>

close connection.

* **Examples**

```
> client.close();
```

### Ethereum.prototype.getNetVersion <a id="Ethereum.js/Ethereum/getNetVersion"></a>

* **Returns**

`Promise.<string>` 

* **Examples**

```
> await client.getNetVersion()
   "Mainnet"
```

### Ethereum.prototype.getChainId <a id="Ethereum.js/Ethereum/getChainId"></a>

* **Returns**

`Promise.<number>` 

* **Examples**

```
> await client.getChainId()
   42
```

### Ethereum.prototype.getProtocolVersion <a id="Ethereum.js/Ethereum/getProtocolVersion"></a>

* **Returns**

`Promise.<number>` 

* **Examples**

```
> await client.getProtocolVersion()
   65
```

### Ethereum.prototype.getGasPrice <a id="Ethereum.js/Ethereum/getGasPrice"></a>

Returns the current price per gas in Wei.

* **Returns**

`Promise.<BigInt>` Gas price in drip.

* **Examples**

```
> await client.getGasPrice();
   1n
```

### Ethereum.prototype.getBalance <a id="Ethereum.js/Ethereum/getBalance"></a>

Returns the balance of the account of given address.

* **Parameters**

Name        | Type            | Required | Default                   | Description
------------|-----------------|----------|---------------------------|---------------------------------------------------------------------
address     | `string`        | true     |                           | The address to get the balance of.
blockNumber | `string,number` | false    | CONST.BLOCK_NUMBER.LATEST | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` The balance in Wei.

* **Examples**

```
> await client.getBalance("0x1c1e72f0c37968557b3d85a3f32747792798bbde");
   824812401057514588670n
```

### Ethereum.prototype.getTransactionCount <a id="Ethereum.js/Ethereum/getTransactionCount"></a>

Returns the next nonce should be used by given address.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|---------------------------------------------------------------------
address     | `string`        | true     |         | The address to get the numbers of transactions from.
blockNumber | `string,number` | false    |         | See [format.blockNumber](#util/format.js/format/(static)blockNumber)

* **Returns**

`Promise.<number>` The next nonce should be used by given address.

* **Examples**

```
> await client.getTransactionCount("0x1c1e72f0c37968557b3d85a3f32747792798bbde");
   1449n
```

### Ethereum.prototype.getBlockNumber <a id="Ethereum.js/Ethereum/getBlockNumber"></a>

Returns the epoch number of given parameter.

* **Returns**

`Promise.<number>` integer of the current epoch number of given parameter.

* **Examples**

```
> await client.getEpochNumber();
   443
```

### Ethereum.prototype.getBlockByNumber <a id="Ethereum.js/Ethereum/getBlockByNumber"></a>

Returns information about a block by epoch number.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|---------------------------------------------------------------------------------------------------
blockNumber | `string,number` | true     |         | See [format.epochNumber](#util/format.js/format/(static)epochNumber)
detail      | `boolean`       | false    | false   | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

* **Returns**

`Promise.<(object|null)>` See `getBlockByHash`

* **Examples**

```
> await client.getBlockByEpochNumber('latest_mined', true);
   {...}
```

### Ethereum.prototype.getBlockByHash <a id="Ethereum.js/Ethereum/getBlockByHash"></a>

Returns information about a block by hash.

* **Parameters**

Name      | Type      | Required | Default | Description
----------|-----------|----------|---------|---------------------------------------------------------------------------------------------------
blockHash | `string`  | true     |         | hash of a block.
detail    | `boolean` | false    | false   | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

* **Returns**

`Promise.<(object|null)>` A block object, or null when no block was found:
- adaptive `boolean`: If `true` the weight of the block is adaptive under GHAST rule, if `false` otherwise.
- blame `number`: If 0, then no blocks are blamed on its parent path, If greater than 0, then the nearest blamed block on the parent path is blame steps away.
- deferredLogsBloomHash `string`: The bloom hash of deferred logs.
- deferredReceiptsRoot `string`: The hash of the receipts of the block after deferred execution.
- deferredStateRoot `string`: The root of the final state trie of the block after deferred execution.
- difficulty `string`: Integer string of the difficulty for this block.
- epochNumber `number|null`: The current block epoch number in the client's view. null when it's not in best block's past set and the epoch number is not determined.
- gasLimit `BigInt`: The maximum gas allowed in this block.
- hash `string|null`: Hash of the block. `null` when its pending block.
- height `number`: The block heights. `null` when its pending block.
- miner `string`: The address of the beneficiary to whom the mining rewards were given.
- nonce `string`: Hash of the generated proof-of-work. `null` when its pending block.
- parentHash `string`: Hash of the parent block.
- powQuality `string`:Hash of the generated proof-of-work. `null` when its pending block.
- refereeHashes `string[]`: Array of referee hashes.
- size `number`: Integer the size of this block in bytes.
- timestamp `number`: The unix timestamp for when the block was collated.
- transactions `string[]|object[]`: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
- transactionsRoot `string`: The hash of the transactions of the block.

* **Examples**

```
> await client.getBlockByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390');
   {
      epochNumber: 6,
      blame: 0,
      height: 6,
      size: 352,
      timestamp: 1603901780,
      gasLimit: 30000000n,
      gasUsed: 61118n,
      difficulty: 20000000000n,
      transactions: [
        '0xaad69c8c814aec3e418b68f60917c607920a531e7082dd2c642323b43ecadb94',
        '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce'
      ],
      adaptive: false,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508',
      deferredStateRoot: '0x50c0fcbc5bafa7d1dba7b19c87629830106a6be8d0adf505cdc656bb43535d69',
      hash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      miner: 'NET1921:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0JABGHCD8E',
      nonce: '0x17d86f2f6',
      parentHash: '0xc8a412b4b77b48d61f694975f032d109f26bb0f9fc02e4b221d67a382fab386b',
      powQuality: '0x5a0f86a6f4',
      refereeHashes: [
        '0x73cd891aea310e2c0b8644de91746c7353cebfffb780126bc06101b20689c893'
      ],
      transactionsRoot: '0xd2f08676484ba2a3738194f44542eb29fb290b8ed74bf007f132fe51d89b2e7c'
    }
```

### Ethereum.prototype.getTransactionByHash <a id="Ethereum.js/Ethereum/getTransactionByHash"></a>

Returns the information about a transaction requested by transaction hash.

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|----------------------
transactionHash | `string` | true     |         | hash of a transaction

* **Returns**

`Promise.<(object|null)>` transaction object, or `null` when no transaction was found:
- blockHash `string`: hash of the block where this transaction was in and got executed. `null` when its pending.
- contractCreated `string|null`: address of created contract. `null` when it's not a contract creating transaction
- data `string`: the data send along with the transaction.
- epochHeight `number`: epoch height
- from `string`: address of the sender.
- gas `BigInt`: gas provided by the sender.
- gasPrice `number`: gas price provided by the sender in Wei.
- hash `string`: hash of the transaction.
- nonce `BigInt`: the number of transactions made by the sender prior to this one.
- r `string`: ECDSA signature r
- s `string`: ECDSA signature s
- status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
- storageLimit `BigInt`: storage limit in bytes
- chainId `number`: chain id
- to `string`: address of the receiver. null when its a contract creation transaction.
- transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
- v `string`: ECDSA recovery id
- value `BigInt`: value transferred in Wei.

* **Examples**

```
> await client.getTransactionByHash('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      nonce: 0n,
      gasPrice: 10n,
      gas: 200000n,
      value: 0n,
      storageLimit: 1024n,
      epochHeight: 0,
      chainId: 1029,
      v: 1,
      status: 0,
      transactionIndex: 1,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      data: '0xfebe49090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000162788589c8e386863f217faef78840919fb2854',
      from: 'NET1921:TYPE.USER:AAP9KTHVCTUNVF030RBKK9K7ZBZYZ12DAJYFD4DBC8',
      hash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      r: '0x495da01ae9f445847022a8bc7df0198577ba75f88b26699f61afb435bb9c50bc',
      s: '0x2291051b1c53db1d6bfe2fb29be1bf512d063e726dc6b98aaf0f2259b7456be0',
      to: 'NET1921:TYPE.CONTRACT:ACB59FK6VRYH8DJ5VYVEHJ9APZHPD72RDPA1CTUUZH'
    }
```

### Ethereum.prototype.getTransactionReceipt <a id="Ethereum.js/Ethereum/getTransactionReceipt"></a>

Returns the information about a transaction receipt requested by transaction hash.

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|----------------------
transactionHash | `string` | true     |         | Hash of a transaction

* **Returns**

`Promise.<(object|null)>` A transaction receipt object, or null when no transaction was found or the transaction was not executed yet:
- transactionHash `string`: Hash of the given transaction.
- index `number`: Transaction index within the block.
- blockHash `string`: Hash of the block where this transaction was in and got executed.
- epochNumber `number`: Epoch number of the block where this transaction was in and got executed.
- from `string`: Address of the sender.
- to `string`: Address of the receiver. `null` when its a contract creation transaction.
- gasUsed `number`: Gas used the transaction.
- contractCreated `string|null`: Address of created contract. `null` when it's not a contract creating transaction.
- stateRoot `string`: Hash of the state root.
- outcomeStatus `number`:  the outcome status code, 0 was successful, 1 for an error occurred in the execution.
- logsBloom `string`: Bloom filter for light clients to quickly retrieve related logs.
- logs `object[]`: Array of log objects, which this transaction generated.
- gasCoveredBySponsor `boolean`: `true` if this transaction's gas fee was covered by the sponsor.
- storageCoveredBySponsor `boolean`: `true` if this transaction's storage collateral was covered by the sponsor.
- storageCollateralized `BigInt`: the amount of storage collateral this transaction required.
- storageReleased `array`: array of storage change objects, each specifying an address and the corresponding amount of storage collateral released
  - address `string`: address released
  - collaterals `BigInt`: corresponding amount of storage collateral released

* **Examples**

```
> await client.getTransactionReceipt('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      index: 1,
      epochNumber: 6,
      outcomeStatus: 0,
      gasUsed: 30559n,
      gasFee: 1500000n,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      from: 'NET1921:TYPE.USER:AAP9KTHVCTUNVF030RBKK9K7ZBZYZ12DAJYFD4DBC8',
      logs: [],
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      stateRoot: '0xd6a7c2c14cb0d1233010acca98e114db5a10e0b94803d23b01a6777b7fd3b2fd',
      to: 'NET1921:TYPE.CONTRACT:ACB59FK6VRYH8DJ5VYVEHJ9APZHPD72RDPA1CTUUZH'
      transactionHash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      txExecErrorMsg: null,
      gasCoveredBySponsor: false,
      storageCoveredBySponsor: false,
      storageCollateralized: 0n,
      storageReleased: [
        address: 'NET1921:TYPE.BUILTIN:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE45419DJS',
        collaterals: 640n,
      ],
    }
```

### Ethereum.prototype.sendRawTransaction <a id="Ethereum.js/Ethereum/sendRawTransaction"></a>

Creates new message call transaction or a contract creation for signed transactions.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|-----------------------------
hex  | `string,Buffer` | true     |         | The signed transaction data.

* **Returns**

`Promise.<PendingTransaction>` The transaction hash, or the zero hash if the transaction is not yet available.

* **Examples**

```
> await client.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
```

### Ethereum.prototype.sendTransaction <a id="Ethereum.js/Ethereum/sendTransaction"></a>

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
options | `object` | true     |         |

* **Returns**

`Promise.<PendingTransaction>` 

### Ethereum.prototype.getCode <a id="Ethereum.js/Ethereum/getCode"></a>

Returns the code of given contract.

* **Parameters**

Name        | Type            | Required | Default                   | Description
------------|-----------------|----------|---------------------------|---------------------------------------------------------------------
address     | `string`        | true     |                           | Address to contract.
blockNumber | `string,number` | false    | CONST.BLOCK_NUMBER.LATEST | See [format.blockNumber](#util/format.js/format/(static)blockNumber)

* **Returns**

`Promise.<string>` Byte code of contract, or 0x if the contract does not exist.

* **Examples**

```
> await client.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
```

### Ethereum.prototype.getStorageAt <a id="Ethereum.js/Ethereum/getStorageAt"></a>

Returns storage entries from a given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
position    | `string`        | true     |                | The given position.
blockNumber | `string,number` | false    | 'latest_state' | See [format.blockNumber](#util/format.js/format/(static)blockNumber)

* **Returns**

`Promise.<(string|null)>` Storage entry of given query, or null if the it does not exist.

* **Examples**

```
> await client.getStorageAt('0x866aca87ff33a0ae05d2164b3d999a804f583222', '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9')
   "0x000000000000000000000000000000000000000000000000000000000000162e"
```

### Ethereum.prototype.call <a id="Ethereum.js/Ethereum/call"></a>

Virtually call a contract, return the output data.

* **Parameters**

Name        | Type            | Required | Default                   | Description
------------|-----------------|----------|---------------------------|---------------------------------------------------------------------
options     | `object`        | true     |                           | See [Transaction](#Transaction.js/Transaction/**constructor**)
blockNumber | `string,number` | false    | CONST.BLOCK_NUMBER.LATEST | See [format.blockNumber](#util/format.js/format/(static)blockNumber)

* **Returns**

`Promise.<string>` The output data.

### Ethereum.prototype.estimateGas <a id="Ethereum.js/Ethereum/estimateGas"></a>

Virtually call a contract, return the estimate gas used and storage collateralized.

* **Parameters**

Name        | Type            | Required | Default                   | Description
------------|-----------------|----------|---------------------------|---------------------------------------------------------------------
options     | `object`        | true     |                           | See [Transaction](#Transaction.js/Transaction/**constructor**)
blockNumber | `string,number` | false    | CONST.BLOCK_NUMBER.LATEST | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<object>` A estimate result object:
- `BigInt` gasUsed: The gas used.
- `BigInt` gasLimit: The gas limit.
- `BigInt` storageCollateralized: The storage collateralized in Byte.

### Ethereum.prototype.getLogs <a id="Ethereum.js/Ethereum/getLogs"></a>

Returns logs matching the filter provided.

* **Parameters**

Name              | Type                    | Required | Default                   | Description
------------------|-------------------------|----------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options           | `object`                | false    |                           |
options.fromBlock | `string,number`         | false    | CONST.BLOCK_NUMBER.LATEST | See [format.blockNumber](#util/format.js/format/(static)blockNumber). Search will be applied from this epoch number.
options.toBlock   | `string,number`         | false    | CONST.BLOCK_NUMBER.LATEST | See [format.blockNumber](#util/format.js/format/(static)blockNumber). Search will be applied up until (and including) this epoch number.
options.blockHash | `string`                | false    |                           | Array of up to 128 block hashes that the search will be applied to. This will override from/to epoch fields if it's not null
options.address   | `string,Array.<string>` | false    |                           | Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
options.topics    | `array`                 | false    |                           | Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.

* **Returns**

`Promise.<Array.<object>>` Array of log, that the logs matching the filter provided:
- address `string`: Address this event originated from.
- topics `string[]`: Array of topics.
- data `string`: The data containing non-indexed log parameter.
- blockHash `string`: Hash of the block where the log in.
- epochNumber `number`: Epoch number of the block where the log in.
- transactionHash `string`: Hash of the transaction where the log in.
- transactionIndex `string`: Transaction index in the block.
- logIndex `number`: Log index in block.
- transactionLogIndex `number`: Log index in transaction.

* **Examples**

```
> await client.getLogs({
      address: '0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98',
      fromEpoch: 39802,
      toEpoch: 39802,
      limit: 1,
      topics: ['0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'],
    });
   [
   {
      epochNumber: 39802,
      logIndex: 2,
      transactionIndex: 0,
      transactionLogIndex: 2,
      address: '0x8e2f2e68eb75bb8b18caafe9607242d4748f8d98',
      blockHash: '0xca00158a2a508170278d5bdc5ca258b6698306dd8c30fdba32266222c79e57e6',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde'
      ],
      transactionHash: '0xeb75f47002720311f1709e36d7f7e9a91ee4aaa469a1de892839cb1ef66a9939'
    }
   ]
```

### Ethereum.prototype.subscribe <a id="Ethereum.js/Ethereum/subscribe"></a>

Subscribe event by name and got id, and provider will emit event by id

> Note: suggest use `client.subscribeXXX` to subscribe

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-----------------------
name    | `string` | true     |         | Subscription name
...args | `array`  | true     |         | Subscription arguments

* **Returns**

`Promise.<string>` Id of subscription

* **Examples**

```
> client = new Conflux({url:'ws://127.0.0.1:12535'})
> id = await client.subscribe('epochs');
   "0x8fe7879a1681e9b9"
> client.provider.on(id, data=>console.log(data));
   {
     epochHashesOrdered: [
       '0x0eff33578346b8e8347af3bae948eb7f4f5c27add9dbcfeb55eaf7cb3640088f',
       '0xb0cedac34a06ebcb42c3446a6bb2df1f0dcd9d83061f550460e387d19a4d8e91'
     ],
     epochNumber: '0x8cb32'
   }
```

### Ethereum.prototype.subscribeNewHeads <a id="Ethereum.js/Ethereum/subscribeNewHeads"></a>

The newHeads topic streams all new block headers participating in the consensus.

* **Returns**

`Promise.<Subscription>` EventEmitter instance with the follow events:
- 'data': see `getBlockByHash`

* **Examples**

```
> subscription = await client.subscribeNewHeads()
> subscription.on('data', data=>console.log(data))
   {
      number: 24908378,
      hash: '0xb6b8641011e90f747c8addb8ae38c622348f07e852af50f688c2bcbd975b4402',
      parentHash: '0xf6ef56360d258f7ae1eb91c3dcee477c2022d1ce5e0780f9852b5a1ea953ae5b',
      sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      logsBloom: '0x000000400000200001000080000000000000010000100800020800000010000001800000000020000000040000000000002000100000000000000000002000000000002000000000000400080000000000010200000802000000a400c000000400000801820000008004601000002a20200000000000800010002030002000400800040200008010240000000900000001804001008000000000100080080200021000000000002000000010000103000000000000000000000000a00000020000020002000000000000800000000000000800000000080000008020800020020010000040080008000001000000200008000000800000480000000000814000',
      transactionsRoot: '0xf499abdb0439a896543f0bc9ca5b6f110452b3d1b3fa672626e917065b52139b',
      stateRoot: '0x0225ba245d86c0f64bd4cd7690b6af2a41ccef62034353f22ec6f72e8dc87b58',
      receiptsRoot: '0xb61ec060497fbb6208bc17255553ced836d1e9a468154d2f1a415825a1e66e57',
      miner: '0x03801efb0efe2a25ede5dd3a003ae880c0292e4d',
      author: '0x03801efb0efe2a25ede5dd3a003ae880c0292e4d',
      difficulty: 340282366920938463463374607431768211454n,
      extraData: '0xdb830302058c4f70656e457468657265756d86312e34372e30826c69',
      size: 5925,
      gasLimit: 12499988n,
      gasUsed: 1853185n,
      timestamp: 1621323232,
    }
```

### Ethereum.prototype.subscribeLogs <a id="Ethereum.js/Ethereum/subscribeLogs"></a>

The logs topic streams all logs matching a certain filter, in order.
In case of a pivot chain reorg (which might affect recent logs), a special revert message is sent.
All logs received previously that belong to epochs larger than the one in this message should be considered invalid.

* **Parameters**

Name            | Type                    | Required | Default | Description
----------------|-------------------------|----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options         | `object`                | false    |         |
options.address | `string,Array.<string>` | false    |         | Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
options.topics  | `array`                 | false    |         | Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.

* **Returns**

`Promise.<Subscription>` EventEmitter instance with the follow events:
- 'data': see `getLogs`
- 'removed': see `getLogs`

* **Examples**

```
> subscription = await client.subscribeLogs()
> subscription.on('data', data=>console.log(data))
   {
     epochNumber: 568224,
     logIndex: 0,
     transactionIndex: 0,
     transactionLogIndex: 0,
     address: '0x84ed30d7ddc5ff82ac271ae4e7add5a8b22a8d71',
     blockHash: '0xc02689eea6a507250838463c13e6b633479e2757dfb7e9b2593d5c31b54adb63',
     data: '0x0000000000000000000000000000000000000000000000000000000000000001',
     topics: [
       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
     ],
     transactionHash: '0x950ddec9ce3b42c4d8ca120722fa318ae64dc2e24553201f55f68c00bfd9cc4c'
   }
```

```
> subscription.on('removed', data=>console.log(data))
```

### Ethereum.prototype.subscribeNewPendingTransactions <a id="Ethereum.js/Ethereum/subscribeNewPendingTransactions"></a>

* **Returns**

`Promise.<Subscription>` 

### Ethereum.prototype.unsubscribe <a id="Ethereum.js/Ethereum/unsubscribe"></a>

Unsubscribe subscription.

* **Parameters**

Name | Type                  | Required | Default | Description
-----|-----------------------|----------|---------|----------------
id   | `string,Subscription` | true     |         | Subscription id

* **Returns**

`Promise.<boolean>` Is success

* **Examples**

```
> id = await client.subscribe('epochs');
> await client.unsubscribe(id);
   true
> await client.unsubscribe(id);
   false
```

```
> subscription = await client.subscribeLogs();
> await client.unsubscribe(subscription);
   true
```

----------------------------------------

### BaseProvider <a id="provider/BaseProvider.js/BaseProvider"></a>



#### BaseProvider.prototype.**constructor** <a id="provider/BaseProvider.js/BaseProvider/**constructor**"></a>

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|-------------------------------
options         | `object` | false    |         |
options.url     | `string` | true     |         | Full json rpc http url
options.timeout | `number` | false    | 60*1000 | Request time out in ms
options.logger  | `object` | false    |         | Logger with `info` and `error`

* **Returns**

`BaseProvider` 

#### BaseProvider.prototype.requestId <a id="provider/BaseProvider.js/BaseProvider/requestId"></a>

Gen a random json rpc id.
It is used in `call` method, overwrite it to gen your own id.

* **Returns**

`string` 

#### BaseProvider.prototype.call <a id="provider/BaseProvider.js/BaseProvider/call"></a>

Call a json rpc method with params

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------------------
method    | `string` | true     |         | Json rpc method name.
...params | `array`  | false    |         | Json rpc method params.

* **Returns**

`Promise.<*>` Json rpc method return value.

* **Examples**

```
> await provider.call('cfx_epochNumber');
> await provider.call('cfx_getBlockByHash', blockHash);
```

#### BaseProvider.prototype.batch <a id="provider/BaseProvider.js/BaseProvider/batch"></a>

Batch call json rpc methods with params

* **Parameters**

Name  | Type             | Required | Default | Description
------|------------------|----------|---------|-------------------------------------------
array | `Array.<object>` | true     |         | Array of object with "method" and "params"

* **Returns**

`Promise.<Array>` 

* **Examples**

```
> await provider.batch([
  { method: 'cfx_epochNumber' },
  { method: 'cfx_getBalance', params: ['0x0123456789012345678901234567890123456789'] },
  { method: 'InValidInput' },
])
   [ '0x3b734d', '0x22374d959c622f74728', RPCError: Method not found ]
```

----------------------------------------

### HttpProvider <a id="provider/HttpProvider.js/HttpProvider"></a>

Http protocol json rpc provider.

----------------------------------------

### providerFactory <a id="provider/index.js/providerFactory"></a>

* **Parameters**

Name        | Type     | Required | Default | Description
------------|----------|----------|---------|------------
options     | `object` | true     |         |
options.url | `string` | true     |         |

* **Returns**

`WebsocketProvider,HttpProvider,BaseProvider` 

* **Examples**

```
> providerFactory()
 BaseProvider {
    url: undefined,
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
```

```
> providerFactory({ url: 'http://localhost:12537' })
 HttpProvider {
    url: 'http://localhost:12537',
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
> providerFactory({
    url: 'http://main.confluxrpc.org',
    timeout: 60 * 60 * 1000,
    logger: console,
  }
 HttpProvider {
    url: 'http://main.confluxrpc.org',
    timeout: 3600000,
    logger: {...}
  }
```

----------------------------------------

### WebSocketProvider <a id="provider/WebSocketProvider.js/WebSocketProvider"></a>

Websocket protocol json rpc provider.

#### WebSocketProvider.prototype.**constructor** <a id="provider/WebSocketProvider.js/WebSocketProvider/**constructor**"></a>

* **Parameters**

Name                                        | Type             | Required | Default  | Description
--------------------------------------------|------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------
options                                     | `object`         | false    |          | See [W3CWebSocket](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/W3CWebSocket.md)
options.url                                 | `string`         | true     |          | Full json rpc http url
options.timeout                             | `number`         | false    | 60*1000  | Request time out in ms
options.logger                              | `object`         | false    |          | Logger with `info` and `error`
options.protocols                           | `Array.<string>` | false    |          | See [w3](https://www.w3.org/TR/websockets/)
options.origin                              | `string`         | false    |          |
options.headers                             | `object`         | false    |          |
options.requestOptions                      | `object`         | false    |          |
options.clientConfig                        | `object`         | false    |          | See [websocket/lib/WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/WebSocketClient.md)
options.clientConfig.maxReceivedFrameSize   | `number`         | false    | 0x100000 | 1MiB max frame size.
options.clientConfig.maxReceivedMessageSize | `number`         | false    | 0x800000 | 8MiB max message size, only applicable if assembleFragments is true
options.clientConfig.closeTimeout           | `number`         | false    | 5000     | The number of milliseconds to wait after sending a close frame for an acknowledgement to come back before giving up and just closing the socket.

* **Returns**

`WebSocketProvider` 

----------------------------------------

### Subscription <a id="subscribe/Subscription.js/Subscription"></a>

Subscription event emitter

----------------------------------------

## Transaction <a id="Transaction.js/Transaction"></a>



### Transaction.prototype.**constructor** <a id="Transaction.js/Transaction/**constructor**"></a>

Create a transaction.

* **Parameters**

Name             | Type            | Required | Default | Description
-----------------|-----------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options          | `object`        | true     |         |
options.from     | `string`        | false    |         | The sender address.
options.nonce    | `string,number` | false    |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice | `string,number` | false    |         | The price of gas for this transaction in drip.
options.to       | `string`        | false    |         | The destination address of the message, left undefined for a contract-creation transaction.
options.value    | `string,number` | false    |         | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
options.chainId  | `string,number` | false    |         | The chain ID specified by the sender.
options.data     | `string,Buffer` | false    |         | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
options.r        | `string,Buffer` | false    |         | ECDSA signature r
options.s        | `string,Buffer` | false    |         | ECDSA signature s
options.v        | `number`        | false    |         | ECDSA recovery id

* **Returns**

`Transaction` 

### Transaction.prototype.hash <a id="Transaction.js/Transaction/hash(getter)"></a>

Getter of transaction hash include signature.

> Note: calculate every time.

* **Returns**

`string,undefined` If transaction has r,s,v return hex string, else return undefined.

### Transaction.prototype.sign <a id="Transaction.js/Transaction/sign"></a>

Sign transaction and set 'r','s','v'.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | Private key hex string.

* **Returns**

`Transaction` 

### Transaction.prototype.recover <a id="Transaction.js/Transaction/recover"></a>

Recover public key from signed Transaction.

* **Returns**

`string` 

### Transaction.prototype.encode <a id="Transaction.js/Transaction/encode"></a>

Encode rlp.
> TODO: EIP-2718, EIP-2930

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------
includeSignature | `boolean` | false    | false   | Whether or not to include the signature.

* **Returns**

`Buffer` 

### Transaction.prototype.serialize <a id="Transaction.js/Transaction/serialize"></a>

Get the raw transaction hex string.

* **Returns**

`string` Hex string

----------------------------------------

#### format.any <a id="util/format.js/format/(static)any"></a>

* **Parameters**

Name | Type  | Required | Default | Description
-----|-------|----------|---------|------------
arg  | `any` | true     |         |

* **Returns**

`any` arg

* **Examples**

```
> format.any(1)
 1
```

#### format.uInt <a id="util/format.js/format/(static)uInt"></a>

* **Parameters**

Name | Type                           | Required | Default | Description
-----|--------------------------------|----------|---------|------------
arg  | `number,BigInt,string,boolean` | true     |         |

* **Returns**

`Number` 

* **Examples**

```
> format.uInt(-3.14)
 Error("not match uint")
> format.uInt(null)
 Error("not match number")
> format.uInt('0')
 0
> format.uInt(1)
 1
> format.uInt(BigInt(100))
 100
> format.uInt('0x10')
 16
> format.uInt('')
 0
> format.uInt(true)
 1
> format.uInt(false)
 0
> format.uInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

#### format.bigInt <a id="util/format.js/format/(static)bigInt"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`BigInt` 

* **Examples**

```
> format.bigInt(-3.14)
 Error("Cannot convert -3.14 to a BigInt")
> format.bigInt('0.0')
 0n
> format.bigInt('-1')
 -1n
> format.bigInt(1)
 1n
> format.bigInt(BigInt(100))
 100n
> format.bigInt('0x10')
 16n
> format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 9007199254740992n
```

#### format.bigUInt <a id="util/format.js/format/(static)bigUInt"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`BigInt` 

* **Examples**

```
> format.bigUInt('0.0')
 0n
> format.bigUInt('-1')
 Error("not match bigUInt")
```

#### format.bigUIntHex <a id="util/format.js/format/(static)bigUIntHex"></a>

When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.bigUIntHex(100)
 "0x64"
> format.bigUIntHex('0x0a')
 "0xa"
> format.bigUIntHex(-1))
 Error("not match uintHex")
```

#### format.big <a id="util/format.js/format/(static)big"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`Big` Big instance

* **Examples**

```
> format.big('0b10').toString()
 '2'
> format.big('0O10').toString()
 '8'
> format.big('010').toString()
 '10'
> format.big('0x10').toString()
 '16'
> format.big(3.14).toString()
 '3.14'
> format.big('-03.140').toString()
 '-3.14'
> format.big(null)
 Error('Invalid number')
```

#### format.blockNumber <a id="util/format.js/format/(static)blockNumber"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------------------------------------------------------
arg  | `number,string` | true     |         | number or label, See [BLOCK_NUMBER](#CONST.js/BLOCK_NUMBER)

* **Returns**

`string` 

* **Examples**

```
> format.blockNumber(10)
 "0xa"
> format.blockNumber(BLOCK_NUMBER.LATEST)
 "latest"
> format.blockNumber('earliest')
 "earliest"
```

#### format.address <a id="util/format.js/format/(static)address"></a>

Checks if a given string is a valid address.
It will also check the checksum, if the address has upper and lowercase letters.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.address('0xbbb62a2252f998225886fed4f2a9dac3c94de681')
 "0xBbb62A2252F998225886FEd4f2A9DaC3C94dE681"
```

#### format.hex <a id="util/format.js/format/(static)hex"></a>

When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

* **Parameters**

Name | Type                                       | Required | Default | Description
-----|--------------------------------------------|----------|---------|------------
arg  | `number,BigInt,string,Buffer,boolean,null` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.hex(null)
 '0x'
> format.hex(1)
 "0x01"
> format.hex(256)
 "0x0100"
> format.hex(true)
 "0x01"
> format.hex(Buffer.from([1,10,255]))
 "0x010aff"
> format.hex("0x0a")
 "0x0a"
```

#### format.blockHash <a id="util/format.js/format/(static)blockHash"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

#### format.transactionHash <a id="util/format.js/format/(static)transactionHash"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

#### format.privateKey <a id="util/format.js/format/(static)privateKey"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

#### format.publicKey <a id="util/format.js/format/(static)publicKey"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
```

#### format.hexBuffer <a id="util/format.js/format/(static)hexBuffer"></a>

* **Parameters**

Name | Type                                       | Required | Default | Description
-----|--------------------------------------------|----------|---------|------------
arg  | `number,string,BigInt,Buffer,boolean,null` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> format.hexBuffer(Buffer.from([0, 1]))
 <Buffer 00 01>
> format.hexBuffer(null)
 <Buffer >
> format.hexBuffer(1024)
 <Buffer 04 00>
> format.hexBuffer('0x0a')
 <Buffer 0a>
> format.hexBuffer(true)
 <Buffer 01>
> format.hexBuffer(3.14)
 Error("not match hex")
```

#### format.bytes <a id="util/format.js/format/(static)bytes"></a>

* **Parameters**

Name | Type                  | Required | Default | Description
-----|-----------------------|----------|---------|------------
arg  | `string,Buffer,array` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> format.bytes('abcd')
 <Buffer 61 62 63 64>
> format.bytes([0, 1])
 <Buffer 00 01>
> format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
```

#### format.boolean <a id="util/format.js/format/(static)boolean"></a>

* **Parameters**

Name | Type      | Required | Default | Description
-----|-----------|----------|---------|------------
arg  | `boolean` | true     |         |

* **Returns**

`boolean` 

* **Examples**

```
> format.boolean(true)
 true
> format.boolean(false)
 false
```

#### format.keccak256 <a id="util/format.js/format/(static)keccak256"></a>

Compute the keccak256 cryptographic hash of a value, returned as a hex string.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` 

* **Examples**

```
> format.keccak256('Transfer(address,address,uint256)')
 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
> format.keccak256(Buffer.from([0x42]))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256(format.hexBuffer('0x42'))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256('0x42') // "0x42" as string and transfer to <Buffer 30 78 34 32> by ascii
 "0x3c1b2d38851281e9a7b59d10973b0c87c340ff1e76bde7d06bf6b9f28df2b8c0"
```

----------------------------------------

### keccak256 <a id="util/sign.js/keccak256"></a>

keccak 256

* **Parameters**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|------------
buffer | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> keccak256(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

----------------------------------------

### checksumAddress <a id="util/sign.js/checksumAddress"></a>

Makes a checksum address

> Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
> Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         | Hex string

* **Returns**

`string` 

* **Examples**

```
> checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```

----------------------------------------

### randomBuffer <a id="util/sign.js/randomBuffer"></a>

gen a random buffer with `size` bytes.

> Note: call `crypto.randomBytes`

* **Parameters**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|------------
size | `number` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> randomBuffer(0)
 <Buffer >
> randomBuffer(1)
 <Buffer 33>
> randomBuffer(1)
 <Buffer 5a>
```

----------------------------------------

### randomPrivateKey <a id="util/sign.js/randomPrivateKey"></a>

Gen a random PrivateKey buffer.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
entropy | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```

```
> entropy = randomBuffer(32)
> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```

----------------------------------------

### privateKeyToPublicKey <a id="util/sign.js/privateKeyToPublicKey"></a>

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

----------------------------------------

### publicKeyToAddress <a id="util/sign.js/publicKeyToAddress"></a>

Get account address by public key.

> Account address hex starts with '0x1'

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
publicKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> publicKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

----------------------------------------

### privateKeyToAddress <a id="util/sign.js/privateKeyToAddress"></a>

Get address by private key.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

### ecdsaSign <a id="util/sign.js/ecdsaSign"></a>

Sign ecdsa

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
hash       | `Buffer` | true     |         |
privateKey | `Buffer` | true     |         |

* **Returns**

`object` ECDSA signature object.
- r {Buffer}
- s {Buffer}
- v {number}

* **Examples**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  recovery: 0
 }
```

----------------------------------------

### ecdsaRecover <a id="util/sign.js/ecdsaRecover"></a>

Recover ecdsa

* **Parameters**

Name             | Type     | Required | Default | Description
-----------------|----------|----------|---------|------------
hash             | `Buffer` | true     |         |
options          | `object` | true     |         |
options.r        | `Buffer` | true     |         |
options.s        | `Buffer` | true     |         |
options.recovery | `number` | true     |         |

* **Returns**

`Buffer` publicKey

* **Examples**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

### encrypt <a id="util/sign.js/encrypt"></a>

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
privateKey | `Buffer`        | true     |         |
password   | `string,Buffer` | true     |         |

* **Returns**

`object` - keystoreV3 object

* **Examples**

```
> encrypt(Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'), 'password')
 {
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }
```

----------------------------------------

### decrypt <a id="util/sign.js/decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
keystoreV3 | `object`        | true     |         |
password   | `string,Buffer` | true     |         |

* **Returns**

`Buffer` Buffer of private key

* **Examples**

```
> decrypt({
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }, 'password')
 <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef>
```

----------------------------------------

### PrivateKeyAccount <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount"></a>



#### PrivateKeyAccount.random <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)random"></a>

Create a new PrivateKeyAccount with random privateKey.

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|--------------------------
entropy | `string,Buffer` | false    |         | Entropy of random account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.random()
   PrivateKeyAccount {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: '0x1cecb4a2922b7007e236daf0c797de6e55496e84'
    }
> PrivateKeyAccount.random() // gen a different account from above
   PrivateKeyAccount {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: '0x16c25691aadc3363f5862d264072584f3ebf4613'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   PrivateKeyAccount {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: '0x113d49784c80d6f8fdbc0bef5a5ab0d9c9fee520'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
// gen a different account from above, even use same entropy
   PrivateKeyAccount {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: '0x1f63fcef4aaa88c03cbb5c9fb34be69dee65d0a8'
    }
```

#### PrivateKeyAccount.decrypt <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name     | Type            | Required | Default | Description
---------|-----------------|----------|---------|---------------------------------------
keystore | `object`        | true     |         | Keystore version 3 object.
password | `string,Buffer` | true     |         | Password for keystore to decrypt with.

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.decrypt({
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }, 'password');
   PrivateKeyAccount {
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```

#### PrivateKeyAccount.prototype.**constructor** <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/**constructor**"></a>

Create a account by privateKey.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|-----------------------
privateKey | `string,Buffer` | true     |         | Private key of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   PrivateKeyAccount {
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```

#### PrivateKeyAccount.prototype.encrypt <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/encrypt"></a>

Encrypt account privateKey to object.

* **Parameters**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|------------
password | `string` | true     |         |

* **Returns**

`object` - keystoreV3 object

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> account.encrypt('password')
   {version:3, id:..., address:..., crypto:...}
```

#### PrivateKeyAccount.prototype.signTransaction <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/signTransaction"></a>

Sign a transaction.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|----------------------------------------------
options | `object` | true     |         | See [Transaction](Transaction.js/constructor)

* **Returns**

`Promise.<Transaction>` 

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> transaction = account.signTransaction({
      nonce: 0,
      gasPrice: 100,
      gas: 10000,
      storageLimit: 10000,
      epochHeight: 100,
      chainId: 0,
    })

   Transaction {
      from: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
      nonce: 0,
      gasPrice: 100,
      gas: 10000,
      to: undefined,
      value: undefined,
      storageLimit: 10000,
      epochHeight: 100,
      chainId: 0,
      data: undefined,
      v: 0,
      r: '0x096f4e00ac15f6bd6e09937e99f0e54aaa2dd0f4c6bd8421e1e81b0e8bd30723',
      s: '0x41e63a41ede0cbb8ccfaa827423c654dcdc09fb1aa1c3a7233566544aff4cd9a'
    }
```

#### PrivateKeyAccount.prototype.signMessage <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/signMessage"></a>

Sign a string.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
options | `string` | true     |         |

* **Returns**

`Promise.<Message>` 

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> message = account.signMessage('Hello World')
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
```

----------------------------------------

### Wallet <a id="wallet/Wallet.js/Wallet"></a>

Wallet to manager accounts.

#### Wallet.prototype.has <a id="wallet/Wallet.js/Wallet/has"></a>

Check if address exist

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`boolean` 

#### Wallet.prototype.delete <a id="wallet/Wallet.js/Wallet/delete"></a>

Drop one account by address

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`boolean` 

#### Wallet.prototype.clear <a id="wallet/Wallet.js/Wallet/clear"></a>

Drop all account in wallet

#### Wallet.prototype.set <a id="wallet/Wallet.js/Wallet/set"></a>

* **Parameters**

Name    | Type      | Required | Default | Description
--------|-----------|----------|---------|-------------------------------------
address | `string`  | true     |         | Key of account, usually is `address`
account | `Account` | true     |         | Account instance

* **Returns**

`Wallet` 

#### Wallet.prototype.get <a id="wallet/Wallet.js/Wallet/get"></a>

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`Account` 

#### Wallet.prototype.addPrivateKey <a id="wallet/Wallet.js/Wallet/addPrivateKey"></a>

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|-----------------------
privateKey | `string,Buffer` | true     |         | Private key of account

* **Returns**

`PrivateKeyAccount` 

#### Wallet.prototype.addRandom <a id="wallet/Wallet.js/Wallet/addRandom"></a>

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|--------------------------
entropy | `string,Buffer` | false    |         | Entropy of random account

* **Returns**

`PrivateKeyAccount` 

#### Wallet.prototype.addKeystore <a id="wallet/Wallet.js/Wallet/addKeystore"></a>

* **Parameters**

Name     | Type            | Required | Default | Description
---------|-----------------|----------|---------|---------------------------------------
keystore | `object`        | true     |         | Keystore version 3 object.
password | `string,Buffer` | true     |         | Password for keystore to decrypt with.

* **Returns**

`PrivateKeyAccount` 
