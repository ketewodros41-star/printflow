const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check Muscle Tank Edit Mode (must be completely blank)
  console.log('1. Checking /create/tank-muscle edit mode...');
  await page.goto('http://localhost:3000/create/tank-muscle', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'verify-tank-muscle-edit-blank.png') });
  console.log('Saved verify-tank-muscle-edit-blank.png');

  // 2. Switch to Preview Mode on Blank Tank
  console.log('2. Switching to Preview tab for tank-muscle...');
  const previewTabBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'));
  });
  if (previewTabBtn) {
    await previewTabBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }
  await page.screenshot({ path: path.join(outDir, 'verify-tank-muscle-preview-blank.png') });
  console.log('Saved verify-tank-muscle-preview-blank.png');

  // 3. Switch back to Edit, add graphic, switch to Preview
  console.log('3. Adding graphic to tank and testing preview with artwork...');
  const editTabBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('edit'));
  });
  if (editTabBtn) {
    await editTabBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Click graphics tab in left panel or click a starter graphic
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const graphicsTab = buttons.find(b => b.textContent && b.textContent.includes('Graphics'));
    if (graphicsTab) graphicsTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click first graphic card
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button.group, div.group'));
    if (cards.length > 0) cards[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Preview
  const previewTabBtn2 = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'));
  });
  if (previewTabBtn2) {
    await previewTabBtn2.click();
    await new Promise(r => setTimeout(r, 1200));
  }
  await page.screenshot({ path: path.join(outDir, 'verify-tank-muscle-preview-with-art.png') });
  console.log('Saved verify-tank-muscle-preview-with-art.png');

  // 4. Check Classic T-Shirt Preview Mode (Must start blank!)
  console.log('4. Checking /create/tshirt-classic (must be blank!)...');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const tPreviewBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'));
  });
  if (tPreviewBtn) {
    await tPreviewBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }
  await page.screenshot({ path: path.join(outDir, 'verify-tshirt-preview-blank.png') });
  console.log('Saved verify-tshirt-preview-blank.png');

  // 5. Check Mug Preview Mode (Must start blank!)
  console.log('5. Checking /create/mug-classic...');
  await page.goto('http://localhost:3000/create/mug-classic', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const mugPreviewBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'));
  });
  if (mugPreviewBtn) {
    await mugPreviewBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }
  await page.screenshot({ path: path.join(outDir, 'verify-mug-preview-blank.png') });
  console.log('Saved verify-mug-preview-blank.png');

  // 6. Check Public Catalog
  console.log('6. Checking /catalog...');
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'verify-catalog-page.png') });
  console.log('Saved verify-catalog-page.png');

  // 7. Check Dashboard Catalog
  console.log('7. Checking /dashboard/catalog...');
  await page.goto('http://localhost:3000/dashboard/catalog', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'verify-dashboard-catalog-page.png') });
  console.log('Saved verify-dashboard-catalog-page.png');

  await browser.close();
  console.log('All tests completed successfully!');
}

run().catch(err => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
