import puppeteer from 'puppeteer-core';

async function verify() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/create/polo-sublimation...');
  await page.goto('http://localhost:3000/create/polo-sublimation', { waitUntil: 'networkidle0' });

  // 1. Add Starter Artwork: Click "Wild Explorer Badge" starter artwork card
  await new Promise(r => setTimeout(r, 1200));
  const starterImg = await page.$('img[alt*="Wild Explorer"]') || await page.$('img[alt*="Be Good"]');
  if (starterImg) {
    console.log('Found starter artwork img, clicking parent button...');
    await starterImg.click();
  } else {
    console.log('Starter img not found, searching buttons...');
    const starterButtons = await page.$$('button');
    for (const b of starterButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && (text.includes('Wild Explorer') || text.includes('Be Good') || text.includes('Badge'))) {
        await b.click();
        break;
      }
    }
  }
  await new Promise(r => setTimeout(r, 1200));

  // 2. Switch to Preview mode
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim() === 'Preview') {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/live-polo-fixed-front-white-graphic.png' });
  console.log('Saved live-polo-fixed-front-white-graphic.png');

  // 3. Switch to Navy color
  const navyBtn = await page.$('button[title*="Navy"]');
  if (navyBtn) {
    await navyBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/live-polo-fixed-front-navy-graphic.png' });
    console.log('Saved live-polo-fixed-front-navy-graphic.png');
  }

  // 4. Switch to Back view in top right sidebar
  const previewButtons = await page.$$('button');
  for (const b of previewButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Back') || text.includes('Back Studio'))) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/live-polo-fixed-back-navy.png' });
  console.log('Saved live-polo-fixed-back-navy.png');

  // 5. Switch back to White for Back view
  const whiteBtn = await page.$('button[title*="White"]');
  if (whiteBtn) {
    await whiteBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/live-polo-fixed-back-white.png' });
    console.log('Saved live-polo-fixed-back-white.png');
  }

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

verify().catch(console.error);
