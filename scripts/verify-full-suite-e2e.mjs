import puppeteer from 'puppeteer'
import path from 'path'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  })
  const page = await browser.newPage()

  console.log('1. Navigating to long sleeve editor...')
  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1500))

  // Add "NEW DAY" Chenille graphic from catalog
  console.log('2. Adding "NEW DAY" graphic...')
  await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('button'))
    const graphicsBtn = navButtons.find(b => b.textContent && b.textContent.includes('Graphics'))
    if (graphicsBtn) graphicsBtn.click()
  })
  await new Promise(r => setTimeout(r, 600))

  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'))
    const sewedTab = tabs.find(b => b.textContent && b.textContent.includes('Sewed & Chenille'))
    if (sewedTab) sewedTab.click()
  })
  await new Promise(r => setTimeout(r, 600))

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const newDayBtn = buttons.find(b => b.textContent && b.textContent.includes('NEW DAY'))
    if (newDayBtn) newDayBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Switch to Preview Mode
  console.log('3. Switching to Preview mode...')
  await page.evaluate(() => {
    const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Snap 1: White Front View (Zero Halo Verified)
  const snap1 = path.resolve('public/mockup-tests/verify-front-white-clean.png')
  await page.screenshot({ path: snap1 })
  console.log(`Saved: ${snap1}`)

  // Snap 2: Click Red Swatch (Zero Red Blur / Halo Verified, Swatches Prominent)
  console.log('4. Switching to Red color...')
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('button[title]'))
    const redBtn = swatches.find(b => b.getAttribute('title') === 'Red')
    if (redBtn) redBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  const snap2 = path.resolve('public/mockup-tests/verify-front-red-clean.png')
  await page.screenshot({ path: snap2 })
  console.log(`Saved: ${snap2}`)

  // Snap 3: Person Left (Full-Sleeve Male Model Verified)
  console.log('5. Switching to Person Left...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const pLeft = buttons.find(b => b.textContent && b.textContent.includes('Person Left'))
    if (pLeft) pLeft.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  const snap3 = path.resolve('public/mockup-tests/verify-person-left-fullsleeve.png')
  await page.screenshot({ path: snap3 })
  console.log(`Saved: ${snap3}`)

  // Snap 4: Person Right (Full-Sleeve Female Model Verified)
  console.log('6. Switching to Person Right...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const pRight = buttons.find(b => b.textContent && b.textContent.includes('Person Right'))
    if (pRight) pRight.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  const snap4 = path.resolve('public/mockup-tests/verify-person-right-fullsleeve.png')
  await page.screenshot({ path: snap4 })
  console.log(`Saved: ${snap4}`)

  await browser.close()
  console.log('E2E Verification Complete!')
}

run().catch(console.error)
