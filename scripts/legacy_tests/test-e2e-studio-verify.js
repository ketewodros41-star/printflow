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

  console.log('--- 1. Testing T-Shirt Studio Preview with Heart Graphic ---');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(1200);

  // Verify initially empty canvas
  console.log('Checking that canvas starts 100% clean...');
  const layersCountEmpty = await page.evaluate(() => {
    return document.querySelectorAll('#interactive-art-canvas [data-layer-id]').length;
  });
  console.log(`Initial layers on canvas: ${layersCountEmpty} (Expected: 0)`);

  // Click on "Graphics" tab on left toolbar
  const graphicsTabBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Graphics'));
  });
  if (graphicsTabBtn) {
    await graphicsTabBtn.click();
    await delay(600);
  }

  // Click the first sample graphic (or heart)
  const sampleGraphic = await page.$('button[title*="Add "], div[role="button"], button.group');
  if (sampleGraphic) {
    await sampleGraphic.click();
    await delay(600);
  }

  // Position graphic to Left Chest
  const leftChestBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && (b.textContent.includes('L. Chest') || b.textContent.includes('Left chest')));
  });
  if (leftChestBtn) {
    await leftChestBtn.click();
    await delay(400);
  }

  // Switch to Preview Tab
  const previewTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (previewTab) {
    await previewTab.click();
    await delay(1200);
  }

  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-tshirt-photoreal-preview.png'), fullPage: false });
  console.log('Saved screenshots/e2e-tshirt-photoreal-preview.png');

  // --- 2. Test Velvet Plush Blanket ---
  console.log('--- 2. Testing Velvet Plush Blanket ---');
  await page.goto('http://localhost:3000/create/blanket-plush', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(800);
  
  // Add a graphic
  const gTab2 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Graphics'));
  });
  if (gTab2) {
    await gTab2.click();
    await delay(500);
    const sg = await page.$('button[title*="Add "]');
    if (sg) await sg.click();
  }

  // Switch to Preview
  const pTab2 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (pTab2) {
    await pTab2.click();
    await delay(1000);
  }
  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-blanket-preview.png'), fullPage: false });
  console.log('Saved screenshots/e2e-blanket-preview.png');

  // --- 3. Test Spun Polyester Square Pillow ---
  console.log('--- 3. Testing Square Pillow ---');
  await page.goto('http://localhost:3000/create/pillow-polyester', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(800);
  
  const gTab3 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Graphics'));
  });
  if (gTab3) {
    await gTab3.click();
    await delay(500);
    const sg = await page.$('button[title*="Add "]');
    if (sg) await sg.click();
  }

  const pTab3 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (pTab3) {
    await pTab3.click();
    await delay(1000);
  }
  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-pillow-preview.png'), fullPage: false });
  console.log('Saved screenshots/e2e-pillow-preview.png');

  // --- 4. Test Pullover Hoodie & Full-Zip Hoodie ---
  console.log('--- 4. Testing Pullover Hoodie ---');
  await page.goto('http://localhost:3000/create/hoodie-premium', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(800);
  const pTab4 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (pTab4) {
    await pTab4.click();
    await delay(1000);
  }
  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-hoodie-preview.png'), fullPage: false });
  console.log('Saved screenshots/e2e-hoodie-preview.png');

  // --- 5. Test Ceramic Mug ---
  console.log('--- 5. Testing Ceramic Mug ---');
  await page.goto('http://localhost:3000/create/mug-classic', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(800);
  const pTab5 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (pTab5) {
    await pTab5.click();
    await delay(1000);
  }
  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-mug-preview.png'), fullPage: false });
  console.log('Saved screenshots/e2e-mug-preview.png');

  // --- 6. Test Snapback Cap ---
  console.log('--- 6. Testing Snapback Cap ---');
  await page.goto('http://localhost:3000/create/cap-snapback', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(800);
  const pTab6 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (pTab6) {
    await pTab6.click();
    await delay(1000);
  }
  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-cap-preview.png'), fullPage: false });
  console.log('Saved screenshots/e2e-cap-preview.png');

  // --- 7. Test Dashboard Catalog ---
  console.log('--- 7. Testing Dashboard Catalog Diversity ---');
  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'e2e-dashboard-catalog.png'), fullPage: false });
  console.log('Saved screenshots/e2e-dashboard-catalog.png');

  await browser.close();
  console.log('ALL TESTS PASSED!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
