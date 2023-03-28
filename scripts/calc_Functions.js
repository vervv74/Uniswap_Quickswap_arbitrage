
const num18 = ethers.BigNumber.from('1000000000000000000');
const num6 = ethers.BigNumber.from('1000000');
const num12 = ethers.BigNumber.from('1000000000000');
const { abi } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { LogDescription } = require("ethers/lib/utils.js");
require('dotenv').config();

module.exports = {
    Uniswap_Quickswap: (async (sum, number1) => {

    }),
    transfer: (async (token, sum, recepient) => {
        const Const = await require('./constant.js');
        const gas = await Const.mycontract.estimateGas.transfer(token, sum, recepient);
        const receipt = await Const.mycontract.transfer(token, sum, recepient, {
            gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
        });
        await receipt.wait();
    }),
    balanceWMATIC: (async (tokenOwner) => {
        const balance = await Const.WMATICToken.getBalance(tokenOwner);
        return balance;
    }),
    balanceUSDC: (async (tokenOwner) => {
        const balance = await Const.USDCToken.getBalance(tokenOwner);
        return balance;
    }),
    Transfer_to_sc: (async (sum) => {
        const Const = await require('./constant.js');
        const approveResult = await Const.USDCToken.approve(ethers.BigNumber.from(sum).mul(ethers.BigNumber.from('2')).toString(), {
            spenderAddress: Const.mycontract.address
        });
        const txHash = await approveResult.getTransactionHash();
        const txReceipt = await approveResult.getReceipt();
        all = await Const.USDCToken.getAllowance(Const.signer.address, {
            spenderAddress: Const.mycontract.address
        });
        console.log(`allowance ${all} signer ${Const.signer.address} mycontract ${Const.mycontract.address}`);
        const gas = await Const.mycontract.estimateGas.transferFrom(process.env.USDC, Const.signer.address, Const.mycontract.address, sum);
        const receipt = await Const.mycontract.transferFrom(process.env.USDC, Const.signer.address, Const.mycontract.address, sum, {
            gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
        });
        await receipt.wait();
    }),

    FL: (async (tokenIn, tokenTech, fee1, sum, fee2, tokenOut, fee4, direction) => {
        const Const = await require('./constant.js');
        const tx = {
            token0: tokenIn,
            token1: tokenTech,
            fee1: fee1,
            amount0: ethers.BigNumber.from(sum),
            amount1: '0',
            fee2: fee2,
            fee3: 0,
            token2: tokenOut,
            fee4: fee4,
            _direction: direction
        };
        const gasLimit = await Const.mycontract.estimateGas.initFlash(tx);
        const receipt = await Const.mycontract.initFlash(tx, {
            gasLimit: ethers.BigNumber.from(gasLimit).mul(ethers.BigNumber.from('2'))
        });
        const result = await receipt.wait();

        for (const event of result.events) {
            if (event.event = 'Bal' && event.args) { console.log(`  ${event.args} `); }
        }
    }),
    ProfitQuick: (async (sum) => {/// only for WMATIC_UNISwap pool
        const Const = await require('./constant.js');
        const pool = await Const.mycontract.poolAdress(process.env.WMATIC, process.env.USDC, 100);
        const poolContract = new ethers.Contract(
            pool,
            abi,
            Const.signer
        );
        const slot = await poolContract.slot0();
        const sqrtPriceX96 = slot[0].toString();
        UniswapW_U = ethers.BigNumber.from(ethers.FixedNumber.from(((sqrtPriceX96 ** 2 / (2 ** 192)) * num18).toString()));/// only for WMATIC_UNISwap pool
        UniswapU_W = ethers.BigNumber.from(ethers.FixedNumber.from((((2 ** 192) / sqrtPriceX96 ** 2)).toString()));///only for WMATIC_UNISwap pool
        const result1 = ethers.BigNumber.from(sum).mul(ethers.BigNumber.from(UniswapU_W)).div(num18);
        result2 = await mycontract.getAmountsOut(result1, process.env.WMATIC, process.env.USDC, process.env.QuickSwapUniswapV2Router02);
        profit = ethers.BigNumber.from(result2).sub(ethers.BigNumber.from(sum));
        const tx = {
            token0: process.env.USDC,
            token1: process.env.USDT,
            fee1: 500,
            amount0: ethers.BigNumber.from(sum),
            amount1: '0',
            fee2: 100,
            fee3: 0,
            token2: process.env.WMATIC,
            fee4: 500,
            _direction: 0
        };
        const gasLimit = await Const.mycontract.estimateGas.initFlash(tx);
        const gasPrice = await Const.signer.getGasPrice();
        const gas = ethers.BigNumber.from(gasLimit).mul(ethers.BigNumber.from(gasPrice));
        const gasUSDC = ethers.BigNumber.from(gas).mul(ethers.BigNumber.from(UniswapW_U)).div(num18).div(num18);
        const profitGas = ethers.BigNumber.from(profit).sub(ethers.BigNumber.from(gasUSDC));
        const profitGas2 = ethers.BigNumber.from(profit).sub(gasUSDC.div(ethers.BigNumber.from('2')));
        const Profit = { result1, result2, profit, profitGas, profitGas2, gasUSDC, gasLimit, gasPrice, gas};
        return Profit;
    }),
    ProfitSushi: (async (sum) => {/// only for WMATIC_UNISwap pool
        const Const = await require('./constant.js');
        const pool = await Const.mycontract.poolAdress(process.env.WMATIC, process.env.USDC, 100);
        const poolContract = new ethers.Contract(
            pool,
            abi,
            Const.signer
        );
        const slot = await poolContract.slot0();
        const sqrtPriceX96 = slot[0].toString();
        UniswapW_U = ethers.BigNumber.from(ethers.FixedNumber.from(((sqrtPriceX96 ** 2 / (2 ** 192)) * num18).toString()));/// only for WMATIC_UNISwap pool
        UniswapU_W = ethers.BigNumber.from(ethers.FixedNumber.from((((2 ** 192) / sqrtPriceX96 ** 2)).toString()));///only for WMATIC_UNISwap pool
        const result1 = ethers.BigNumber.from(sum).mul(ethers.BigNumber.from(UniswapU_W)).div(num18);
        result2 = await mycontract.getAmountsOut(result1, process.env.WMATIC, process.env.USDC, process.env.SushiswapRouter);
        profit = ethers.BigNumber.from(result2).sub(ethers.BigNumber.from(sum));
        const tx = {
            token0: process.env.USDC,
            token1: process.env.USDT,
            fee1: 500,
            amount0: ethers.BigNumber.from(sum),
            amount1: '0',
            fee2: 100,
            fee3: 0,
            token2: process.env.WMATIC,
            fee4: 500,
            _direction: 1
        };
        const gasLimit = await Const.mycontract.estimateGas.initFlash(tx);
        const gasPrice = await Const.signer.getGasPrice();
        const gas = ethers.BigNumber.from(gasLimit).mul(ethers.BigNumber.from(gasPrice));
        const gasUSDC = ethers.BigNumber.from(gas).mul(ethers.BigNumber.from(UniswapW_U)).div(num18).div(num18);
        const profitGas = ethers.BigNumber.from(profit).sub(ethers.BigNumber.from(gasUSDC));
        const profitGas2 = ethers.BigNumber.from(profit).sub(gasUSDC.div(ethers.BigNumber.from('2')));
        const Profit = { result1, result2, profit, profitGas, profitGas2,gasLimit, gasPrice, gas, gasUSDC };
        return Profit;
    }),
}

