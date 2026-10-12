const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });

  // Click Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p = btns.find(b => b.textContent && b.textContent.includes('Preview'));
    if (p) p.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click On Person 2
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p = btns.find(b => b.textContent && b.textContent.includes('On Person 2'));
    if (p) p.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const bounds = await page.evaluate(() => {
    const img = document.querySelector('img[alt="Product on model close view"]');
    if (!img) return 'NO IMG FOUND';
    const r = img.getBoundingClientRect();
    const parentR = img.parentElement.getBoundingClientRect();
    return {
      img: { width: r.width, height: r.height, top: r.top, left: r.left },
      parent: { width: parentR.width, height: parentR.height, top: parentR.top, left: parentR.left, overflow: window.getComputedStyle(img.parentElement).overflow }
    };
  });
  console.log('BOUNDS:', JSON.stringify(bounds, null, 2));
  await browser.close();
})();
