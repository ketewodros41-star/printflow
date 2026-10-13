import puppeteer from 'puppeteer'

async function run() {
  console.log('Starting live verification of Commercial Production Export & Dynamic DPI...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1200']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 })

  await page.goto('http://localhost:3000/create/polo-sublimation', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  // 1. Capture 2D Edit mode with Print Guides (Safe Area, Cut Line, Bleed Line)
  console.log('Capturing Print Guides on 2D Canvas...')
  await page.screenshot({ path: 'screenshots/verify-10-production-guides.png' })
  console.log('Saved screenshots/verify-10-production-guides.png')

  // 2. Apply template "Be Good Do Good (Retro Wave)"
  console.log('Applying template...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Be Good Do Good')) {
        b.click()
        return true
      }
    }
    return false
  })
  await new Promise(r => setTimeout(r, 1500))

  // 3. Select a layer to verify dynamic DPI badge docked on layer and on bottom bar
  console.log('Selecting layer for dynamic DPI check...')
  await page.evaluate(() => {
    const layerEl = document.querySelector('div[style*="position: absolute"]')
    // Click on canvas layer
    const canvas = document.querySelector('main')
    const layerDivs = canvas ? Array.from(canvas.querySelectorAll('div')) : []
    for (const d of layerDivs) {
      if (d.textContent && d.textContent.includes('be good')) {
        d.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'screenshots/verify-11-dynamic-dpi-selected.png' })
  console.log('Saved screenshots/verify-11-dynamic-dpi-selected.png')

  // 4. Click "Export for Print (300 DPI)" button in header
  console.log('Opening Commercial Production Modal...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Export for Print')) {
        b.click()
        return true
      }
    }
    return false
  })
  await new Promise(r => setTimeout(r, 1500))

  // 5. Capture Production Package tab
  await page.screenshot({ path: 'screenshots/verify-12-production-modal-package.png' })
  console.log('Saved screenshots/verify-12-production-modal-package.png')

  // 6. Switch to Printify API tab
  console.log('Switching to Printify API contract tab...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Printify API')) {
        b.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'screenshots/verify-13-production-modal-api.png' })
  console.log('Saved screenshots/verify-13-production-modal-api.png')

  // 7. Switch to Tech Pack tab
  console.log('Switching to Factory Tech Pack tab...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Tech Pack')) {
        b.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'screenshots/verify-14-production-modal-techpack.png' })
  console.log('Saved screenshots/verify-14-production-modal-techpack.png')

  await browser.close()
  console.log('Production Export verification complete!')
}

run().catch(console.error)
