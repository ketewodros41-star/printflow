import puppeteer from 'puppeteer'

async function run() {
  console.log('Starting Printify-grade live visual verification...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1200']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 })

  await page.goto('http://localhost:3000/create/polo-sublimation', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  // 1. Click "Be Good Do Good (Retro Wave)" in templates
  console.log('Applying "Be Good Do Good (Retro Wave)"...')
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
  await new Promise(r => setTimeout(r, 1200))

  // 2. Switch to Preview tab
  console.log('Switching to Preview tab...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.trim() === 'Preview') {
        b.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 1500))

  // 3. Capture White preview
  await page.screenshot({ path: 'screenshots/verify-01-white-full.png' })
  console.log('Saved verify-01-white-full.png')

  // 4. Switch to Navy
  console.log('Switching to Navy...')
  await page.evaluate(() => {
    const swatches = Array.from(document.querySelectorAll('button, div'))
    for (const s of swatches) {
      const title = (s.getAttribute('title') || s.getAttribute('aria-label') || '').toLowerCase()
      if (title.includes('navy')) {
        s.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 1500))

  // 5. Capture Navy full view
  await page.screenshot({ path: 'screenshots/verify-02-navy-full.png' })
  console.log('Saved verify-02-navy-full.png')

  // 6. Capture Zoomed crops of SVG
  const poloSvg = await page.$('svg[viewBox="0 0 954 1024"]')
  if (poloSvg) {
    const box = await poloSvg.boundingBox()
    if (box) {
      // A. Chest artwork zoom on Navy
      await page.screenshot({
        path: 'screenshots/verify-03-navy-chest-zoom.png',
        clip: {
          x: Math.max(0, box.x + box.width * 0.28),
          y: Math.max(0, box.y + box.height * 0.20),
          width: box.width * 0.44,
          height: box.height * 0.42
        }
      })
      console.log('Saved verify-03-navy-chest-zoom.png')

      // B. Bottom hem full width zoom
      await page.screenshot({
        path: 'screenshots/verify-04-navy-hem-full-zoom.png',
        clip: {
          x: Math.max(0, box.x + box.width * 0.12),
          y: Math.max(0, box.y + box.height * 0.85),
          width: box.width * 0.76,
          height: box.height * 0.15
        }
      })
      console.log('Saved verify-04-navy-hem-full-zoom.png')

      // C. Bottom left corner close-up
      await page.screenshot({
        path: 'screenshots/verify-05-navy-bottom-left-corner.png',
        clip: {
          x: Math.max(0, box.x + box.width * 0.14),
          y: Math.max(0, box.y + box.height * 0.86),
          width: box.width * 0.20,
          height: box.height * 0.14
        }
      })
      console.log('Saved verify-05-navy-bottom-left-corner.png')

      // D. Right sleeve cuff close-up
      await page.screenshot({
        path: 'screenshots/verify-06-navy-right-cuff.png',
        clip: {
          x: Math.max(0, box.x + box.width * 0.75),
          y: Math.max(0, box.y + box.height * 0.28),
          width: box.width * 0.24,
          height: box.height * 0.24
        }
      })
      console.log('Saved verify-06-navy-right-cuff.png')
    }
  }

  // 7. Select Direct-to-Film (DTF)
  console.log('Switching to Direct-to-Film...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Direct-to-Film')) {
        b.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 1200))
  if (poloSvg) {
    const box = await poloSvg.boundingBox()
    if (box) {
      await page.screenshot({
        path: 'screenshots/verify-07-navy-dtf-chest.png',
        clip: {
          x: Math.max(0, box.x + box.width * 0.28),
          y: Math.max(0, box.y + box.height * 0.20),
          width: box.width * 0.44,
          height: box.height * 0.42
        }
      })
      console.log('Saved verify-07-navy-dtf-chest.png')
    }
  }

  // 8. Select Chenille / Fuzzy
  console.log('Switching to Chenille/Fuzzy...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Chenille')) {
        b.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 1200))
  if (poloSvg) {
    const box = await poloSvg.boundingBox()
    if (box) {
      await page.screenshot({
        path: 'screenshots/verify-08-navy-chenille-chest.png',
        clip: {
          x: Math.max(0, box.x + box.width * 0.28),
          y: Math.max(0, box.y + box.height * 0.20),
          width: box.width * 0.44,
          height: box.height * 0.42
        }
      })
      console.log('Saved verify-08-navy-chenille-chest.png')
    }
  }

  // 9. Back view on Navy
  console.log('Switching to Back view...')
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button, div'))
    for (const c of cards) {
      if (c.textContent && c.textContent.includes('Back Stu')) {
        c.click()
        return true
      }
    }
  })
  await new Promise(r => setTimeout(r, 1500))
  await page.screenshot({ path: 'screenshots/verify-09-navy-back-full.png' })
  console.log('Saved verify-09-navy-back-full.png')

  await browser.close()
  console.log('Live verification complete!')
}

run().catch(console.error)
