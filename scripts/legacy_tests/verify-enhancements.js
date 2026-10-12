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
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // ── 1. Full-Sleeve Heavyweight Hoodie in Edit Mode ──
  console.log('--- 1. Testing Full-Sleeve Hoodie in Edit Mode ---');
  await page.goto('http://localhost:3000/create/hoodie-heavyweight', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.screenshot({ path: path.join(screenshotsDir, '01-hoodie-fullsleeve-edit.png') });
  console.log('Saved 01-hoodie-fullsleeve-edit.png');

  // ── 2. Test Graphics Library Drawer & Category Tabs ──
  console.log('--- 2. Testing Graphics Library Category Pills & Search ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(800);

  // Click Streetwear category
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'));
    const p = pills.find(btn => btn.textContent && btn.textContent.trim() === 'Streetwear');
    if (p) p.click();
  });
  await delay(600);

  await page.screenshot({ path: path.join(screenshotsDir, '02-graphics-drawer-category.png') });
  console.log('Saved 02-graphics-drawer-category.png');

  // Click a streetwear graphic (e.g. first item)
  console.log('Adding Streetwear Graphic to Hoodie...');
  const firstGraphic = await page.$('div.grid button.group');
  if (firstGraphic) {
    await firstGraphic.click();
    await delay(700);
  }

  // ── 3. Switch to Photorealistic Preview Mode for Hoodie ──
  console.log('--- 3. Testing Full-Sleeve Hoodie in Photorealistic Preview Mode ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1500);

  await page.screenshot({ path: path.join(screenshotsDir, '03-hoodie-fullsleeve-preview.png') });
  console.log('Saved 03-hoodie-fullsleeve-preview.png');

  // ── 4. Full Long-Sleeve Shirt in Edit Mode ──
  console.log('--- 4. Testing Long-Sleeve Shirt in Edit Mode ---');
  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.screenshot({ path: path.join(screenshotsDir, '04-longsleeve-shirt-edit.png') });
  console.log('Saved 04-longsleeve-shirt-edit.png');

  // Add an outdoor graphic to long sleeve
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(800);

  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'));
    const p = pills.find(btn => btn.textContent && btn.textContent.trim() === 'Outdoor');
    if (p) p.click();
  });
  await delay(600);

  const outdoorGraphic = await page.$('div.grid button.group');
  if (outdoorGraphic) {
    await outdoorGraphic.click();
    await delay(700);
  }

  // ── 5. Switch to Photorealistic Preview Mode for Long-Sleeve Shirt ──
  console.log('--- 5. Testing Long-Sleeve Shirt in Photorealistic Preview Mode ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1500);

  await page.screenshot({ path: path.join(screenshotsDir, '05-longsleeve-shirt-preview.png') });
  console.log('Saved 05-longsleeve-shirt-preview.png');

  // ── 6. Test Public Catalog Page with New Hoodies and Long Sleeves ──
  console.log('--- 6. Testing Public Catalog Page ---');
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.screenshot({ path: path.join(screenshotsDir, '06-catalog-grid.png') });
  console.log('Saved 06-catalog-grid.png');

  await browser.close();
  console.log('All verification tests completed successfully!');
}

run().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
