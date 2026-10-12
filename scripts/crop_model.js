const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const fileUrl = 'http://localhost:3000/mockups/model-male-torso.png';
  await page.goto(fileUrl);

  const croppedBase64 = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    const cropX = 12;
    const cropY = 20;
    const cropW = 566;
    const cropH = 550;

    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    // Exact background sample from left side at same height:
    const bgPixel = ctx.getImageData(30, 60, 1, 1).data;
    ctx.fillStyle = `rgb(${bgPixel[0]}, ${bgPixel[1]}, ${bgPixel[2]})`;
    ctx.fillRect(410, 10, 150, 115);

    return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
  });

  const outPath = path.join(process.cwd(), 'public', 'mockups', 'model-male-torso-clean.png');
  fs.writeFileSync(outPath, Buffer.from(croppedBase64, 'base64'));
  console.log('Saved seamless model torso to:', outPath);

  await browser.close();
})();
