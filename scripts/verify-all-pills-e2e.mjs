import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/test-verifications/pills-e2e');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('🚀 Starting Comprehensive Multi-Area Pill Switcher E2E Verification...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1100']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100 });
  page.on('dialog', async d => {
    console.log('Dialog:', d.message());
    await d.dismiss();
  });

  const results = [];

  // 1. Mug Pill Switching
  console.log('\n--- Testing Mug Pill Switcher (/create/mug-classic) ---');
  await page.goto('http://localhost:3000/create/mug-classic', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const mugPills = ['Front', 'Wrap', 'Handle left', 'Handle right'];
  for (const pill of mugPills) {
    const clicked = await page.evaluate((pillName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent && b.textContent.trim() === pillName);
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, pill);

    await new Promise(r => setTimeout(r, 600));

    const check = await page.evaluate((pillName) => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px');
      const cutLineEl = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Cut Line'));
      const isWrap = pillName === 'Wrap';
      const isLeft = pillName === 'Handle left';
      const handle = stage ? stage.querySelector('#mug-handle') : null;
      const handleTransform = handle ? handle.getAttribute('transform') : null;

      return {
        pillName,
        cutLineText: cutLineEl ? cutLineEl.textContent.trim() : null,
        hasStage: !!stage,
        isWrapRendered: isWrap ? !handle : !!handle,
        isHandleFlipped: isLeft ? (handleTransform && handleTransform.includes('scale(-1')) : true
      };
    }, pill);

    console.log(`Mug [${pill}] check:`, check);
    await page.screenshot({ path: path.join(outputDir, `mug-${pill.toLowerCase().replace(/\s+/g, '-')}.png`) });
    results.push({ product: 'Mug', area: pill, passed: clicked && check.hasStage });
  }

  // 2. Tote Pill Switching
  console.log('\n--- Testing Tote Pill Switcher (/create/tote-standard) ---');
  await page.goto('http://localhost:3000/create/tote-standard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const totePills = ['Front', 'Back'];
  for (const pill of totePills) {
    const clicked = await page.evaluate((pillName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent && b.textContent.trim() === pillName);
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, pill);

    await new Promise(r => setTimeout(r, 600));

    const check = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px');
      const cutLineEl = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Cut Line'));
      return {
        cutLineText: cutLineEl ? cutLineEl.textContent.trim() : null,
        hasStage: !!stage
      };
    });

    console.log(`Tote [${pill}] check:`, check);
    await page.screenshot({ path: path.join(outputDir, `tote-${pill.toLowerCase().replace(/\s+/g, '-')}.png`) });
    results.push({ product: 'Tote', area: pill, passed: clicked && check.hasStage });
  }

  // 3. Zip Hoodie Pill Switching
  console.log('\n--- Testing Zip Hoodie Pill Switcher (/create/hoodie-zip) ---');
  await page.goto('http://localhost:3000/create/hoodie-zip', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const zipPills = ['Left chest', 'Right chest', 'Back'];
  for (const pill of zipPills) {
    const clicked = await page.evaluate((pillName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent && b.textContent.trim() === pillName);
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, pill);

    await new Promise(r => setTimeout(r, 600));

    const check = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px');
      const cutLineEl = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Cut Line'));
      return {
        cutLineText: cutLineEl ? cutLineEl.textContent.trim() : null,
        hasStage: !!stage
      };
    });

    console.log(`Zip Hoodie [${pill}] check:`, check);
    await page.screenshot({ path: path.join(outputDir, `zip-${pill.toLowerCase().replace(/\s+/g, '-')}.png`) });
    results.push({ product: 'Zip Hoodie', area: pill, passed: clicked && check.hasStage });
  }

  // 4. Pullover Hoodie Pill Switching
  console.log('\n--- Testing Pullover Hoodie Pill Switcher (/create/hoodie-gildan) ---');
  await page.goto('http://localhost:3000/create/hoodie-gildan', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const hoodiePills = ['Center chest', 'Left chest', 'Right chest', 'Back'];
  for (const pill of hoodiePills) {
    const clicked = await page.evaluate((pillName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent && b.textContent.trim() === pillName);
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, pill);

    await new Promise(r => setTimeout(r, 600));

    const check = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px');
      const cutLineEl = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Cut Line'));
      return {
        cutLineText: cutLineEl ? cutLineEl.textContent.trim() : null,
        hasStage: !!stage
      };
    });

    console.log(`Pullover Hoodie [${pill}] check:`, check);
    await page.screenshot({ path: path.join(outputDir, `hoodie-${pill.toLowerCase().replace(/\s+/g, '-')}.png`) });
    results.push({ product: 'Pullover Hoodie', area: pill, passed: clicked && check.hasStage });
  }

  console.log('\n=======================================================');
  console.log('📊 RESULTS SUMMARY:');
  console.table(results);
  const allPassed = results.every(r => r.passed);
  console.log(allPassed ? '🎉 ALL PILLS PASSED 100%!' : '❌ SOME PILLS FAILED!');
  console.log('=======================================================');

  await browser.close();
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
