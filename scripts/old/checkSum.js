require("@nomiclabs/hardhat-waffle");
let sum, balUSDC,balMatic;
sum = ethers.BigNumber.from('200000');
//sum1 = ethers.BigNumber.from('100000000');
require('dotenv').config();
(async () => {
  const Const = await require('./constant.js');
  const Calc = require('./calc_Functions.js');
  
  //await Calc.Transfer_to_sc(sum);
  balUSDC = await Const.USDCToken.getBalance(Const.mycontract.address);
  balMatic = await Const.mycontract.balanceMatic(Const.signer.address);
  console.log(`USDC before FL ${balUSDC}  Matic before FL ${balMatic}`);
  ProfitQuick1 = await Calc.ProfitQuick(sum);
  console.log(`profit ${ProfitQuick1.profitGas} profit ${ProfitQuick1.profitGas2} gasUSDC ${ProfitQuick1.gasUSDC} gasMatic ${ProfitQuick1.gas} sum ${sum}`)
  //await Calc.FL(process.env.USDC, process.env.USDT, 500, sum1, 100, process.env.WMATIC, 500,0);
  balUSDC = await Const.USDCToken.getBalance(Const.mycontract.address);
  balMatic = await Const.mycontract.balanceMatic(Const.signer.address);
  console.log(`USDC before after ${balUSDC}  Matic after FL ${balMatic}`);

/*   ProfitQuick = await Calc.ProfitQuick(sum);
  ProfitQuick1 = await Calc.ProfitQuick(sum1);
  console.log(`profit ${ProfitQuick.profitGas} gasUSDC ${ProfitQuick.gasUSDC} gasMatic ${ProfitQuick.gas} sum ${sum}`);
  console.log(`profit ${ProfitQuick1.profitGas} gasUSDC ${ProfitQuick1.gasUSDC} gasMatic ${ProfitQuick1.gas} sum ${sum1}`) */

 

})();
