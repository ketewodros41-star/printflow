const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  const merchantUser = { id: 'm1', email: 'test@printflow.et', role: 'merchant' };
  await page.evaluateOnNewDocument((user) => {
    localStorage.setItem('pf_user_v1', JSON.stringify(user));
    document.cookie = 'pf_session=' + encodeURIComponent(JSON.stringify(user)) + '; path=/';
  }, merchantUser);
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Preview');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const imgInfo = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => {
      const rect = img.getBoundingClientRect();
      return {
        src: img.src.substring(0, 50),
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0
      };
    });
  });
  console.log('ALL IMGS:', JSON.stringify(imgInfo, null, 2));
  await browser.close();
})();
