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
  await new Promise(r => setTimeout(r, 2000))

  // Screenshot 1: Editor mode in default White with Printify Variant Manager (Image 2 style)
  const snap1 = path.resolve('public/mockup-tests/e2e-longsleeve-editor-white.png')
  await page.screenshot({ path: snap1 })
  console.log(`Saved: ${snap1}`)

  // Click on "Sport Grey" in the variant list to switch color and display heather knit
  console.log('2. Selecting Sport Grey variant...')
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('span'))
    const sportGrey = labels.find(s => s.textContent && s.textContent.trim() === 'Sport Grey')
    if (sportGrey) {
      sportGrey.click()
    }
  })
  await new Promise(r => setTimeout(r, 1200))

  const snap2 = path.resolve('public/mockup-tests/e2e-longsleeve-editor-sportgrey.png')
  await page.screenshot({ path: snap2 })
  console.log(`Saved: ${snap2}`)

  // Add "NEW DAY" Chenille Graphic from Sewed & Chenille catalog
  console.log('3. Adding "NEW DAY" Chenille graphic...')
  await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('button'))
    const graphicsBtn = navButtons.find(b => b.textContent && b.textContent.includes('Graphics'))
    if (graphicsBtn) graphicsBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'))
    const sewedTab = tabs.find(b => b.textContent && b.textContent.includes('Sewed & Chenille'))
    if (sewedTab) sewedTab.click()
  })
  await new Promise(r => setTimeout(r, 800))

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const newDayBtn = buttons.find(b => b.textContent && b.textContent.includes('NEW DAY'))
    if (newDayBtn) newDayBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Screenshot 3: Editor with artwork and Sport Grey
  const snap3 = path.resolve('public/mockup-tests/e2e-longsleeve-editor-artwork.png')
  await page.screenshot({ path: snap3 })
  console.log(`Saved: ${snap3}`)

  // Switch to Preview Mode
  console.log('4. Switching to Preview Mode...')
  const previewTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
  })
  if (previewTab.asElement()) {
    await previewTab.asElement().click()
    await new Promise(r => setTimeout(r, 1500))
  }

  // Screenshot 4: Preview Front Flat Lay with Sport Grey
  const snap4 = path.resolve('public/mockup-tests/e2e-longsleeve-preview-front-sportgrey.png')
  await page.screenshot({ path: snap4 })
  console.log(`Saved: ${snap4}`)

  // Select White color in preview
  console.log('5. Testing White photographic blank (Image 3)...')
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('div.flex.items-center.gap-2.flex-wrap button'))
    const whiteBtn = swatches.find(b => b.getAttribute('title') === 'White')
    if (whiteBtn) whiteBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  const snap5 = path.resolve('public/mockup-tests/e2e-longsleeve-preview-front-white.png')
  await page.screenshot({ path: snap5 })
  console.log(`Saved: ${snap5}`)

  // Select Safety Green in preview (Image 5)
  console.log('6. Testing Safety Green photographic blank (Image 5)...')
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('div.flex.items-center.gap-2.flex-wrap button'))
    const neonBtn = swatches.find(b => b.getAttribute('title') === 'Safety Green')
    if (neonBtn) neonBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  const snap6 = path.resolve('public/mockup-tests/e2e-longsleeve-preview-front-safetygreen.png')
  await page.screenshot({ path: snap6 })
  console.log(`Saved: ${snap6}`)

  // Click on "Collar Closeup" mockup scene
  console.log('7. Testing Collar Closeup macro view...')
  await page.evaluate(() => {
    const sceneButtons = Array.from(document.querySelectorAll('button'))
    const collarBtn = sceneButtons.find(b => b.textContent && b.textContent.includes('Collar Closeup'))
    if (collarBtn) collarBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  const snap7 = path.resolve('public/mockup-tests/e2e-longsleeve-preview-collar-closeup.png')
  await page.screenshot({ path: snap7 })
  console.log(`Saved: ${snap7}`)

  // Click on "Person Left" mockup scene
  console.log('8. Testing Person Left on-model scene...')
  await page.evaluate(() => {
    const sceneButtons = Array.from(document.querySelectorAll('button'))
    const modelBtn = sceneButtons.find(b => b.textContent && b.textContent.includes('Person Left'))
    if (modelBtn) modelBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  const snap8 = path.resolve('public/mockup-tests/e2e-longsleeve-preview-person-left.png')
  await page.screenshot({ path: snap8 })
  console.log(`Saved: ${snap8}`)

  // Click on "Back" mockup scene
  console.log('9. Testing Back flat lay scene...')
  await page.evaluate(() => {
    const sceneButtons = Array.from(document.querySelectorAll('button'))
    const backBtn = sceneButtons.find(b => b.textContent && b.textContent.trim() === 'Back')
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  const snap9 = path.resolve('public/mockup-tests/e2e-longsleeve-preview-back.png')
  await page.screenshot({ path: snap9 })
  console.log(`Saved: ${snap9}`)

  await browser.close()
  console.log('All end-to-end long-sleeve visual tests completed successfully!')
}

run().catch(console.error)
