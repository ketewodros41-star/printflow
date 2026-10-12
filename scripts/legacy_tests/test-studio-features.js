const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to design studio for tshirt-classic...');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Click on the first starter graphic to place artwork
  const starterGraphic = await page.$('button.group');
  if (starterGraphic) {
    console.log('Applying starter artwork...');
    await starterGraphic.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'studio-edit-mode-with-art.png') });
  console.log('Captured studio-edit-mode-with-art.png');

  // Open Variants & Sizing Modal
  const allButtons = await page.$$('button');
  for (const btn of allButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Variants & Sizing')) {
      console.log('Clicking Variants & Sizing button...');
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'studio-variant-matrix-modal.png') });
  console.log('Captured studio-variant-matrix-modal.png');

  // Switch to Sizing Guide tab in modal
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Size Guide & Specs')) {
      console.log('Clicking Size Guide & Specs tab...');
      await btn.click();
      await new Promise(r => setTimeout(r, 800));
      break;
    }
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'studio-size-guide-specs.png') });
  console.log('Captured studio-size-guide-specs.png');

  // Close modal
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim() === 'Done') {
      console.log('Closing modal...');
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  // Switch to Preview Mode
  for (const btn of await page.$$('header button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Preview')) {
      console.log('Switching to Preview tab...');
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'studio-preview-mode.png') });
  console.log('Captured studio-preview-mode.png');

  // Test Mug Studio
  console.log('Navigating to mug studio...');
  await page.goto('http://localhost:3000/create/mug-classic', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const mugStarter = await page.$('button.group');
  if (mugStarter) {
    await mugStarter.click();
    await new Promise(r => setTimeout(r, 800));
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'studio-mug-creator.png') });
  console.log('Captured studio-mug-creator.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
