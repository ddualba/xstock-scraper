const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async browser => {
  console.log('Running tests..');
  const page = await browser.newPage();
  await page.goto(
    'https://www.amazon.com/Xbox-X/dp/B08H75RTZ8?tag=georiot-us-default-20&ascsubtag=grd-us-2450637296955196000-20&geniuslink=true'
  );
  await page.waitForTimeout(5000);

  // attempt to login
  await page.screenshot({ path: 'testresult.png', fullPage: false });
  await browser.close();
  console.log(`All done, check the screenshot. ✨`);
});
