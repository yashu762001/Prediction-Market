require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKETCAP_API_KEY = process.env.COIN_MARKETCAP_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },

    rinkeby: {
      chainId: 4,
      blockConfirmations: 6,
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },

    kovan: {
      chainId: 42,
      blockConfirmations: 6,
      url: KOVAN_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COIN_MARKETCAP_API_KEY,
  },
  solidity: {
    compilers: [
      { version: "0.8.5" },
      { version: "0.4.19" },
      { version: "0.6.6" },
      { version: "0.6.12" },
      { version: "0.5.0" },
      { version: "0.5.1" },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },

    player1: {
      default: 2,
    },

    player2: {
      default: 3,
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  mocha: {
    timeout: 300000,
  },
};
