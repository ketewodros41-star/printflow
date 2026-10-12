const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Test SVG multiply color overlay
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #FAF9F6; display: flex; align-items: center; justify-content: center; gap: 30px; height: 100vh; font-family: sans-serif; }
        .wrapper { width: 420px; height: 440px; }
      </style>
    </head>
    <body>
      <!-- Navy Shirt -->
      <div class="wrapper">
        <svg viewBox="0 0 985 1024" width="100%" height="100%">
          <!-- Base Color -->
          <rect width="985" height="1024" fill="#1B2A4A" />
          <!-- Masked / Multiplied Studio Photo -->
          <image href="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" width="985" height="1024" style="mix-blend-mode: multiply;" />
        </svg>
      </div>
      <!-- Heather Grey Shirt -->
      <div class="wrapper">
        <svg viewBox="0 0 985 1024" width="100%" height="100%">
          <rect width="985" height="1024" fill="#9A9A8E" />
          <image href="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" width="985" height="1024" style="mix-blend-mode: multiply;" />
        </svg>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  const outPath = path.join(__dirname, 'screenshots', 'test-svg-colored-tees.png');
  await page.screenshot({ path: outPath });
  console.log('Saved SVG colored tees to', outPath);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
