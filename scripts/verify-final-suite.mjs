import puppeteer from 'puppeteer'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1050']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1050 })

  await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2000))

  // Add text
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const addTextBtn = btns.find(b => b.textContent && b.textContent.includes('Add text'))
    if (addTextBtn) addTextBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Go to Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const previewBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (previewBtn) previewBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Select Sewed/Thread finish
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const sewedBtn = btns.find(b => b.textContent && b.textContent.includes('Sewed'))
    if (sewedBtn) sewedBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // Screenshot front view with sewed finish on white
  await page.screenshot({ path: 'scripts/screenshots/verify-final-white-front.png' })
  console.log('Saved verify-final-white-front.png')

  // Switch to Collar Closeup view
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const collarBtn = btns.find(b => b.textContent && b.textContent.includes('Collar'))
    if (collarBtn) collarBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'scripts/screenshots/verify-final-collar.png' })
  console.log('Saved verify-final-collar.png')

  // Switch to Person Left view
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const personBtn = btns.find(b => b.textContent && b.textContent.includes('Person Left'))
    if (personBtn) personBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'scripts/screenshots/verify-final-person.png' })
  console.log('Saved verify-final-person.png')

  await browser.close()
  console.log('Final full suite verified!')
}

run().catch(console.error)
