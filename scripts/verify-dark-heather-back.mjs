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

  // Switch to Preview mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // Find all color buttons in Preview
  const colorsToTest = ['Dark Heather', 'Black', 'Maroon']

  for (const col of colorsToTest) {
    console.log(`Testing color ${col}...`)
    // Click color swatch
    const clicked = await page.evaluate((name) => {
      const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
      const match = swatches.find(el => {
        const title = el.getAttribute('title') || el.getAttribute('aria-label') || ''
        return title.toLowerCase().includes(name.toLowerCase())
      })
      if (match) {
        match.click()
        return true
      }
      return false
    }, col)

    console.log(`Clicked swatch for ${col}: ${clicked}`)
    await new Promise(r => setTimeout(r, 1200))

    // Switch to Back view
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const backBtn = btns.find(b => {
        const text = b.textContent || ''
        return text.includes('Back')
      })
      if (backBtn) backBtn.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    const filename = `scripts/screenshots/verified-${col.toLowerCase().replace(' ', '-')}-back.png`
    await page.screenshot({ path: filename })
    console.log(`Saved ${filename}`)

    // Also switch to Front view and save
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const frontBtn = btns.find(b => {
        const text = b.textContent || ''
        return text.includes('Front')
      })
      if (frontBtn) frontBtn.click()
    })
    await new Promise(r => setTimeout(r, 1000))

    const frontFilename = `scripts/screenshots/verified-${col.toLowerCase().replace(' ', '-')}-front.png`
    await page.screenshot({ path: frontFilename })
    console.log(`Saved ${frontFilename}`)
  }

  await browser.close()
  console.log('All verifications complete.')
}

run().catch(console.error)
