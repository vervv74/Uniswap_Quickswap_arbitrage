require("@nomiclabs/hardhat-waffle");
const Holder = process.env.Holder;
const USDC = process.env.USDC;
const WMATIC = process.env.WMATIC;
const Router = process.env.QuickSwapUniswapV2Router02;
const MyContractAddress = process.env.ContractAdress;
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
use(Web3ClientPlugin);
const Sc = require('../artifacts/contracts/MyContract.sol/MyContract.json');
const sum = ethers.BigNumber.from('10000000');
(async () => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [Holder],
    });
    signer = await ethers.getSigner(Holder);
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
    USDCToken = posClient.erc20(USDC);
    WMATICToken = posClient.erc20(process.env.WMATIC);
    approveResult = await USDCToken.approve(sum.toString(), {
        spenderAddress: mycontract.address
    });
    txHash = await approveResult.getTransactionHash();
    txReceipt = await approveResult.getReceipt();
    all = await USDCToken.getAllowance(signer.address, {
        spenderAddress: mycontract.address
    });
    console.log(`allowance USDC ${all}`);
    gas = await mycontract.estimateGas.transferFrom(USDC, signer.address, mycontract.address, sum);
    receipt = await mycontract.transferFrom(USDC, signer.address, mycontract.address, sum, {
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    });
    await receipt.wait();
    balance = await WMATICToken.getBalance(mycontract.address);
    balance1 = await USDCToken.getBalance(mycontract.address);
    balance2 = await WMATICToken.getBalance(signer.address);
    balance3 = await USDCToken.getBalance(signer.address);
    console.log(`signer WMatic ${balance2} signer USDC ${balance3} contract WMatic ${balance} contract USDC ${balance1}`);

    gas11 = await mycontract.estimateGas.swapExactInputSingle(USDC, WMATIC, 500, ethers.BigNumber.from(balance1));
    receipt2 = await mycontract.swapExactInputSingle(USDC, WMATIC, 500, ethers.BigNumber.from(balance1), {
        gasLimit: ethers.BigNumber.from(gas11).mul(ethers.BigNumber.from('2'))
    });
    await receipt2.wait();
    /*  gas1 = await mycontract.estimateGas.swapExactTokenForTokens(balance1, USDC, WMATIC,  Router);
     receipt1 = await mycontract.swapExactTokenForTokens(balance1, USDC, WMATIC,  Router, {
         gasLimit: ethers.BigNumber.from(gas1).mul(ethers.BigNumber.from('2'))
     });
     await receipt1.wait(); */
    balance = await WMATICToken.getBalance(mycontract.address);
    balance1 = await USDCToken.getBalance(mycontract.address);
    console.log(` contract WMatic ${balance} contract USDC ${balance1}`);



})();
