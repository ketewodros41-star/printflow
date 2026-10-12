const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Inject merchant user into localStorage & cookies
  const merchantUser = {
    id: 'merchant-1',
    name: 'Abebe Kebede',
    email: 'merchant@printflow.et',
    role: 'merchant',
    storeName: 'Addis Designs',
    storeSlug: 'addis-designs',
    plan: 'PRO',
  };

  await page.evaluateOnNewDocument((user) => {
    localStorage.setItem('pf_user_v1', JSON.stringify(user));
    document.cookie = `pf_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`;
  }, merchantUser);

  const pagesToCapture = [
    { url: 'http://localhost:3000/dashboard/catalog', file: 'catalog-grid.png', wait: 2000 },
    { url: 'http://localhost:3000/dashboard/catalog/sweatshirt-crew', file: 'catalog-sweatshirt-detail.png', wait: 2000 },
    { url: 'http://localhost:3000/create/sweatshirt-crew', file: 'studio-sweatshirt.png', wait: 2500 },
    { url: 'http://localhost:3000/create/jacket-bomber', file: 'studio-bomber-jacket.png', wait: 2500 },
  ];

  for (const item of pagesToCapture) {
    console.log(`Navigating to ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, item.wait));

      const filePath = path.join(OUT_DIR, item.file);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot to ${filePath}`);
    } catch (err) {
      console.error(`Error capturing ${item.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
