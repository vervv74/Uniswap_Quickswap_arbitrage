require("@nomiclabs/hardhat-waffle");
const Holder = process.env.Holder;
const USDC = process.env.USDC;
const WETH = process.env.WETH;
const WMATIC = process.env.WETH;
const Router = process.env.QuickSwapUniswapV2Router02;
sum = ethers.BigNumber.from('6243532');
sum1 = ethers.BigNumber.from('16243532');
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
    const MaticToken = posClient.erc20(process.env.WMATIC);



    weth = await WETHToken.getBalance(MyContractAddress);
    matic = await MaticToken.getBalance(MyContractAddress);
    usdc = await USDCToken.getBalance(MyContractAddress);
    console.log(`weth ${weth} matic ${matic}  usdc ${usdc}`);
    const gas = await mycontract.estimateGas.swapExactInputSingle(USDC, WETH,500, sum.div(ethers.BigNumber.from('2')));
    const receipt = await mycontract.swapExactInputSingle(USDC, WETH,500, sum.div(ethers.BigNumber.from('2')), {
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    });
    await receipt.wait();
    const gas1 = await mycontract.estimateGas.swapExactTokensForETH(sum.div(ethers.BigNumber.from('2')),USDC, Router );
    const receipt1 = await mycontract.swapExactTokensForETH(sum.div(ethers.BigNumber.from('2')),USDC, Router, {
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    });
    await receipt1.wait();


    weth = await WETHToken.getBalance(MyContractAddress);
    matic = await MaticToken.getBalance(MyContractAddress);
    usdc = await USDCToken.getBalance(MyContractAddress);
    console.log(`weth ${weth} matic ${matic}  usdc ${usdc}`);
   
})();
