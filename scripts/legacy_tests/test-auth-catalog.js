const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'merchant@printflow.et');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'verify-dashboard-catalog-authenticated.png') });
  console.log('Logged in and captured dashboard catalog successfully!');
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
