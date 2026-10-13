import puppeteer from 'puppeteer-core'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const failedAssets = []
  page.on('response', res => {
    if (res.status() >= 400 && res.url().includes('tank')) {
      failedAssets.push({ url: res.url(), status: res.status() })
    }
  })

  await page.goto('http://localhost:3000/create/tank-muscle', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1200))

  // Switch to preview mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const btn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('preview'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  const colorNames = ['White', 'Black', 'Heather Grey', 'Dark Grey Heather', 'Mauve', 'Military Green']
  for (const c of colorNames) {
    // Click swatch
    await page.evaluate((name) => {
      const swatches = Array.from(document.querySelectorAll(`button[title*="${name}" i], button[aria-label*="${name}" i]`))
      if (swatches.length > 0) {
        swatches[0].click()
      } else {
        const btns = Array.from(document.querySelectorAll('button'))
        const target = btns.find(b => b.getAttribute('title')?.toLowerCase().includes(name.toLowerCase()))
        if (target) target.click()
      }
    }, c)
    await new Promise(r => setTimeout(r, 400))

    // Get active image href on Front
    const hrefFront = await page.evaluate(() => {
      const img = document.querySelector('svg image')
      return img ? img.getAttribute('href') : null
    })
    console.log(`Color: ${c} | Front href: ${hrefFront}`)

    // Switch to back
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const bBtn = btns.find(b => b.textContent && b.textContent.includes('Back Flat-Lay'))
      if (bBtn) bBtn.click()
    })
    await new Promise(r => setTimeout(r, 400))

    const hrefBack = await page.evaluate(() => {
      const img = document.querySelector('svg image')
      return img ? img.getAttribute('href') : null
    })
    console.log(`Color: ${c} | Back href: ${hrefBack}`)

    // Switch back to front
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const fBtn = btns.find(b => b.textContent && b.textContent.includes('Front Flat-Lay'))
      if (fBtn) fBtn.click()
    })
    await new Promise(r => setTimeout(r, 400))
  }

  console.log('Failed tank assets count:', failedAssets.length)
  if (failedAssets.length > 0) {
    console.error('Failed assets:', failedAssets)
  }
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
