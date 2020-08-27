const superagent = require('superagent');
require('superagent-retry-delay')(superagent);
const agent = superagent.agent();
const initialQtty = 1000;
const maxQtty = 10000;
const maxDeviation = 5;//%
const errMsgDailyLimit = 'Error: You have used your quota of random bits for today.  See the quota page for details.';
//const dicesQtty = 1;//?
const howQuick = 2.5;
var currentQtty = initialQtty;
var currentDeviation = 10;
var iterationNumber = 0;

describe.only('Test', async function () {
    it('Get all rolls', async function () {
        while (currentDeviation > 1 + maxDeviation / 100) {
            currentQtty < maxQtty
                ? console.log(`Iteration No: ${++iterationNumber}, we are trying ${currentQtty}`)
                : console.log(`Iteration No: ${++iterationNumber}, we are trying the maximum: ${currentQtty = maxQtty}`);

            let res = await agent
                .get(`https://www.random.org/integers/?num=${currentQtty}&min=1&max=6&col=1&base=10&format=plain&rnd=new`)
                .then((res) => {
                    return res;
                });

            if (res.text.toString().includes(errMsgDailyLimit)) {
                console.error(`\x1B[33mOops... Unfortunately you can't make this API-request today anymore, server reported:
\x1b[1m\x1B[31m${errMsgDailyLimit}\x1b[0m
\x1B[33mYou can try to repeat tomorrow or change your IP\x1b[0m`);
                exit;//не знаю, як завалити тест, щоб закінчився із помилкою
            }

            let allRolls = await res.text.split("\n");
            let scoreOfRolls = [0, 0, 0, 0, 0, 0];
            for (let i = 0; i < allRolls.length; i++) {
                switch (allRolls[i]) {
                    case "1":
                        scoreOfRolls[0]++;
                        break;
                    case "2":
                        scoreOfRolls[1]++;
                        break;
                    case "3":
                        scoreOfRolls[2]++;
                        break;
                    case "4":
                        scoreOfRolls[3]++;
                        break;
                    case "5":
                        scoreOfRolls[4]++;
                        break;
                    case "6":
                        scoreOfRolls[5]++;
                        break;
                }//switch-case
            }//for

            currentDeviation = await Math.max(...scoreOfRolls) / Math.min(...scoreOfRolls);

            if (scoreOfRolls[0] == 0) {
                cosole.log(`\x1B[33mSomething went wrong, please recheck your code\x1b[0m`)
            } else if (currentDeviation > 1 + maxDeviation / 100) {
                console.log(`Current deviation is \x1b[33m${currentDeviation}\x1b[0m at \x1b[33m${currentQtty}\x1b[0m, \x1b[35mnot enough.\x1b[0m Let's increase quantity to \x1b[33m${currentQtty = Math.round(currentQtty * currentDeviation * howQuick)}\x1b[0m`)
                if (currentQtty < maxQtty) {
                    console.log(`...`)
                } else {
                    console.log(`\x1b[35mOops, to much... Now we can try only the maximum: \x1b[1m${maxQtty}\x1b[0m     
...`)
                }
            } else {
                console.log(`\x1B[32mCurrent deviation is OK: \x1B[1m${currentDeviation}\x1b[0m\x1b[32m at \x1b[1m${currentQtty}\x1b[0m\x1b[33m which delivers \x1b[0m[${scoreOfRolls}])\x1B[0m`)
            }
        }//while
    });//Get all rolls
});
