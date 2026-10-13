import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots')
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

async function run() {
  console.log('Starting 3D Studio V2 Puppeteer verification...')
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()))
    page.on('pageerror', err => console.error('[BROWSER ERROR]', err.message))

    // 1. Test Pullover Hoodie 3D model
    console.log('Navigating to http://localhost:3000/create/hoodie-premium...')
    await page.goto('http://localhost:3000/create/hoodie-premium', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    console.log('Switching to 3D Studio...')
    const hoodie3dBtn = await page.waitForSelector('button ::-p-text(3D Studio)', { timeout: 5000 })
    await hoodie3dBtn.click()
    await page.waitForSelector('canvas', { timeout: 15000 })
    await new Promise(r => setTimeout(r, 2500))

    console.log('Capturing v2_01_hoodie_perspective.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_01_hoodie_perspective.png') })

    // Add starter badge to hoodie
    const starterBtn = await page.waitForSelector('button ::-p-text(Wild Explorer Badge)', { timeout: 5000 })
    if (starterBtn) {
      console.log('Adding "Wild Explorer Badge"...')
      await starterBtn.click()
      await new Promise(r => setTimeout(r, 2000))
    }
    console.log('Capturing v2_02_hoodie_front_badge.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_02_hoodie_front_badge.png') })

    // 2. Test Full-Zip Hoodie (GI18600) with surface metal zipper
    console.log('Navigating to http://localhost:3000/create/hoodie-zip...')
    await page.goto('http://localhost:3000/create/hoodie-zip', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })
    const zip3dBtn = await page.waitForSelector('button ::-p-text(3D Studio)', { timeout: 5000 })
    await zip3dBtn.click()
    await page.waitForSelector('canvas', { timeout: 15000 })
    await new Promise(r => setTimeout(r, 2000))

    console.log('Capturing v2_03_hoodie_zip_with_zipper.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_03_hoodie_zip_with_zipper.png') })

    // 3. Test T-Shirt (STTU755) with sculpted anatomical drape
    console.log('Navigating to http://localhost:3000/create/tshirt-classic...')
    await page.goto('http://localhost:3000/create/tshirt-classic', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })
    const tshirt3dBtn = await page.waitForSelector('button ::-p-text(3D Studio)', { timeout: 5000 })
    await tshirt3dBtn.click()
    await page.waitForSelector('canvas', { timeout: 15000 })
    await new Promise(r => setTimeout(r, 2000))

    console.log('Capturing v2_04_tshirt_perspective.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_04_tshirt_perspective.png') })

    // Switch to Front preset
    const frontBtn = await page.waitForSelector('button ::-p-text(Front)', { timeout: 5000 })
    await frontBtn.click()
    await new Promise(r => setTimeout(r, 1000))

    // Add graphic on T-shirt
    const tshirtStarter = await page.waitForSelector('button ::-p-text(Wild Explorer Badge)', { timeout: 5000 })
    if (tshirtStarter) {
      await tshirtStarter.click()
      await new Promise(r => setTimeout(r, 2000))
    }
    console.log('Capturing v2_05_tshirt_front_badge.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_05_tshirt_front_badge.png') })

    // 4. Test Move (Pan) mode and drag
    console.log('Testing Move (Pan) mode toggle...')
    const moveBtn = await page.waitForSelector('button ::-p-text(Move)', { timeout: 5000 })
    await moveBtn.click()
    await new Promise(r => setTimeout(r, 500))

    // Drag canvas with mouse to pan
    const canvas = await page.$('canvas')
    if (canvas) {
      const box = await canvas.boundingBox()
      if (box) {
        const startX = box.x + box.width / 2
        const startY = box.y + box.height / 2
        await page.mouse.move(startX, startY)
        await page.mouse.down()
        await page.mouse.move(startX + 120, startY - 80, { steps: 5 })
        await page.mouse.up()
        await new Promise(r => setTimeout(r, 800))
        console.log('Capturing v2_06_pan_move_mode.png...')
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_06_pan_move_mode.png') })
      }
    }

    // 5. Test Ceramic Mug
    console.log('Navigating to http://localhost:3000/create/mug-classic...')
    await page.goto('http://localhost:3000/create/mug-classic', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })
    const mug3dBtn = await page.waitForSelector('button ::-p-text(3D Studio)', { timeout: 5000 })
    await mug3dBtn.click()
    await page.waitForSelector('canvas', { timeout: 10000 })
    await new Promise(r => setTimeout(r, 1500))
    console.log('Capturing v2_07_mug_ceramic.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_07_mug_ceramic.png') })

    // 6. Test Canvas Tote Bag
    console.log('Navigating to http://localhost:3000/create/tote-standard...')
    await page.goto('http://localhost:3000/create/tote-standard', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })
    const tote3dBtn = await page.waitForSelector('button ::-p-text(3D Studio)', { timeout: 5000 })
    await tote3dBtn.click()
    await page.waitForSelector('canvas', { timeout: 10000 })
    await new Promise(r => setTimeout(r, 1500))
    console.log('Capturing v2_08_tote_canvas.png...')
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'v2_08_tote_canvas.png') })

    console.log('All verification steps completed successfully!')
  } finally {
    await browser.close()
  }
}

run().catch(err => {
  console.error('Verification error:', err)
  process.exit(1)
})
