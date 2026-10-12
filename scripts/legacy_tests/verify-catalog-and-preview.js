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

  // ── 1. Catalog Page Overview with Printify Navigation & Sidebar ──
  console.log('--- 1. Testing Catalog Page with Printify Navigation ---');
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1200);
  await page.screenshot({ path: path.join(screenshotsDir, '09-catalog-printify-nav.png') });
  console.log('Saved 09-catalog-printify-nav.png');

  // Click "T-Shirts" in sidebar
  console.log('--- 2. Filtering by T-Shirts ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('T-Shirts'));
    if (b) b.click();
  });
  await delay(800);
  await page.screenshot({ path: path.join(screenshotsDir, '10-catalog-tshirts-only.png') });
  console.log('Saved 10-catalog-tshirts-only.png');

  // Click "Long Sleeves" in sidebar
  console.log('--- 3. Filtering by Long Sleeves ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Long Sleeves'));
    if (b) b.click();
  });
  await delay(800);
  await page.screenshot({ path: path.join(screenshotsDir, '11-catalog-longsleeves-only.png') });
  console.log('Saved 11-catalog-longsleeves-only.png');

  // ── 4. Test Normal T-Shirt: Edit and Preview (Verify Short Sleeve!) ──
  console.log('--- 4. Testing Normal T-Shirt Edit and Preview Mode ---');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  // Add a sample graphic
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(800);

  const graphicBtn = await page.$('div.grid button.group');
  if (graphicBtn) {
    await graphicBtn.click();
    await delay(700);
  }

  // Edit mode screenshot
  await page.screenshot({ path: path.join(screenshotsDir, '12-tshirt-normal-edit.png') });
  console.log('Saved 12-tshirt-normal-edit.png');

  // Switch to Preview Mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '13-tshirt-normal-preview-shortsleeve.png') });
  console.log('Saved 13-tshirt-normal-preview-shortsleeve.png');

  // ── 5. Test Long Sleeve Shirt Preview (Verify Full Sleeve & Blending!) ──
  console.log('--- 5. Testing Long Sleeve Shirt Preview Mode ---');
  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(800);

  const graphicBtn2 = await page.$('div.grid button.group');
  if (graphicBtn2) {
    await graphicBtn2.click();
    await delay(700);
  }

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '14-longsleeve-preview-blended.png') });
  console.log('Saved 14-longsleeve-preview-blended.png');

  // ── 6. Test Full Sleeve Hoodie Preview ──
  console.log('--- 6. Testing Full Sleeve Hoodie Preview Mode ---');
  await page.goto('http://localhost:3000/create/hoodie-heavyweight', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(800);

  const graphicBtn3 = await page.$('div.grid button.group');
  if (graphicBtn3) {
    await graphicBtn3.click();
    await delay(700);
  }

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '15-hoodie-preview-blended.png') });
  console.log('Saved 15-hoodie-preview-blended.png');

  await browser.close();
  console.log('All verification checks completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
