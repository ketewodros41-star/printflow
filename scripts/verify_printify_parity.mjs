import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to editor...');
  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2', timeout: 30000 });

  const screenDir = path.resolve('./scripts/screenshots');
  if (!fs.existsSync(screenDir)) fs.mkdirSync(screenDir, { recursive: true });

  // 1. Click Templates tab
  console.log('Testing Templates tool tab...');
  const templateTabBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Templates'));
  });
  if (templateTabBtn) {
    await templateTabBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenDir, 'verify_1_templates_tab.png') });
    console.log('Saved verify_1_templates_tab.png');
  }

  // 2. Apply First Template
  console.log('Applying template...');
  const applyBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Apply to'));
  });
  if (applyBtn) {
    await applyBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenDir, 'verify_2_template_applied.png') });
    console.log('Saved verify_2_template_applied.png');
  }

  // 3. Verify Floating Text Toolbar
  console.log('Testing floating text toolbar...');
  await page.screenshot({ path: path.join(screenDir, 'verify_3_floating_toolbar.png') });
  console.log('Saved verify_3_floating_toolbar.png');

  // 4. Switch to Preview Mode
  console.log('Testing Preview Mode...');
  const previewTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview');
  });
  if (previewTab) {
    await previewTab.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  // 5. Select Maroon color
  console.log('Selecting Maroon color in preview...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[title*="Maroon"]'));
    if (btns.length > 0) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 6. Click Back scene
  console.log('Switching to Back view...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const backBtn = btns.find(b => b.textContent && (b.textContent.includes('Back') || b.textContent.includes('Back side')));
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenDir, 'verify_4_maroon_back_preview.png') });
  console.log('Saved verify_4_maroon_back_preview.png');

  // 7. Select Navy color in Back view
  console.log('Selecting Navy color in Back view...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[title*="Navy"]'));
    if (btns.length > 0) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenDir, 'verify_5_navy_back_preview.png') });
  console.log('Saved verify_5_navy_back_preview.png');

  await browser.close();
  console.log('Visual verification complete!');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
