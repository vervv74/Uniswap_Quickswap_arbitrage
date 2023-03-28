const hre = require("hardhat");
//const { ethers } = require("hardhat");
require('dotenv').config();
const Holder = process.env.Holder;
const Sc = require('../artifacts/contracts/MyContract.sol/MyContract.json');
const MyContractAddress = process.env.ContractAdress;
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
use(Web3ClientPlugin);

module.exports = (async()=>{
     await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [Holder],
    });
   signer = await ethers.getSigner(Holder);
  // const [signer] = await ethers.getSigners();
    provider = await signer.provider;
    mycontract = new ethers.Contract(MyContractAddress, Sc.abi, signer);
    const posClient = new POSClient();
    await posClient.init({
        network: 'mainnet',
        version: 'v1',
        parent: {
            provider: signer,
            defaultConfig: {
                from: signer.address
            }
        },
        child: {
            provider: signer,
            defaultConfig: {
                from: signer.address
            }
        },

    });
    USDCToken = posClient.erc20(process.env.USDC);
    WMATICToken = posClient.erc20(process.env.WMATIC);
    const Const = {signer, mycontract, USDCToken, WMATICToken,   provider, Holder};
    return Const;
})();




