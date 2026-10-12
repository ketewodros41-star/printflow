import puppeteer from 'puppeteer'
import fs from 'fs'

async function run() {
  console.log('Testing Preview Mode on http://localhost:3000/create/tshirt-longsleeve ...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await new Promise(r => setTimeout(r, 2000))

  // Click on "Add text" button
  console.log('Clicking Add text...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const addTextBtn = btns.find(b => b.textContent && b.textContent.includes('Add text'))
    if (addTextBtn) addTextBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Switch to Preview tab
  console.log('Switching to Preview tab...')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // Capture preview for Carolina Blue
  console.log('Selecting Carolina Blue...')
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button'))
    const cb = allBtns.find(b => b.getAttribute('title')?.includes('Carolina') || b.getAttribute('aria-label')?.includes('Carolina'))
    if (cb) cb.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'scripts/screenshots/verify-preview-carolina-blue.png' })
  console.log('Saved scripts/screenshots/verify-preview-carolina-blue.png')

  // Capture preview for Black
  console.log('Selecting Black...')
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button'))
    const blackBtn = allBtns.find(b => b.getAttribute('title')?.toLowerCase() === 'black' || b.getAttribute('aria-label')?.toLowerCase() === 'black')
    if (blackBtn) blackBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'scripts/screenshots/verify-preview-black.png' })
  console.log('Saved scripts/screenshots/verify-preview-black.png')

  // Capture preview for Red
  console.log('Selecting Red...')
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button'))
    const redBtn = allBtns.find(b => b.getAttribute('title')?.toLowerCase() === 'red' || b.getAttribute('aria-label')?.toLowerCase() === 'red')
    if (redBtn) redBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'scripts/screenshots/verify-preview-red.png' })
  console.log('Saved scripts/screenshots/verify-preview-red.png')

  // Capture close-up of cuffs
  const htmlCuffZoom = `
    <!DOCTYPE html>
    <html><body style="margin:0;background:#F1F5F9;display:flex;gap:30px;padding:30px;">
      <div style="background:#FFF;padding:16px;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.05);text-align:center;">
        <h3 style="margin-top:0;font-family:sans-serif;">Left Wrist / Cuff Close-Up (Carolina Blue)</h3>
        <div style="width:280px;height:240px;overflow:hidden;border:1px solid #E2E8F0;position:relative;background:#FFF;">
          <img src="http://localhost:3000/mockups/longsleeve-flatlay-carolina-blue.png" style="position:absolute;left:-50px;top:-540px;width:1024px;" />
        </div>
      </div>
      <div style="background:#FFF;padding:16px;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.05);text-align:center;">
        <h3 style="margin-top:0;font-family:sans-serif;">Right Wrist / Cuff Close-Up (Carolina Blue)</h3>
        <div style="width:280px;height:240px;overflow:hidden;border:1px solid #E2E8F0;position:relative;background:#FFF;">
          <img src="http://localhost:3000/mockups/longsleeve-flatlay-carolina-blue.png" style="position:absolute;left:-790px;top:-540px;width:1024px;" />
        </div>
      </div>
    </body></html>
  `
  const pageZoom = await browser.newPage()
  await pageZoom.setViewport({ width: 800, height: 400 })
  await pageZoom.setContent(htmlCuffZoom, { waitUntil: 'networkidle2' })
  await pageZoom.screenshot({ path: 'scripts/screenshots/verify-cuffs-intact-zoom.png' })
  console.log('Saved scripts/screenshots/verify-cuffs-intact-zoom.png')

  await browser.close()
  console.log('Verification finished successfully!')
}

run().catch(console.error)
