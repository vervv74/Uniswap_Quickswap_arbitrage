require("@nomiclabs/hardhat-waffle");
let sum, number, Profit, bal, bal1, fltry;
sum = ethers.BigNumber.from('10000');
require('dotenv').config();
(async () => {
  const Const = await require('./constant.js');
  const Calc = require('./calc_Functions.js');

  bal = await Const.USDCToken.getBalance(Const.mycontract.address);
  console.log(`USDC before ${bal} `);
 await Calc.Transfer_to_sc(ethers.BigNumber.from(sum.div(ethers.BigNumber.from('5'))));

  bal = await Const.USDCToken.getBalance(Const.mycontract.address);
  console.log(`USDC after ${bal} `);
 
})();
