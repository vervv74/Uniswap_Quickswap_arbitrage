const hre = require("hardhat");
async function main() {
    require('dotenv').config();
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [process.env.Holder],
    });
    signer = await ethers.getSigner(process.env.Holder);
    //const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", signer.address);
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy(process.env.SwapRouter, process.env.FACTORY, process.env.WMATIC);
    console.log("address:", myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });