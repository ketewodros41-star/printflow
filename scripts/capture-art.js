const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'screenshots');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

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

  // Navigate to sweatshirt studio
  console.log('Navigating to sweatshirt studio...');
  await page.goto('http://localhost:3000/create/sweatshirt-crew', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click on "Wild Explorer Badge" starter artwork
  console.log('Clicking starter graphic...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const artBtn = btns.find(b => b.textContent.includes('Wild Explorer Badge'));
    if (artBtn) artBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot with selected artwork, floating toolbar, and inspector
  await page.screenshot({ path: path.join(OUT_DIR, 'studio-sweatshirt-with-art.png') });
  console.log('Saved studio-sweatshirt-with-art.png');

  // Switch to Preview tab
  console.log('Switching to Preview tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const previewBtn = btns.find(b => b.textContent.trim().startsWith('Preview'));
    if (previewBtn) previewBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(OUT_DIR, 'studio-sweatshirt-preview-mode.png') });
  console.log('Saved studio-sweatshirt-preview-mode.png');

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
