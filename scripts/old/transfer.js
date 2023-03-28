require("@nomiclabs/hardhat-waffle");
let sum, balance;
sum = ethers.BigNumber.from('1000000');
require('dotenv').config();
(async () => {
  const Const = await require('./constant.js');
  const Calc = require('./calc_Functions.js');
  bal = await Const.USDCToken.getBalance(Const.mycontract.address);
  bal1 = await Const.USDCToken.getBalance(Const.signer.address);
  console.log(`${bal}  ${bal1}`);

  await Calc.Transfer_to_sc(sum);
  bal = await Const.USDCToken.getBalance(Const.mycontract.address);
  bal1 = await Const.USDCToken.getBalance(Const.signer.address);
  console.log(`${bal}  ${bal1}`);
  try { await Calc.FL(process.env.USDC, process.env.USDT, 500, sum, 100, process.env.WMATIC, 500); }
  catch (e) { console.log(e) };
  bal = await Const.USDCToken.getBalance(Const.mycontract.address);
  bal1 = await Const.USDCToken.getBalance(Const.signer.address);
  console.log(`${bal}  ${bal1}`);
  await Calc.transfer(process.env.USDC, bal, Const.signer.address);
})();
