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

  // Test SVG embedding the photo and projecting artwork
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #FAF9F6; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
        .wrapper { width: 560px; height: 580px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <svg viewBox="0 0 985 1024" width="100%" height="100%" style="overflow: visible;">
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#1A1A12" flood-opacity="0.08" />
            </filter>
          </defs>
          <!-- Photographic Blank -->
          <image href="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" width="985" height="1024" filter="url(#shadow)" />

          <!-- Left Chest Artwork (Heart matching Image 2) -->
          <g style="mix-blend-mode: multiply;">
            <path d="M 570 430 C 530 395, 501 370, 501 340 C 501 318, 517 302, 538 302 C 551 302, 563 310, 570 320 C 577 310, 589 302, 602 302 C 623 302, 639 318, 639 340 C 639 370, 610 395, 570 430 Z" fill="#5B604B" />
          </g>
        </svg>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  const outPath = path.join(__dirname, 'screenshots', 'test-svg-photoreal-tee.png');
  await page.screenshot({ path: outPath });
  console.log('Saved SVG photoreal tee to', outPath);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
