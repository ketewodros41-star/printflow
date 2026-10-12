const puppeteer = require('puppeteer');
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

  // Log in
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'merchant@printflow.et');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  await delay(1200);

  // 1. Visit blanket detail
  console.log('Visiting /dashboard/catalog/blanket-plush...');
  await page.goto('http://localhost:3000/dashboard/catalog/blanket-plush', { waitUntil: 'networkidle2' });
  await delay(1000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'detail-blanket-plush.png'), fullPage: false });
  console.log('Saved detail-blanket-plush.png');

  // 2. Visit snapback cap detail
  console.log('Visiting /dashboard/catalog/cap-snapback...');
  await page.goto('http://localhost:3000/dashboard/catalog/cap-snapback', { waitUntil: 'networkidle2' });
  await delay(1000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'detail-cap-snapback.png'), fullPage: false });
  console.log('Saved detail-cap-snapback.png');

  // 3. Visit muscle tank detail
  console.log('Visiting /dashboard/catalog/tank-muscle...');
  await page.goto('http://localhost:3000/dashboard/catalog/tank-muscle', { waitUntil: 'networkidle2' });
  await delay(1000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'detail-tank-muscle.png'), fullPage: false });
  console.log('Saved detail-tank-muscle.png');

  await browser.close();
  console.log('All detail captures complete!');
}

run().catch(console.error);
