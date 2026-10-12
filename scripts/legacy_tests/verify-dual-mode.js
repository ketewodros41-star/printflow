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

  // 1. HOODIE (Cartoon Edit Mode -> Photorealistic Preview Mode)
  console.log('--- 1. Testing Hoodie in Edit (Cartoon) Mode ---');
  await page.goto('http://localhost:3000/create/hoodie-premium', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.screenshot({ path: path.join(screenshotsDir, 'verify-hoodie-edit-cartoon.png') });
  console.log('Saved verify-hoodie-edit-cartoon.png');

  // Add a sample graphic
  console.log('Adding graphic to Hoodie...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(700);

  const graphicBtn = await page.$('button.group');
  if (graphicBtn) {
    await graphicBtn.click();
    await delay(700);
  }

  // Switch to Preview Mode
  console.log('Switching to Preview Mode...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1200);

  await page.screenshot({ path: path.join(screenshotsDir, 'verify-hoodie-preview-photoreal.png') });
  console.log('Saved verify-hoodie-preview-photoreal.png');

  // 2. CERAMIC MUG (Cylinder Wrap and Specular Glaze Over Graphic)
  console.log('--- 2. Testing Ceramic Mug in Preview Mode ---');
  await page.goto('http://localhost:3000/create/mug-classic', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(700);

  const mugGraphicBtn = await page.$('button.group');
  if (mugGraphicBtn) {
    await mugGraphicBtn.click();
    await delay(700);
  }
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1200);

  await page.screenshot({ path: path.join(screenshotsDir, 'verify-mug-preview-photoreal.png') });
  console.log('Saved verify-mug-preview-photoreal.png');

  // 3. VELVETEEN PLUSH BLANKET
  console.log('--- 3. Testing Plush Blanket in Preview Mode ---');
  await page.goto('http://localhost:3000/create/blanket-plush', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(700);

  const blanketGraphicBtn = await page.$('button.group');
  if (blanketGraphicBtn) {
    await blanketGraphicBtn.click();
    await delay(700);
  }
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1200);

  await page.screenshot({ path: path.join(screenshotsDir, 'verify-blanket-preview-photoreal.png') });
  console.log('Saved verify-blanket-preview-photoreal.png');

  // 4. T-SHIRT STUDIO
  console.log('--- 4. Testing T-Shirt in Preview Mode ---');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2', timeout: 35000 });
  await delay(1500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Graphics'));
    if (b) b.click();
  });
  await delay(700);

  const tshirtGraphicBtn = await page.$('button.group');
  if (tshirtGraphicBtn) {
    await tshirtGraphicBtn.click();
    await delay(700);
  }
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes('Preview'));
    if (b) b.click();
  });
  await delay(1200);

  await page.screenshot({ path: path.join(screenshotsDir, 'verify-tshirt-preview-photoreal.png') });
  console.log('Saved verify-tshirt-preview-photoreal.png');

  await browser.close();
  console.log('All dual-mode verifications completed successfully!');
}

run().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
