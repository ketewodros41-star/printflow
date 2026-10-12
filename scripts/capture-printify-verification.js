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

  // Inject merchant user
  const merchantUser = {
    id: 'merchant-1',
    name: 'Abebe Kebede',
    email: 'ktewodros41@gmail.com',
    role: 'merchant',
    storeName: 'My new store',
    storeSlug: 'my-new-store',
    plan: 'FREE',
  };

  await page.evaluateOnNewDocument((user) => {
    localStorage.setItem('pf_user_v1', JSON.stringify(user));
    document.cookie = `pf_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`;
  }, merchantUser);

  // 1. Catalog Browsing (Images 2 & 3)
  console.log('Capturing catalog...');
  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01-catalog-browsing.png') });

  // 2. Catalog Product Detail Page with Real Photography & Provider Table
  console.log('Capturing catalog product detail...');
  await page.goto('http://localhost:3000/dashboard/catalog/tshirt-classic', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '02-catalog-product-detail.png') });

  // 3. Design Studio in Edit Mode with a sample artwork placed
  console.log('Capturing studio edit mode...');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click on Graphics library tab or add text to put a design on the shirt
  try {
    const textTab = await page.$('button[title*="Text"], button:has-text("Text"), aside button:nth-child(3)');
    // Let's add sample text layer via evaluation or button click
    await page.evaluate(() => {
      // Find the add text input or click graphics tab
      const buttons = Array.from(document.querySelectorAll('aside button'));
      const graphicsBtn = buttons.find(b => b.textContent && b.textContent.includes('Graphics'));
      if (graphicsBtn) graphicsBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click first graphic item if available
    await page.evaluate(() => {
      const firstGraphic = document.querySelector('button[title*="Add"], .grid button');
      if (firstGraphic) firstGraphic.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  } catch (e) {
    console.log('Layer addition note:', e.message);
  }

  await page.screenshot({ path: path.join(OUT_DIR, '03-studio-edit-mode.png') });

  // 4. Design Studio in Preview Mode (Matching Image 1)
  console.log('Switching to Preview Mode in Studio...');
  await page.evaluate(() => {
    const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Preview');
    if (previewBtn) previewBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '04-studio-preview-mode.png') });

  // 5. Sweatshirt Studio in Preview Mode
  console.log('Capturing sweatshirt studio in preview mode...');
  await page.goto('http://localhost:3000/create/sweatshirt-crew', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Preview');
    if (previewBtn) previewBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '05-sweatshirt-preview-mode.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
