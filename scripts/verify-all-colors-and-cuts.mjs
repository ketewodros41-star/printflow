import puppeteer from 'puppeteer'
import fs from 'fs'

async function run() {
  console.log('Launching browser to verify all colors, sleeves, and previews...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2500))

  // 1. Add some sample text
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const addTextBtn = btns.find(b => b.textContent && b.textContent.includes('Add text'))
    if (addTextBtn) addTextBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // 2. Go to Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // 3. Test colors in preview mode: Maroon, Ash, Sport Grey, Dark Heather, Black, Carolina Blue
  const testColors = [
    { name: 'maroon', label: 'Maroon' },
    { name: 'ash', label: 'Ash' },
    { name: 'sport-grey', label: 'Sport Grey' },
    { name: 'dark-heather', label: 'Dark Heather' },
    { name: 'black', label: 'Black' },
    { name: 'carolina-blue', label: 'Carolina Blue' },
    { name: 'white', label: 'White' },
  ]

  for (const c of testColors) {
    console.log(`Selecting color: ${c.label}...`)
    const clicked = await page.evaluate((colorLabel) => {
      // Find color buttons or swatches
      const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
      const match = swatches.find(el => {
        const title = el.getAttribute('title') || el.getAttribute('aria-label') || ''
        const text = el.textContent || ''
        return title.toLowerCase().includes(colorLabel.toLowerCase()) || text.toLowerCase().includes(colorLabel.toLowerCase())
      })
      if (match) {
        match.click()
        return true
      }
      return false
    }, c.label)

    await new Promise(r => setTimeout(r, 800))
    await page.screenshot({ path: `scripts/screenshots/preview-${c.name}.png` })
    console.log(`Saved scripts/screenshots/preview-${c.name}.png (clicked: ${clicked})`)
  }

  // 4. Test Sewed finish
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const sewedBtn = btns.find(b => b.textContent && b.textContent.includes('Sewed'))
    if (sewedBtn) sewedBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'scripts/screenshots/preview-sewed-finish.png' })
  console.log('Saved preview-sewed-finish.png')

  // 5. Test Collar view
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const collarBtn = btns.find(b => b.textContent && b.textContent.includes('Collar'))
    if (collarBtn) collarBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'scripts/screenshots/preview-collar-view.png' })
  console.log('Saved preview-collar-view.png')

  // 6. Test Person Left view
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const pBtn = btns.find(b => b.textContent && b.textContent.includes('Person Left'))
    if (pBtn) pBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'scripts/screenshots/preview-person-left-view.png' })
  console.log('Saved preview-person-left-view.png')

  await browser.close()
  console.log('Browser verification completed successfully!')
}

run().catch(console.error)
