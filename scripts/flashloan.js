require("@nomiclabs/hardhat-waffle");
let sum, number, Profit, bal, bal1, fltry, max;
require('dotenv').config();
sum = ethers.BigNumber.from('200000');
(async () => {
  const Const = await require('./constant.js');
  const Calc = require('./calc_Functions.js');


  await Calc.Transfer_to_sc(sum.div(ethers.BigNumber.from('5')));

  //ProfitQuick = await Calc.ProfitQuick(sum);


  number = 0;
  Sushi = 0;
  Quick = 0;
  max = ethers.BigNumber.from('-200000');;
  Const.provider.on("block", async (blockNumber) => {

    try {
      console.log(` _____________START__________________________`);
      console.log(`iteration ${number}  blocknumber ${blockNumber}`);
      bal = await Const.USDCToken.getBalance(Const.mycontract.address);
      console.log(`USDC before FL ${bal} `);
      number++;
      ProfitQuick = await Calc.ProfitQuick(sum);
      ProfitSushi = await Calc.ProfitSushi(sum);
      max = Math.max(max, ProfitSushi.profitGas2, ProfitQuick.profitGas2)
      console.log(` SushiProfit ${ProfitSushi.profitGas2} QuickProfit ${ProfitQuick.profitGas2}   max ${max}` );
      switch (ethers.BigNumber.from(ProfitQuick.profitGas2).gt(ethers.BigNumber.from('0'))  || ethers.BigNumber.from(ProfitSushi.profitGas2).gt(ethers.BigNumber.from('0')))  {
        case true:
          switch (ethers.BigNumber.from(ProfitQuick.profitGas2).gt(ethers.BigNumber.from(ProfitSushi.profitGas2))) {
            case true:
              Quick++;
              //await Calc.FL(process.env.USDC, process.env.USDT, 500, sum, 100, process.env.WMATIC, 500, 0);
              break;
            case false:
              Sushi++;
              //await Calc.FL(process.env.USDC, process.env.USDT, 500, sum, 100, process.env.WMATIC, 500, 1);
              break;
            default:
              break;
          }
          break;
        case false:
          await Calc.FL(process.env.USDC, process.env.USDT, 500, sum, 100, process.env.WMATIC, 500, 0);
          break;
        default:
          break;
      }


      bal = await Const.USDCToken.getBalance(Const.mycontract.address);
      console.log(`USDC after FL ${bal} `);
      console.log(`SushiFL ${Sushi} QuickFL ${Quick}`);
      console.log(`SushiFL ${Sushi} QuickFL ${Quick}`);
      console.log(`iteration ${number} _____________Finish__________________________`);
    }
    catch (e) { console.log(e) }

  })


})();
