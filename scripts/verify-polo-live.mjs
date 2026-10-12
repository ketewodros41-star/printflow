import puppeteer from 'puppeteer-core';

async function verify() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/create/polo-sublimation...');
  await page.goto('http://localhost:3000/create/polo-sublimation', { waitUntil: 'networkidle0' });

  // 1. Capture default Edit mode (All areas overview)
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'scripts/live-polo-edit-all.png' });
  console.log('Saved live-polo-edit-all.png');

  // 2. Click "Front side" pill
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim() === 'Front side') {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'scripts/live-polo-edit-front.png' });
  console.log('Saved live-polo-edit-front.png');

  // 3. Click "Preview" button
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim() === 'Preview') {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'scripts/live-polo-preview-front-white.png' });
  console.log('Saved live-polo-preview-front-white.png');

  // 4. Click Navy color swatch in Preview mode
  const navyBtn = await page.$('button[title*="Navy"]');
  if (navyBtn) {
    await navyBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/live-polo-preview-front-navy.png' });
    console.log('Saved live-polo-preview-front-navy.png');
  }

  // 5. Click "Back" view thumbnail in top right sidebar
  const previewButtons = await page.$$('button');
  for (const b of previewButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Back') || text.includes('Back Studio'))) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'scripts/live-polo-preview-back-navy.png' });
  console.log('Saved live-polo-preview-back-navy.png');

  await browser.close();
  console.log('All Polo live verification screenshots captured successfully!');
}

verify().catch(console.error);
