const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/create/tshirt-classic...');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });

  // 1. Capture Edit Mode with "be good do good"
  await page.screenshot({ path: path.join(outDir, '1_edit_mode.png') });
  console.log('Saved 1_edit_mode.png');

  // 2. Click "Preview" button in header
  const previewTabBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().includes('Preview'));
  });
  if (previewTabBtn) {
    await previewTabBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  // Capture Preview Mode: Front close-up
  await page.screenshot({ path: path.join(outDir, '2_preview_front.png') });
  console.log('Saved 2_preview_front.png');

  // 3. Click "On Person 2" thumbnail
  const onPerson2Btn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().includes('On Person 2'));
  });
  if (onPerson2Btn) {
    await onPerson2Btn.click();
    await new Promise(r => setTimeout(r, 1200));
  }
  await page.screenshot({ path: path.join(outDir, '3_preview_on_person_2.png') });
  console.log('Saved 3_preview_on_person_2.png');

  // 4. Click "Back" thumbnail
  const backBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.trim().includes('Back'));
  });
  if (backBtn) {
    await backBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }
  await page.screenshot({ path: path.join(outDir, '4_preview_back.png') });
  console.log('Saved 4_preview_back.png');

  await browser.close();
  console.log('All screenshots taken successfully.');
}

run().catch(err => {
  console.error('Error running puppeteer script:', err);
  process.exit(1);
});
