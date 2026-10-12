const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const screenshotsDir = path.join(__dirname, 'screenshots');

  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1200);

  // Click Hoodies category
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.trim() === 'Hoodies');
    if (b) b.click();
  });
  await delay(800);
  await page.screenshot({ path: path.join(screenshotsDir, '07-catalog-hoodies.png') });
  console.log('Saved 07-catalog-hoodies.png');

  // Click Long Sleeves category
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.trim() === 'Long Sleeves');
    if (b) b.click();
  });
  await delay(800);
  await page.screenshot({ path: path.join(screenshotsDir, '08-catalog-longsleeves.png') });
  console.log('Saved 08-catalog-longsleeves.png');

  await browser.close();
  console.log('Done catalog category check!');
}

run().catch(console.error);
