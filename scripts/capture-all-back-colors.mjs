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

  // Click Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // Click Back
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const backBtn = btns.find(b => b.textContent && b.textContent.includes('Back'))
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Get all swatches
  const colorNames = await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
    const titles = []
    for (const el of swatches) {
      const title = el.getAttribute('title') || el.getAttribute('aria-label') || ''
      if (title && !titles.includes(title)) {
        titles.push(title)
      }
    }
    return titles
  })
  console.log('Found swatches:', colorNames)

  for (const name of colorNames) {
    if (!name || name.length < 2) continue
    const clicked = await page.evaluate((n) => {
      const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
      const match = swatches.find(el => {
        const title = el.getAttribute('title') || el.getAttribute('aria-label') || ''
        return title.toLowerCase() === n.toLowerCase()
      })
      if (match) {
        match.click()
        return true
      }
      return false
    }, name)

    if (clicked) {
      await new Promise(r => setTimeout(r, 600))
      const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      await page.screenshot({ path: `scripts/screenshots/all-back-${safeName}.png` })
      console.log(`Captured all-back-${safeName}.png`)
    }
  }

  await browser.close()
  console.log('Done capturing all back colors.')
}

run().catch(console.error)
