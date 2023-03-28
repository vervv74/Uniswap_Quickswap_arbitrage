const pm2 = require('pm2');
pm2.connect(() => {
    pm2.start({
        name: "check",
        script: "npx hardhat run scripts/flashloan.js --network polygon", //or npm run start
    })
})