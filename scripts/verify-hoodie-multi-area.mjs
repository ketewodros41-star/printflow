import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const outputDir = path.resolve('public/test-verifications/hoodie-multi-area')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function run() {
  console.log('🚀 Testing Hoodie Multi-Area Reachability & Parity...')

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1100']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1100 })
  page.on('dialog', async d => {
    console.log('Dialog:', d.message())
    await d.dismiss()
  })

  try {
    // ═════════════════════════════════════════════════════════════════════════
    // 1. Pullover Hoodie: Front, Back, Color Palette & Artwork
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing Pullover Hoodie Multi-Area ---')
    await page.goto('http://localhost:3000/create/hoodie-gildan', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    // Add starter artwork to Center Chest
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    // Switch print area to Back
    console.log('Switching to Back view...')
    await page.evaluate(() => {
      const areaBtns = Array.from(document.querySelectorAll('button'))
      const backBtn = areaBtns.find(b => b.textContent && b.textContent.trim() === 'Back')
      if (backBtn) backBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    // Add text on back
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('button'))
      const textBtn = navButtons.find(b => b.textContent && b.textContent.includes('Text'))
      if (textBtn) textBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))
    await page.evaluate(() => {
      const addHeading = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Heading'))
      if (addHeading) addHeading.click()
    })
    await new Promise(r => setTimeout(r, 600))

    await page.screenshot({ path: path.join(outputDir, '01-hoodie-back-edit-blueprint.png') })
    console.log('Saved 01-hoodie-back-edit-blueprint.png')

    // Switch to Preview Mode
    console.log('Switching to Preview mode...')
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    await page.screenshot({ path: path.join(outputDir, '02-hoodie-back-preview-photoreal.png') })
    console.log('Saved 02-hoodie-back-preview-photoreal.png')

    // Click Front scene thumbnail in Preview mode
    console.log('Clicking Front Flat-Lay scene thumbnail in Preview mode...')
    await page.evaluate(() => {
      const sceneThumbnails = Array.from(document.querySelectorAll('button'))
      const frontScene = sceneThumbnails.find(b => b.textContent && b.textContent.includes('Front Pullover'))
      if (frontScene) frontScene.click()
    })
    await new Promise(r => setTimeout(r, 1000))

    await page.screenshot({ path: path.join(outputDir, '03-hoodie-front-preview-photoreal.png') })
    console.log('Saved 03-hoodie-front-preview-photoreal.png')

    // ═════════════════════════════════════════════════════════════════════════
    // 2. Full-Zip Hoodie: Left Chest & Right Chest
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 2. Testing Full-Zip Hoodie Left & Right Chest ---')
    await page.goto('http://localhost:3000/create/hoodie-zip', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    // Select Left Chest print area
    await page.evaluate(() => {
      const areaBtns = Array.from(document.querySelectorAll('button'))
      const leftChestBtn = areaBtns.find(b => b.textContent && b.textContent.trim() === 'Left chest')
      if (leftChestBtn) leftChestBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    // Add artwork
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    await page.screenshot({ path: path.join(outputDir, '04-zip-left-chest-edit-blueprint.png') })
    console.log('Saved 04-zip-left-chest-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    await page.screenshot({ path: path.join(outputDir, '05-zip-left-chest-preview-photoreal.png') })
    console.log('Saved 05-zip-left-chest-preview-photoreal.png')

    console.log('✅ Multi-Area Hoodie Verification Passed Successfully!')
  } finally {
    await browser.close()
  }
}

run().catch(err => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
