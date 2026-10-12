import puppeteer from 'puppeteer'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2000))

  // 1. Open Add text sidebar tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const addTextTab = btns.find(b => b.textContent && b.textContent.includes('Add text'))
    if (addTextTab) addTextTab.click()
  })
  await new Promise(r => setTimeout(r, 600))

  // Click "+ Add Standard Bold Heading"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const headingBtn = btns.find(b => b.textContent && b.textContent.includes('Add Standard Bold Heading'))
    if (headingBtn) headingBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // 2. Select Maroon
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
    const maroon = swatches.find(el => {
      const title = el.getAttribute('title') || el.getAttribute('aria-label') || ''
      const text = el.textContent || ''
      return title.toLowerCase().includes('maroon') || text.toLowerCase().includes('maroon')
    })
    if (maroon) maroon.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // 3. Go to Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // Screenshot Maroon DTG
  await page.screenshot({ path: 'scripts/screenshots/verify-maroon-artwork-dtg.png' })
  console.log('Saved verify-maroon-artwork-dtg.png')

  // Select Sewed / Thread finish
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const sewedBtn = btns.find(b => b.textContent && b.textContent.includes('Sewed'))
    if (sewedBtn) sewedBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'scripts/screenshots/verify-maroon-artwork-sewed.png' })
  console.log('Saved verify-maroon-artwork-sewed.png')

  // Select Chenille / Fuzzy finish
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const chenBtn = btns.find(b => b.textContent && b.textContent.includes('Chenille'))
    if (chenBtn) chenBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'scripts/screenshots/verify-maroon-artwork-chenille.png' })
  console.log('Saved verify-maroon-artwork-chenille.png')

  await browser.close()
  console.log('Artwork verification on Maroon complete!')
}

run().catch(console.error)
