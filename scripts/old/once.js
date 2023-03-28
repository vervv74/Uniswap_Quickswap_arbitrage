require("@nomiclabs/hardhat-waffle");
let sum, number, Profit, bal, bal1, fltry;
sum = ethers.BigNumber.from('1000000');
require('dotenv').config();
(async () => {
  const Const = await require('./constant.js');
  const Calc = require('./calc_Functions.js');


  await Calc.Transfer_to_sc(sum);



    try {
      console.log(` _____________START__________________________`);
   
      bal = await Const.USDCToken.getBalance(Const.mycontract.address);
      console.log(`USDC before FL ${bal} `);
      number++;
      ProfitQuick = await Calc.ProfitQuick(sum);
      console.log(`result1 ${ProfitQuick.result1} result2 ${ProfitQuick.result2} profit ${ProfitQuick.profit} gasLimit ${ProfitQuick.gasLimit} gasPrice ${ProfitQuick.gasPrice} gas ${ProfitQuick.gas} gasUSDC ${ProfitQuick.gasUSDC} profitGas ${ProfitQuick.profitGas}`);
      ProfitSushi = await Calc.ProfitSushi(sum);
      console.log(`result1 ${ProfitSushi.result1} result2 ${ProfitSushi.result2} profit ${ProfitSushi.profit} gasLimit ${ProfitSushi.gasLimit} gasPrice ${ProfitSushi.gasPrice} gas ${ProfitSushi.gas} gasUSDC ${ProfitSushi.gasUSDC} profitGas ${ProfitSushi.profitGas}`);
    /*   switch (ethers.BigNumber.from(Profit.profitGas).gt(ethers.BigNumber.from('0'))) {
        case true:
          fltry.push(number);
          await Calc.FL(process.env.USDC, process.env.USDT, 500, sum, 100, process.env.WMATIC, 500);
          break;
        default:
          break;
      }
 */
      bal = await Const.USDCToken.getBalance(Const.mycontract.address);
      console.log(`USDC after FL ${bal} `);

      console.log(` _____________Finish__________________________`);

    }
    catch (e) { console.log(e) }




})();
