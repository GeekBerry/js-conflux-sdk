/* eslint-disable */
const lodash = require('lodash');
const fs = require('fs');
const solc = require('solc');

function importFile(filename) {
  const contents = fs.readFileSync(filename).toString();
  return { contents };
}

function compileFile(filename) {
  const input = {
    language: 'Solidity',
    sources: {
      [filename]: {
        content: fs.readFileSync(filename).toString(),
      },
    },
    settings: { outputSelection: { '*': { '*': ['*'] } } },
  };

  const inputJson = JSON.stringify(input);
  const outputJson = solc.compile(inputJson, {
    import: importFile,
  });
  return JSON.parse(outputJson);
}

function compile(name, input, output) {
  const { contracts, errors } = compileFile(input);
  lodash.forEach(errors, e => {
    switch (e.severity) {
      case 'warning':
        console.error(e.formattedMessage);
        break;

      case 'error':
        throw new Error(e.formattedMessage);

      default:
        break;
    }
  });

  const contract = contracts[input][name];
  const object = {
    abi: contract.abi,
    bytecode: `0x${contract.evm.bytecode.object}`,
  };
  fs.writeFileSync(output, JSON.stringify(object, null, 2));
}

// ============================================================================
if (process.mainModule.filename === __filename) {
  // compile('ERC20', `${__dirname}/erc20/ERC20.sol`, `${__dirname}/erc20/ERC20.json`);
}
