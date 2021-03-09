# my-xbox-scraper

nodejs terminal program, checks availability, displays status in terminal,
,sends discord message on availability

Need dotenv file to store discord URL for send message when item becomes
available

Main file to run is scrapeXbox.js which will scrape Costco, Target and GameStop,
which don't have aggresive captchas/bot detection. Costco requires signing in,
so you need to provide credentials in a cred.js, example below. scrapeCostco
function will run for 600 cycles, or 600 minutes by default. Adjust accordingly
or ctrl-c to break out of the terminal application.

msgSentCount variable is so that in the event of stock available your discord
webhook url is not bombarded by more than 10 messages.

## .env EXAMPLE

DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/9174#0104229986980/0Ytl-Ic97oclzczjhMxHKyJSz1BoNukyzi5Ukw5y3xODJ5spS60AHPmQoq_s3tXEeojB

Need a creds.js file inside a creds subfolder to store your COSTCO login info to
bypass login process

## cred.js EXAMPLE

const username = 'myCostcoUsername';

const password = 'myCostcoPW';

exports.username = username;

exports.password = password;
