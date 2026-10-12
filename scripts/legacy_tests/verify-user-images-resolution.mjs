import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const OUT_DIR = path.resolve('public/mockup-tests')
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

async function run() {
  console.log('Launching browser for user verification...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
    defaultViewport: { width: 1400, height: 900 }
  })

  const page = await browser.newPage()

  // 1. Open Classic T-Shirt Studio (which has Red, Navy, Olive, Sage, etc.)
  console.log('Navigating to editor...')
  await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  // 2. Select Red garment color
  console.log('Selecting Red color swatch (#C62828)...')
  await page.evaluate(() => {
    const colorBtns = Array.from(document.querySelectorAll('button[title*="Red"]'))
    if (colorBtns.length > 0) colorBtns[0].click()
  })
  await new Promise(r => setTimeout(r, 800))

  // 3. Open Text Tool and click "+ Add 'NEW DAY' Puffy Chenille (Image 1)"
  console.log('Adding "NEW DAY" Puffy Chenille...')
  const textToolBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.includes('Add text'))
  })
  if (textToolBtn.asElement()) {
    await textToolBtn.asElement().click()
    await new Promise(r => setTimeout(r, 600))
  }

  const addChenilleBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.includes('NEW DAY'))
  })
  if (addChenilleBtn.asElement()) {
    await addChenilleBtn.asElement().click()
    await new Promise(r => setTimeout(r, 800))
  }

  // 4. Switch to Preview Mode
  console.log('Switching to Preview tab...')
  const previewTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
  })
  if (previewTab.asElement()) {
    await previewTab.asElement().click()
    await new Promise(r => setTimeout(r, 1500))
  }

  // Capture Screenshot 1: Red T-Shirt with "NEW DAY" Puffy Chenille in Preview Mode
  const previewRedChenillePath = path.join(OUT_DIR, 'preview-red-tshirt-chenille-newday.png')
  await page.screenshot({ path: previewRedChenillePath })
  console.log(`Saved screenshot: ${previewRedChenillePath}`)

  // 5. Test Sewed & Chenille Graphics Library
  console.log('Returning to Edit Mode and testing Graphics Library...')
  const editTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.trim() === 'Edit')
  })
  if (editTab.asElement()) {
    await editTab.asElement().click()
    await new Promise(r => setTimeout(r, 800))
  }

  // Open Graphics tool
  const graphicsToolBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.includes('Graphics'))
  })
  if (graphicsToolBtn.asElement()) {
    await graphicsToolBtn.asElement().click()
    await new Promise(r => setTimeout(r, 800))
  }

  // Click on "Sewed & Chenille" category pill
  console.log('Clicking "Sewed & Chenille" category...')
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'))
    const sewedPill = pills.find(p => p.textContent && p.textContent.includes('Sewed & Chenille'))
    if (sewedPill) sewedPill.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Capture Screenshot 2: Graphics library showing Sewed & Chenille patches
  const graphicsPanelPath = path.join(OUT_DIR, 'preview-graphics-sewed-category.png')
  await page.screenshot({ path: graphicsPanelPath })
  console.log(`Saved screenshot: ${graphicsPanelPath}`)

  // Click on "3D Embroidered Heart Patch"
  console.log('Adding Embroidered Heart Patch...')
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('button'))
    const heartItem = items.find(b => b.textContent && b.textContent.includes('Heart Patch'))
    if (heartItem) heartItem.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Switch to Forest Green garment color
  console.log('Switching to Forest Green and Preview...')
  await page.evaluate(() => {
    const colorBtns = Array.from(document.querySelectorAll('button[title*="Olive"], button[title*="Sage"], button[title*="Forest"], button[title*="Navy"]'))
    if (colorBtns.length > 0) colorBtns[0].click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Switch to Preview
  const previewTab2 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    return btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
  })
  if (previewTab2.asElement()) {
    await previewTab2.asElement().click()
    await new Promise(r => setTimeout(r, 1500))
  }

  const previewGreenHeartPath = path.join(OUT_DIR, 'preview-dark-tshirt-embroidered-heart.png')
  await page.screenshot({ path: previewGreenHeartPath })
  console.log(`Saved screenshot: ${previewGreenHeartPath}`)

  await browser.close()
  console.log('Verification finished successfully!')
}

run().catch(err => {
  console.error('Error during verification:', err)
  process.exit(1)
})
