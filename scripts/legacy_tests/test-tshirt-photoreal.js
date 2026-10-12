const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Load a test HTML page using our CSS mask & multiply blend approach
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #FAF9F6; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
        .stage { position: relative; width: 560px; height: 580px; display: flex; align-items: center; justify-content: center; }
        .garment-img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 20px 28px rgba(0,0,0,0.08)); }
        .color-tint {
          position: absolute; inset: 0; pointer-events: none;
          mix-blend-mode: multiply;
          -webkit-mask-image: url('http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png');
          mask-image: url('http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png');
          -webkit-mask-size: contain; mask-size: contain;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
        }
        .art-stage {
          position: absolute;
          /* Target chest print box corresponding to Printify: Left 30.7%, Top 22.5%, Width 38.5%, Height 48% */
          left: 30.7%; top: 22.5%; width: 38.5%; height: 48%;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="stage">
        <img class="garment-img" src="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" />
        <div class="art-stage">
          <!-- Left chest heart matching Image 2 -->
          <svg viewBox="0 0 100 100" style="position: absolute; right: 0; top: 15%; width: 38%; height: 38%; mix-blend-mode: multiply;">
            <path d="M 50 88 C 25 70, 0 52, 0 30 C 0 14, 12 2, 28 2 C 38 2, 46 8, 50 15 C 54 8, 62 2, 72 2 C 88 2, 100 14, 100 30 C 100 52, 75 70, 50 88 Z" fill="#5B604B" />
          </svg>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  const outPath = path.join(__dirname, 'screenshots', 'test-tshirt-heart-comparison.png');
  await page.screenshot({ path: outPath });
  console.log('Saved test comparison to', outPath);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
