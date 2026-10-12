import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

async function run() {
  console.log('Testing back view with artwork & graphics...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2500))

  // 1. Select "Back" print area in editor so layer is assigned to back view
  await page.evaluate(() => {
    const areaBtns = Array.from(document.querySelectorAll('button'))
    const backAreaBtn = areaBtns.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('back'))
    if (backAreaBtn) backAreaBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // 2. Add text
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const addTextBtn = btns.find(b => b.textContent && b.textContent.includes('Add text'))
    if (addTextBtn) addTextBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // 3. Switch to Preview tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // 4. Click "Back" scene in preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const backBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Back')
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  const shotDir = path.resolve('scripts/screenshots')
  await page.screenshot({ path: path.join(shotDir, 'verify-back-with-artwork-white.png') })
  console.log('Saved: scripts/screenshots/verify-back-with-artwork-white.png')

  // 5. Test Maroon with artwork
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
    const maroon = swatches.find(el => {
      const title = el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent || ''
      return title.toLowerCase().includes('maroon')
    })
    if (maroon) maroon.click()
  })
  await new Promise(r => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(shotDir, 'verify-back-with-artwork-maroon.png') })
  console.log('Saved: scripts/screenshots/verify-back-with-artwork-maroon.png')

  await browser.close()
  console.log('Artwork verification on back view completed successfully!')
}

run().catch(console.error)
