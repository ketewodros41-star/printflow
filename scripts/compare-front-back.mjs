import puppeteer from 'puppeteer'
import path from 'path'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2500))

  // Select Dark Heather
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
    const match = swatches.find(el => {
      const title = el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent || ''
      return title.toLowerCase().includes('dark heather')
    })
    if (match) match.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Go to preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // 1. Take FRONT screenshot
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const frontBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Front')
    if (frontBtn) frontBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))
  await page.screenshot({ path: 'scripts/screenshots/compare-front-dh.png' })
  console.log('Saved compare-front-dh.png')

  // 2. Take BACK screenshot
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const backBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Back')
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))
  await page.screenshot({ path: 'scripts/screenshots/compare-back-dh.png' })
  console.log('Saved compare-back-dh.png')

  await browser.close()
}

run().catch(console.error)
