import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = path.join(__dirname, 'screenshots')

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto('http://localhost:3000/create/tank-muscle', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1200))

  // In Edit mode, open Graphics tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const gBtn = btns.find(b => b.textContent && b.textContent.includes('Graphics'))
    if (gBtn) gBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Find the button with 'Wild Explorer' or first graphics item
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button.group'))
    const wildCard = cards.find(c => c.textContent && c.textContent.includes('Wild Explorer')) || cards[0]
    if (wildCard) wildCard.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Switch to Preview mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const pBtn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'))
    if (pBtn) pBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: path.join(outDir, 'tank-preview-front-wild-explorer.png') })
  await browser.close()
  console.log('Front badge verification screenshot captured!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
