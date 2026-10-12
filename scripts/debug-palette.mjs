import puppeteer from 'puppeteer'

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 1000 })
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #E2E8F0; margin: 0; padding: 20px; font-family: sans-serif; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .card { background: #FFFFFF; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); text-align: center; }
        .card img { width: 100%; height: auto; display: block; }
        .name { font-weight: bold; margin-top: 8px; font-size: 13px; color: #334155; }
      </style>
    </head>
    <body>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-white.png" /><div class="name">White</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-grey.png" /><div class="name">Grey</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-neon.png" /><div class="name">Neon</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-black.png" /><div class="name">Black</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-navy.png" /><div class="name">Navy</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-red.png" /><div class="name">Red</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-forest-green.png" /><div class="name">Forest Green</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-carolina-blue.png" /><div class="name">Carolina Blue</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-maroon.png" /><div class="name">Maroon</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-royal.png" /><div class="name">Royal</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-sand.png" /><div class="name">Sand</div></div>
      <div class="card"><img src="http://localhost:3000/mockups/longsleeve-flatlay-orange.png" /><div class="name">Orange</div></div>
    </body>
    </html>
  `
  await page.setContent(html, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: 'scripts/screenshots/palette-overview.png' })
  console.log('Saved palette overview to scripts/screenshots/palette-overview.png')
  await browser.close()
}

main().catch(console.error)
