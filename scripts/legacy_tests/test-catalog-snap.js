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

  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'merchant@printflow.et');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await delay(1500);

  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2' });
  await delay(1200);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'dashboard-catalog-diversified.png'), fullPage: false });
  console.log('Saved dashboard-catalog-diversified.png');

  await browser.close();
}

run().catch(console.error);
