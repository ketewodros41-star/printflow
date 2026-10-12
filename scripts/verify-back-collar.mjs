import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

async function run() {
  console.log('Launching browser to verify back collar mockup...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2500))

  // 1. Switch to Preview tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // 2. Click "Back" scene button in preview mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const backBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Back')
    if (backBtn) backBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  const shotDir = path.resolve('scripts/screenshots')
  if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true })

  // 3. Take screenshot of Back view in White
  await page.screenshot({ path: path.join(shotDir, 'verify-back-white.png') })
  console.log('Saved: scripts/screenshots/verify-back-white.png')

  // 4. Test multiple colorways on Back view: Maroon, Black, Navy, Dark Heather
  const colors = [
    { label: 'Maroon', name: 'maroon' },
    { label: 'Black', name: 'black' },
    { label: 'Navy', name: 'navy' },
    { label: 'Dark Heather', name: 'dark-heather' },
  ]

  for (const c of colors) {
    console.log(`Selecting color: ${c.label}...`)
    await page.evaluate((colorLabel) => {
      const swatches = Array.from(document.querySelectorAll('button, div[role="button"]'))
      const match = swatches.find(el => {
        const title = el.getAttribute('title') || el.getAttribute('aria-label') || ''
        const text = el.textContent || ''
        return title.toLowerCase().includes(colorLabel.toLowerCase()) || text.toLowerCase().includes(colorLabel.toLowerCase())
      })
      if (match) match.click()
    }, c.label)
    await new Promise(r => setTimeout(r, 1200))
    await page.screenshot({ path: path.join(shotDir, `verify-back-${c.name}.png`) })
    console.log(`Saved: scripts/screenshots/verify-back-${c.name}.png`)
  }

  await browser.close()
  console.log('Verification finished successfully!')
}

run().catch(console.error)
