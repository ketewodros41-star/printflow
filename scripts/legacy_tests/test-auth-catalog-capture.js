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

  console.log('Logging in as merchant...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'merchant@printflow.et');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await delay(1500);

  console.log('Navigating to /dashboard/catalog...');
  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2' });
  await delay(1200);

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'authenticated-dashboard-catalog.png'), fullPage: false });
  console.log('Captured authenticated-dashboard-catalog.png');

  // Also test clicking a specific item from catalog like "Velveteen Plush Blanket"
  const blanketCard = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('a, h3'));
    const found = cards.find(c => c.textContent && c.textContent.includes('Velveteen Plush Blanket'));
    return found ? (found.closest('a') || found) : null;
  });
  if (blanketCard) {
    console.log('Clicking Velveteen Plush Blanket card...');
    await blanketCard.click();
    await delay(1500);
    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'clicked-blanket-page.png'), fullPage: false });
    console.log('Captured clicked-blanket-page.png');
  }

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
