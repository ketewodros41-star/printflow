import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function verifyWithGraphic() {
  console.log('Testing Mockup with Live Graphic...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1500))

  // 1. Click Instant Starter Artwork button
  console.log('Clicking Starter Artwork in left panel...')
  const added = await page.evaluate(() => {
    // Look for the instant starter artwork buttons with images
    const imgBtns = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('img'))
    if (imgBtns.length > 0) {
      imgBtns[0].click()
      return true
    }
    return false
  })
  console.log('Graphic clicked:', added)
  await new Promise(r => setTimeout(r, 1200))

  // Check layers state
  const layerCount = await page.evaluate(() => {
    const stage = document.querySelector('#ls-artwork-stage')
    const imgs = stage ? stage.querySelectorAll('image') : []
    return { stageFound: !!stage, imgCount: imgs.length }
  })
  console.log('Layers in SVG stage:', layerCount)

  // 2. Switch to Preview Mode
  console.log('Switching to Preview tab...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const prev = btns.find(b => b.textContent?.trim().toLowerCase().includes('preview'))
    if (prev) prev.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // 3. Select Carolina Blue
  console.log('Selecting Carolina Blue (#7BAED1)...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const cbBtn = buttons.find(b =>
      b.getAttribute('title')?.toLowerCase().includes('carolina blue') ||
      b.style.backgroundColor?.includes('123, 174, 209') ||
      b.style.backgroundColor?.toLowerCase() === 'rgb(123, 174, 209)'
    )
    if (cbBtn) cbBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  const shotDir = path.resolve('scripts/screenshots')
  const outPath = path.join(shotDir, 'verify-graphic-on-carolina-blue.png')
  await page.screenshot({ path: outPath })
  console.log(`Saved screenshot: ${outPath}`)

  // 4. Test Embroidery / Sewed finish
  console.log('Testing Sewed / Stitched finish...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const sewBtn = buttons.find(b => b.textContent?.includes('Sewed'))
    if (sewBtn) sewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  const outSewPath = path.join(shotDir, 'verify-graphic-sewed-finish.png')
  await page.screenshot({ path: outSewPath })
  console.log(`Saved screenshot: ${outSewPath}`)

  // 5. Test Chenille / Fuzzy finish
  console.log('Testing Chenille finish...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const chBtn = buttons.find(b => b.textContent?.includes('Chenille'))
    if (chBtn) chBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  const outChenillePath = path.join(shotDir, 'verify-graphic-chenille-finish.png')
  await page.screenshot({ path: outChenillePath })
  console.log(`Saved screenshot: ${outChenillePath}`)

  // 6. Test Person Left with Graphic
  console.log('Testing Person Left with graphic...')
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const plBtn = buttons.find(b => b.textContent?.includes('Person Left'))
    if (plBtn) plBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: path.join(shotDir, 'verify-graphic-person-left.png') })
  console.log('Saved screenshot: scripts/screenshots/verify-graphic-person-left.png')

  await browser.close()
  console.log('Done testing with live graphic!')
}

verifyWithGraphic().catch(console.error)
