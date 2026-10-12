const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'screenshots');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

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

  // Navigate to studio
  console.log('Navigating to tshirt creator...');
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Add text layer and graphics layer directly
  await page.evaluate(() => {
    // Click Add Text tool on left toolbar
    const buttons = Array.from(document.querySelectorAll('aside:first-of-type button'));
    const textBtn = buttons.find(b => b.textContent && b.textContent.includes('Add text'));
    if (textBtn) textBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Fill in text
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="text"], input[type="text"]');
    if (input) {
      input.value = 'ADDIS VIBES';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add to design'));
    if (addBtn) addBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture Edit Mode with artwork placed
  await page.screenshot({ path: path.join(OUT_DIR, 'final-studio-edit-mode.png') });
  console.log('Captured Edit Mode');

  // Switch to Preview Mode
  console.log('Switching to Preview Mode...');
  await page.evaluate(() => {
    const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Preview');
    if (previewBtn) previewBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(OUT_DIR, 'final-studio-preview-mode.png') });
  console.log('Captured Preview Mode (Front 2)');

  // Click on "Person 8 Front" (real model photo)
  console.log('Clicking on Person 8 Front scene...');
  await page.evaluate(() => {
    const personBtn = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent && b.textContent.includes('Person 8'));
    if (personBtn) personBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(OUT_DIR, 'final-studio-preview-person8.png') });
  console.log('Captured Preview Mode (Person 8 Front)');

  // Click on "Folded"
  console.log('Clicking on Folded scene...');
  await page.evaluate(() => {
    const foldedBtn = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent && b.textContent.trim() === 'Folded');
    if (foldedBtn) foldedBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(OUT_DIR, 'final-studio-preview-folded.png') });
  console.log('Captured Preview Mode (Folded)');
  console.log('Clicking on Folded scene...');
  await page.evaluate(() => {
    const foldedBtn = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent && b.textContent.trim() === 'Folded');
    if (foldedBtn) foldedBtn.click();
  });
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(OUT_DIR, 'final-studio-preview-folded.png') });
  console.log('Captured Preview Mode (Folded)');

  await browser.close();
  console.log('Verification captures completed!');
}

run().catch(console.error);
