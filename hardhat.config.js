require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const alchemy_key = process.env.alchemy_key;
const acc_key = process.env.acc_key;
module.exports = {
  solidity: "0.7.6",
  defaultNetwork: "polygon",
  networks: {
    hardhat: {
      
      forking: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/${alchemy_key}",
        // url: "https://nd-823-757-203.p2pify.com/9e32327fdf1ef1e69280a4a6a01fedc9", //chainstack
        enabled: true,
      },
      mining: {
        auto: false,
        interval: 10000
      },

    },
    polygon:{
      url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemy_key}`,
      accounts: [acc_key],
    },
    localhost: {
      url: "http://localhost:8545"
    }
  },
  mocha: {
    timeout: 100000000000000
  },

};