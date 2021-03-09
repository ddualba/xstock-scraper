const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async browser => {
  console.log('Running tests..');
  const page = await browser.newPage();
  await page.goto(
    'https://www.costco.com/xbox-series-x-1tb-console-with-additional-controller.product.100691493.html'
  );
  await page.waitForTimeout(5000);

  // attempt to login
  const BUTTON_SELECTOR = '#sign-in-to-buy-button-v2';
  await page.click(BUTTON_SELECTOR);
  await page.waitForTimeout(3000);

  const USERNAME_SELECTOR = '#logonId';
  const PASSWORD_SELECTOR = '#logonPassword';
  const LOGIN_SELECTOR = '#LogonForm > fieldset > div:nth-child(6) > input';

  console.log('Logging in - Type username');
  const CREDS = require('./creds/creds');
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(CREDS.username);
  await page.waitForTimeout(1000);
  console.log('Logging in - Type password');
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);
  console.log('Logging in - click Login');
  await page.click(LOGIN_SELECTOR);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'testresult.png', fullPage: false });
  await browser.close();
  console.log(`All done, check the screenshot. ✨`);
});
