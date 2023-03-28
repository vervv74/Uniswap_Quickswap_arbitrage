require("@nomiclabs/hardhat-waffle");
let sum, number, Profit, balUSDC , balMatic , fltry;
require('dotenv').config();
sum = ethers.BigNumber.from('100000');
(async () => {
  const Const = await require('./constant.js');
  const Calc = require('./calc_Functions.js');

  balUSDC = await Const.USDCToken.getBalance(Const.mycontract.address);
  balMatic  = await Const.mycontract.balanceMatic(Const.signer.address);
  console.log(`USDC before FL ${balUSDC} Matic before FL ${balMatic}`);
//await Calc.FL(process.env.USDC, process.env.USDT, 500, sum, 100, process.env.WMATIC, 500,0);
 balUSDC = await Const.USDCToken.getBalance(Const.mycontract.address);
 balMatic  = await Const.mycontract.balanceMatic(Const.signer.address);
  console.log(`USDC after FL ${balUSDC} Matic after FL ${balMatic}`);
 
 
  



})();
