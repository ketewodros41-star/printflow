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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #FAF9F6; display: flex; align-items: center; justify-content: center; gap: 30px; height: 100vh; font-family: sans-serif; }
        .stage { position: relative; width: 340px; height: 360px; }
        .garment-img { width: 100%; height: 100%; object-fit: contain; }
        .color-tint {
          position: absolute; inset: 0; pointer-events: none;
          mix-blend-mode: multiply;
          -webkit-mask-image: url('http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png');
          mask-image: url('http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png');
          -webkit-mask-size: contain; mask-size: contain;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
        }
      </style>
    </head>
    <body>
      <div class="stage">
        <img class="garment-img" src="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" />
        <div class="color-tint" style="background-color: #1B2A4A;"></div>
      </div>
      <div class="stage">
        <img class="garment-img" src="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" />
        <div class="color-tint" style="background-color: #4A5E35;"></div>
      </div>
      <div class="stage">
        <img class="garment-img" src="http://localhost:3000/mockups/tshirt-flatlay-studio-white-transparent.png" />
        <div class="color-tint" style="background-color: #C8C5C0;"></div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  const outPath = path.join(__dirname, 'screenshots', 'test-tshirt-colors.png');
  await page.screenshot({ path: outPath });
  console.log('Saved colors to', outPath);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
