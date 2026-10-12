import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const scripts = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('.js') && (url.includes('editor') || url.includes('mockup') || url.includes('customizer') || url.includes('app') || url.includes('chunk') || url.includes('studio'))) {
      try {
        const text = await res.text();
        scripts.push({ url, text });
      } catch (e) {}
    }
  });

  console.log('Navigating to Printify...');
  try {
    await page.goto('https://printify.com/app/editor/68/1/1', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (err) {
    console.log('Navigation fallback: ', err.message);
  }

  console.log(`Captured ${scripts.length} potential editor scripts`);
  const outDir = path.resolve('./scripts/printify_bundles');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < Math.min(scripts.length, 10); i++) {
    const s = scripts[i];
    const filename = `bundle_${i}.js`;
    fs.writeFileSync(path.join(outDir, filename), s.text, 'utf8');
    console.log(`Saved ${filename} (${s.text.length} bytes) from ${s.url}`);
  }

  await browser.close();
}

main().catch(console.error);
