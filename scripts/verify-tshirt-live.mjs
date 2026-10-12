import puppeteer from 'puppeteer'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2000))

  // Click Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const prev = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (prev) prev.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  const testColors = ['White', 'Black', 'Red', 'Navy', 'Olive']

  for (const colorName of testColors) {
    console.log(`Testing normal t-shirt color: ${colorName}...`)
    await page.evaluate((cName) => {
      const swatches = Array.from(document.querySelectorAll('button[title]'))
      const match = swatches.find(el => {
        const t = (el.getAttribute('title') || '').trim().toLowerCase()
        return t === cName.toLowerCase() || t.startsWith(cName.toLowerCase() + ' ')
      })
      if (match) match.click()
    }, colorName)
    await new Promise(r => setTimeout(r, 800))

    // Front view
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const frontBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Front')
      if (frontBtn) frontBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))
    const frontPath = `scripts/live-tshirt-${colorName.toLowerCase().replace(' ', '-')}-front.png`
    await page.screenshot({ path: frontPath })

    // Back view
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const backBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Back')
      if (backBtn) backBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))
    const backPath = `scripts/live-tshirt-${colorName.toLowerCase().replace(' ', '-')}-back.png`
    await page.screenshot({ path: backPath })
    console.log(`Saved ${frontPath} and ${backPath}`)
  }

  await browser.close()
  console.log('Finished capturing all normal t-shirt verification screenshots!')
}

run().catch(console.error)
