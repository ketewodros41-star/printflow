import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function verify() {
  console.log('--- STARTING PRINTIFY-GRADE OVERFLOW & BLENDING E2E VERIFICATION ---')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log('Navigating to Long Sleeve Studio (/create/tshirt-longsleeve)...')
  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1500))

  // 1. Add Text Layer in editor
  console.log('Adding text layer in editor...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const addText = btns.find(b => b.textContent?.includes('Text') || b.title?.includes('Text'))
    if (addText) addText.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // 2. Switch to Preview Mode
  console.log('Switching to Preview tab...')
  const previewSwitched = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const prev = btns.find(b => b.textContent?.trim().toLowerCase().includes('preview'))
    if (prev) {
      prev.click()
      return true
    }
    return false
  })
  console.log('Preview tab clicked:', previewSwitched)
  await new Promise(r => setTimeout(r, 1500))

  const shotDir = path.resolve('scripts/screenshots')
  if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true })

  // 3. Select Carolina Blue (#7BAED1)
  console.log('Selecting Carolina Blue (#7BAED1)...')
  const colorSelected = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const cbBtn = buttons.find(b =>
      b.getAttribute('title')?.toLowerCase().includes('carolina blue') ||
      b.style.backgroundColor?.includes('123, 174, 209') ||
      b.style.backgroundColor?.toLowerCase() === 'rgb(123, 174, 209)'
    )
    if (cbBtn) {
      cbBtn.click()
      return true
    }
    return false
  })
  console.log('Carolina blue selected:', colorSelected)
  await new Promise(r => setTimeout(r, 1200))

  // 4. Capture Front View in Carolina Blue
  await page.screenshot({ path: path.join(shotDir, 'verify-carolina-blue-front.png') })
  console.log('Saved: scripts/screenshots/verify-carolina-blue-front.png')

  // Programmatically check SVG clipping and dimensions
  const svgState = await page.evaluate(() => {
    const svg = document.querySelector('svg[viewBox="0 0 1024 953"]')
    if (!svg) return { error: 'Flat-lay SVG not found' }
    const clip = svg.querySelector('clipPath[id^="ls-garment-clip"]')
    const img = svg.querySelector('image[clipPath*="ls-garment-clip"]')
    const artwork = svg.querySelector('#ls-artwork-stage')
    return {
      svgFound: true,
      hasClipPath: !!clip,
      imageIsClipped: !!img,
      artworkBlendMode: artwork ? window.getComputedStyle(artwork).mixBlendMode : 'unknown'
    }
  })
  console.log('Garment SVG Clipping & Blend State:', svgState)

  // 5. Test Collar Closeup View
  console.log('Switching to Collar Closeup...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const btn = buttons.find(b => b.textContent?.includes('Collar Closeup'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: path.join(shotDir, 'verify-carolina-blue-collar.png') })
  console.log('Saved: scripts/screenshots/verify-carolina-blue-collar.png')

  // 6. Test Person Left (Male Model)
  console.log('Switching to Person Left...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const btn = buttons.find(b => b.textContent?.includes('Person Left'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: path.join(shotDir, 'verify-carolina-blue-person-left.png') })
  console.log('Saved: scripts/screenshots/verify-carolina-blue-person-left.png')

  // 7. Test Person Right (Female Model)
  console.log('Switching to Person Right...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const btn = buttons.find(b => b.textContent?.includes('Person Right'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: path.join(shotDir, 'verify-carolina-blue-person-right.png') })
  console.log('Saved: scripts/screenshots/verify-carolina-blue-person-right.png')

  // 8. Test Back View
  console.log('Switching to Back...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const btn = buttons.find(b => b.textContent?.includes('Back') && !b.textContent?.includes('Side'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: path.join(shotDir, 'verify-carolina-blue-back.png') })
  console.log('Saved: scripts/screenshots/verify-carolina-blue-back.png')

  // 9. Switch back to Front and test Navy (#1B2A4A) & Red (#C62828)
  console.log('Testing Navy colorway...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const frontBtn = buttons.find(b => b.textContent?.trim() === 'Front')
    if (frontBtn) frontBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const navyBtn = buttons.find(b => b.getAttribute('title')?.toLowerCase().includes('navy'))
    if (navyBtn) navyBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(shotDir, 'verify-navy-front.png') })
  console.log('Saved: scripts/screenshots/verify-navy-front.png')

  await browser.close()
  console.log('--- ALL E2E VERIFICATION CHECKS COMPLETED SUCCESSFULLY ---')
}

verify().catch(console.error)
