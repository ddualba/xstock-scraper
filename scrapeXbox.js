require('dotenv').config();
const CREDS = require('./creds/creds');
const axios = require('axios');

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

let msgSentCount = 0;

async function scrapeTarget(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(5000);

  // attempt to scrape
  try {
    const [el2] = await page.$x(
      '//*[@id="viewport"]/div[4]/div/div[2]/div[3]/div[1]/div/div/div'
    );
    const txt2 = await el2.getProperty('textContent');
    const avail = await txt2.jsonValue();

    if (avail === 'Sold out') {
      console.log('\x1b[31m', 'Target  : Cant Buy Yet!');
    } else {
      console.log('Target  : ', { avail });
      msgSentCount++;
      if (msgSentCount <= 10) {
        sendDiscordMessage('Target');
      }
    }
  } catch (error) {
    console.log('\x1b[31m', 'Target  : Scrape Fail!');
  }

  browser.close();
}

async function scrapeGameStop(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(5000);

  try {
    const [el2] = await page.$x(
      '//*[@id="primary-details"]/div[4]/div[13]/div[3]/div/div[1]/button'
    );
    const txt2 = await el2.getProperty('textContent');
    const avail = await txt2.jsonValue();

    if (avail === 'Not Available') {
      console.log('\x1b[31m', 'GameStop: Cant Buy Yet!');
    } else {
      console.log('GameStop: ', { avail });
      msgSentCount++;
      if (msgSentCount <= 10) {
        sendDiscordMessage('GameStop');
      }
    }
  } catch (error) {
    console.log('\x1b[31m', 'GameStop: Scrape Fail!');
  }

  browser.close();
}

async function NotWorking_scrapeBestBuy(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(10000);

  const [el2] = await page.$x(
    '//*[@id="fulfillment-add-to-cart-button-12511831"]/div/div/div/button'
  );
  const txt2 = await el2.getProperty('textContent');
  const avail = await txt2.jsonValue();

  // if (avail === 'Not Available') {
  //   console.log('\x1b[31m', 'GameStop: Cant Buy Yet!');
  // } else {
  //   //
  // }
  console.log('Best Buy: ', { avail });

  browser.close();
}

async function scrapeCostco(url, cycles) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(5000);

  // Go to login screen
  const BUTTON_SELECTOR = '#sign-in-to-buy-button-v2';
  await page.click(BUTTON_SELECTOR);
  await page.waitForTimeout(3000);

  const USERNAME_SELECTOR = '#logonId';
  const PASSWORD_SELECTOR = '#logonPassword';
  const LOGIN_SELECTOR = '#LogonForm > fieldset > div:nth-child(6) > input';

  // attemp to login

  try {
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);
    await page.waitForTimeout(1000);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    await page.click(LOGIN_SELECTOR);
    await page.waitForTimeout(3000);
  } catch (error) {
    browser.close();
    return console.log('Error logging in');
  }

  console.log(`Running for ${cycles} cycles`);
  for (i = 0; i < cycles; i++) {
    // start scraping
    try {
      const [el2] = await page.$x('//*[@id="add-to-cart-btn"]');
      const txt2 = await el2.getProperty('value');
      const avail = await txt2.jsonValue();

      if (avail === 'Out of Stock') {
        console.log('\x1b[31m', 'Costco  : Cant Buy Yet!');
      } else {
        console.log('Costco: ', { avail });
        msgSentCount++;
        if (msgSentCount <= 10) {
          sendDiscordMessage('Costco');
        }
      }
    } catch (error) {
      console.log('\x1b[31m', 'Costco  : Scrape Fail!');
    }

    await page.waitForTimeout(50000);
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    //scrape others while in loop
    scrapeTarget('https://www.target.com/p/xbox-series-x-console/-/A-80790841');
    scrapeGameStop(
      'https://www.gamestop.com/video-games/xbox-series-x/consoles/products/xbox-series-s-digital-edition/B224746K.html'
    );
  }

  browser.close();
}

async function sendDiscordMessage(location) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  const msg = `Xbox is back in stock at location: ${location}`;
  try {
    await axios.post(url, { content: msg });
  } catch (err) {
    console.log('issue sending discord message');
    // console.error(err);
  }
}

// scrapeBestBuy(
//   'https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324'
// );

// scrapeTarget('https://www.target.com/p/xbox-series-x-console/-/A-80790841');
// scrapeGameStop(
//   'https://www.gamestop.com/video-games/xbox-series-x/consoles/products/xbox-series-s-digital-edition/B224746K.html'
// );
scrapeCostco(
  'https://www.costco.com/xbox-series-x-1tb-console-with-additional-controller.product.100691493.html',
  600
);
