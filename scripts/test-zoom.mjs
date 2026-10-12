import puppeteer from 'puppeteer'
import fs from 'fs'

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 600, height: 600 })
  const b64 = fs.readFileSync('scripts/screenshots/test-linear-recoloring.png').toString('base64')
  const html = `
    <!DOCTYPE html>
    <html><body style="margin:0;background:#334155;overflow:hidden;">
      <!-- Zoom in on the Black shirt cuff and collar -->
      <img src="data:image/png;base64,${b64}" style="position:absolute;left:-40px;top:-40px;transform:scale(2.2);transform-origin:0 0;" />
    </body></html>
  `
  await page.setContent(html)
  await page.screenshot({ path: 'scripts/screenshots/test-zoom-black.png' })
  console.log('Saved test zoom to scripts/screenshots/test-zoom-black.png')
  await browser.close()
}

main().catch(console.error)
