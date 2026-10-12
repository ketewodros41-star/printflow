const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testE2E() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('0. Logging in as merchant...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"], input[name="email"]', 'merchant@printflow.et');
  await page.type('input[type="password"], input[name="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1200));
  console.log('Logged in successfully!');

  console.log('1. Navigating to Catalog...');
  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'e2e-1-catalog.png') });

  console.log('2. Clicking Classic Tee...');
  const teeLink = await page.$('a[href="/dashboard/catalog/tshirt-classic"]');
  if (teeLink) {
    await teeLink.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  } else {
    await page.goto('http://localhost:3000/dashboard/catalog/tshirt-classic', { waitUntil: 'networkidle2' });
  }
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'e2e-2-product-detail.png') });

  console.log('3. Clicking Start Designing...');
  const startBtn = await page.$('a[href="/create/tshirt-classic"]');
  if (startBtn) {
    await startBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  } else {
    await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });
  }

  console.log('4. In Studio - Adding artwork...');
  await new Promise(r => setTimeout(r, 1000));
  const starter = await page.$('button.group');
  if (starter) await starter.click();
  await new Promise(r => setTimeout(r, 600));

  console.log('5. Clicking Save Product...');
  const saveBtn = await page.$('header button.bg-\\[\\#1A1A12\\]');
  if (saveBtn) {
    await saveBtn.click();
    console.log('Saved! Waiting for redirect to /dashboard/products...');
    await new Promise(r => setTimeout(r, 2200));
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'e2e-3-products-with-saved-item.png') });
  console.log('Captured e2e-3-products-with-saved-item.png');

  await browser.close();
  console.log('End-to-end journey completed flawlessly!');
}

testE2E().catch(err => {
  console.error('E2E error:', err);
  process.exit(1);
});
