require("@nomiclabs/hardhat-waffle");
const Holder = process.env.Holder;
const USDC = process.env.USDC;
const WETH = process.env.WETH;
const WMATIC = process.env.WETH;
const Router = process.env.QuickSwapUniswapV2Router02;
const MyContractAddress = process.env.ContractAdress;
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const Sc = require('../artifacts/contracts/MyContract.sol/MyContract.json');
use(Web3ClientPlugin);
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
    const USDCToken = posClient.erc20(process.env.USDC);
    const WETHToken = posClient.erc20(process.env.WETH);
   
    weth = await WETHToken.getBalance(MyContractAddress);
    usdc = await USDCToken.getBalance(MyContractAddress);
    console.log(`weth ${weth} usdc ${usdc}`);
    /* const gas = await mycontract.estimateGas.swapExactETHForTokens(USDC, Router, {
        value: '10'
    });
    const receipt = await mycontract.swapExactETHForTokens(USDC, Router, {
        value: '10',
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    }); */
    const gas = await mycontract.estimateGas.swapExactTokenForTokens('1000', WETH, USDC, Router);
  

    await receipt.wait();
    weth = await WETHToken.getBalance(MyContractAddress);
    usdc = await USDCToken.getBalance(MyContractAddress);
    console.log(`weth ${weth} usdc ${usdc}`);
   
})();
