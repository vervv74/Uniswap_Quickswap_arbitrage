require("@nomiclabs/hardhat-waffle");
let all;
require('dotenv').config();
sum = ethers.BigNumber.from('100000');
(async () => {
  const Const = await require('../constant.js');
  const Calc = require('../calc_Functions.js');

  all = await Const.USDCToken.getAllowance(Const.signer.address, {
    spenderAddress: Const.mycontract.address
});
console.log(`allowance ${all} signer ${Const.signer.address} mycontract ${Const.mycontract.address}`);
const approveResult = await Const.USDCToken.approve(ethers.BigNumber.from('1').toString(), {
  spenderAddress: Const.mycontract.address
});
const txHash = await approveResult.getTransactionHash();
const txReceipt = await approveResult.getReceipt();
all = await Const.USDCToken.getAllowance(Const.signer.address, {
  spenderAddress: Const.mycontract.address
});
console.log(`allowance ${all} signer ${Const.signer.address} mycontract ${Const.mycontract.address}`);
})();
