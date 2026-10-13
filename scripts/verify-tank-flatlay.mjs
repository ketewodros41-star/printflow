import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = path.join(__dirname, 'screenshots')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

async function run() {
  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  // Log page console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser error:', msg.text())
    }
  })

  console.log('1. Loading http://localhost:3000/create/tank-muscle...')
  await page.goto('http://localhost:3000/create/tank-muscle', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1500))

  // Switch to Preview tab
  console.log('2. Switching to Preview tab...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const btn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Screenshot 1: Front Blank White
  console.log('Saving front blank preview...')
  await page.screenshot({ path: path.join(outDir, 'tank-preview-front-white.png') })

  // Switch to Back view in right sidebar (Click "Back Flat-Lay" thumbnail)
  console.log('3. Switching to Back view...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const backBtn = buttons.find(b => b.textContent && b.textContent.includes('Back Flat-Lay'))
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Screenshot 2: Back Blank White
  console.log('Saving back blank preview...')
  await page.screenshot({ path: path.join(outDir, 'tank-preview-back-white.png') })

  // Switch to Black colorway
  console.log('4. Switching to Black colorway...')
  await page.evaluate(() => {
    // Look for color buttons (swatches)
    const colorSwatches = Array.from(document.querySelectorAll('button[title*="Black"], button[aria-label*="Black"]'))
    if (colorSwatches.length > 0) {
      colorSwatches[0].click()
    } else {
      // Find swatch by title or hex
      const buttons = Array.from(document.querySelectorAll('button'))
      const blackBtn = buttons.find(b => b.getAttribute('title')?.toLowerCase().includes('black') || b.querySelector('span[title*="Black"]'))
      if (blackBtn) blackBtn.click()
    }
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(outDir, 'tank-preview-back-black.png') })

  // Switch back to Front view on Black
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const frontBtn = buttons.find(b => b.textContent && b.textContent.includes('Front Flat-Lay'))
    if (frontBtn) frontBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(outDir, 'tank-preview-front-black.png') })

  // Switch back to White and Edit mode
  console.log('5. Switching to White and adding artwork...')
  await page.evaluate(() => {
    const colorSwatches = Array.from(document.querySelectorAll('button[title*="White"], button[aria-label*="White"]'))
    if (colorSwatches.length > 0) colorSwatches[0].click()
  })
  await new Promise(r => setTimeout(r, 600))

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const editBtn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('edit'))
    if (editBtn) editBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Add graphic from Graphics panel
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const graphicsTab = buttons.find(b => b.textContent && b.textContent.includes('Graphics'))
    if (graphicsTab) graphicsTab.click()
  })
  await new Promise(r => setTimeout(r, 800))

  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button.group, div.group'))
    if (cards.length > 0) cards[0].click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Switch to Preview mode to verify graphic placement on flat front
  console.log('6. Checking graphic in Preview mode...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const previewBtn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'))
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(outDir, 'tank-preview-front-with-art.png') })

  // Now switch to Back area in Edit mode and add graphic
  console.log('7. Adding artwork to Back area...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const editBtn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('edit'))
    if (editBtn) editBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Select "Back" print area
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const backAreaBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'Back')
    if (backAreaBtn) backAreaBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Click graphics tab and add a graphic to Back
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const graphicsTab = buttons.find(b => b.textContent && b.textContent.includes('Graphics'))
    if (graphicsTab) graphicsTab.click()
  })
  await new Promise(r => setTimeout(r, 800))

  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button.group, div.group'))
    if (cards.length > 1) cards[1].click()
    else if (cards.length > 0) cards[0].click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Switch to Preview mode
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const previewBtn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'))
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Switch to Back Flat-Lay view
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const backBtn = buttons.find(b => b.textContent && b.textContent.includes('Back Flat-Lay'))
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(outDir, 'tank-preview-back-with-art.png') })

  await browser.close()
  console.log('All verification screenshots captured successfully!')
}

run().catch(err => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
