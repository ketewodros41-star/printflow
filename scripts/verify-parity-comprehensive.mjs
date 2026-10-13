import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const outputDir = path.resolve('public/test-verifications/hoodie-parity')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function runComprehensiveVerification() {
  console.log('🚀 Running Comprehensive Hoodie & Edit Mode Parity Verification...')

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1100']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1100 })

  const results = {
    pulloverFrontParity: null,
    pulloverBackParity: null,
    zipLeftChestParity: null,
    zipNarrowTextFit: null,
    zipZipperClipPresent: false,
    darkHeatherAndMaroonBlanks: null,
    mockupDownloadEdit: false,
    mockupDownloadPreview: false,
    errors: []
  }

  try {
    // ═══════════════════════════════════════════════════════════
    // TEST 1: Pullover Hoodie Front & Back Parity
    // ═══════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing Pullover Hoodie (/create/hoodie-gildan) ---')
    await page.goto('http://localhost:3000/create/hoodie-gildan', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1000))

    // Add artwork on front
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    const frontEdit = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      const layer = stage?.querySelector('div[style*="position: absolute"]:not(.pointer-events-none)')
      if (layer) {
        return {
          left: parseFloat(layer.style.left),
          top: parseFloat(layer.style.top),
          width: parseFloat(layer.style.width),
          height: parseFloat(layer.style.height)
        }
      }
      return null
    })

    // Switch to Back side in Edit mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const backBtn = btns.find(b => b.textContent && b.textContent.includes('Back side'))
      if (backBtn) backBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    // Add artwork on back
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Wild Explorer'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    const backEdit = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      const layer = stage?.querySelector('div[style*="position: absolute"]:not(.pointer-events-none)')
      if (layer) {
        return {
          left: parseFloat(layer.style.left),
          top: parseFloat(layer.style.top),
          width: parseFloat(layer.style.width),
          height: parseFloat(layer.style.height)
        }
      }
      return null
    })

    // Test download mockup in Edit mode
    const editDownload = await page.evaluate(async () => {
      const btns = Array.from(document.querySelectorAll('button'))
      const dlBtn = btns.find(b => b.textContent && b.textContent.includes('Download mockup'))
      if (dlBtn) {
        dlBtn.click()
        return true
      }
      return false
    })
    results.mockupDownloadEdit = editDownload
    await new Promise(r => setTimeout(r, 500))

    // Switch to Preview
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const prevBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
      if (prevBtn) prevBtn.click()
    })
    await new Promise(r => setTimeout(r, 1000))

    // Switch to Back scene in Preview
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const backThumb = btns.find(b => b.textContent && b.textContent.toLowerCase().includes('back'))
      if (backThumb) backThumb.click()
    })
    await new Promise(r => setTimeout(r, 800))

    const backPreview = await page.evaluate(() => {
      const previewSvg = Array.from(document.querySelectorAll('svg')).find(s => s.getAttribute('viewBox') === '0 0 1024 1024')
      const img = previewSvg?.querySelector('image[preserveAspectRatio]')
      if (img) {
        return {
          x: parseFloat(img.getAttribute('x') || '0'),
          y: parseFloat(img.getAttribute('y') || '0'),
          width: parseFloat(img.getAttribute('width') || '0'),
          height: parseFloat(img.getAttribute('height') || '0')
        }
      }
      return null
    })

    if (backEdit && backPreview) {
      const expX = (backEdit.left / 500) * 1024
      const expY = (backEdit.top / 500) * 1024
      const driftX = Math.abs(backPreview.x - expX)
      const driftY = Math.abs(backPreview.y - expY)
      results.pulloverBackParity = { driftX, driftY, isZeroDrift: driftX < 0.01 && driftY < 0.01 }
      console.log(`Pullover Back Parity Drift: X=${driftX.toFixed(4)}px, Y=${driftY.toFixed(4)}px`)
    }

    // Switch to Front scene in Preview
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const frontThumb = btns.find(b => b.textContent && b.textContent.toLowerCase().includes('front'))
      if (frontThumb) frontThumb.click()
    })
    await new Promise(r => setTimeout(r, 800))

    const frontPreview = await page.evaluate(() => {
      const previewSvg = Array.from(document.querySelectorAll('svg')).find(s => s.getAttribute('viewBox') === '0 0 1024 1024')
      const img = previewSvg?.querySelector('image[preserveAspectRatio]')
      if (img) {
        return {
          x: parseFloat(img.getAttribute('x') || '0'),
          y: parseFloat(img.getAttribute('y') || '0'),
          width: parseFloat(img.getAttribute('width') || '0'),
          height: parseFloat(img.getAttribute('height') || '0')
        }
      }
      return null
    })

    if (frontEdit && frontPreview) {
      const expX = (frontEdit.left / 500) * 1024
      const expY = (frontEdit.top / 500) * 1024
      const driftX = Math.abs(frontPreview.x - expX)
      const driftY = Math.abs(frontPreview.y - expY)
      results.pulloverFrontParity = { driftX, driftY, isZeroDrift: driftX < 0.01 && driftY < 0.01 }
      console.log(`Pullover Front Parity Drift: X=${driftX.toFixed(4)}px, Y=${driftY.toFixed(4)}px`)
    }

    // Test download mockup in Preview mode
    const prevDownload = await page.evaluate(async () => {
      const btns = Array.from(document.querySelectorAll('button'))
      const dlBtn = btns.find(b => b.textContent && b.textContent.includes('Download mockup'))
      if (dlBtn) {
        dlBtn.click()
        return true
      }
      return false
    })
    results.mockupDownloadPreview = prevDownload

    // ═══════════════════════════════════════════════════════════
    // TEST 2: Full-Zip Hoodie (/create/hoodie-zip)
    // ═══════════════════════════════════════════════════════════
    console.log('\n--- 2. Testing Full-Zip Hoodie (/create/hoodie-zip) ---')
    await page.goto('http://localhost:3000/create/hoodie-zip', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1000))

    // Add text on Left Chest (narrow print area w=88)
    console.log('Testing text addition on Left Chest narrow area...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const addTextTool = btns.find(b => b.textContent && b.textContent.includes('Add text'))
      if (addTextTool) addTextTool.click()
    })
    await new Promise(r => setTimeout(r, 500))

    // Click "NEW DAY" quick add button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const newDayBtn = btns.find(b => b.textContent && b.textContent.includes('NEW DAY'))
      if (newDayBtn) newDayBtn.click()
    })
    await new Promise(r => setTimeout(r, 500))

    const textFit = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      const textLayer = stage?.querySelector('div[style*="position: absolute"]:not(.pointer-events-none)')
      if (textLayer) {
        const left = parseFloat(textLayer.style.left)
        const width = parseFloat(textLayer.style.width)
        return {
          left,
          width,
          right: left + width,
          // Left chest bounds in Edit mode: left=261, w=88, so left should be >= 250 (zipper track)
          isToRightOfZipper: left >= 250,
          fitsWithinChest: width <= 88
        }
      }
      return null
    })
    console.log('Text Fit on Zip Hoodie Left Chest:', textFit)
    results.zipNarrowTextFit = textFit

    // Add starter graphic
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const graphicsTool = btns.find(b => b.textContent && b.textContent.includes('Graphics'))
      if (graphicsTool) graphicsTool.click()
    })
    await new Promise(r => setTimeout(r, 500))

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Habesha Coffee'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 500))

    const zipEditGraphic = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      const layers = Array.from(stage?.querySelectorAll('div[style*="position: absolute"]:not(.pointer-events-none)') || [])
      const graphic = layers.find(l => l.querySelector('img'))
      if (graphic) {
        return {
          left: parseFloat(graphic.style.left),
          top: parseFloat(graphic.style.top),
          width: parseFloat(graphic.style.width),
          height: parseFloat(graphic.style.height)
        }
      }
      return null
    })

    // Switch to Preview
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const prevBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
      if (prevBtn) prevBtn.click()
    })
    await new Promise(r => setTimeout(r, 1000))

    // Check zipper clipPath presence
    const clipPresent = await page.evaluate(() => {
      const clip = document.querySelector('clipPath[id*="zip-chest-clip"]')
      return Boolean(clip)
    })
    results.zipZipperClipPresent = clipPresent
    console.log('Zipper Chest ClipPath Present in SVG Defs:', clipPresent)

    const zipPreviewGraphic = await page.evaluate(() => {
      const previewSvg = Array.from(document.querySelectorAll('svg')).find(s => s.getAttribute('viewBox') === '0 0 1024 1024')
      const images = Array.from(previewSvg?.querySelectorAll('image[preserveAspectRatio]') || [])
      const graphicImg = images.find(img => (img.getAttribute('href') || '').includes('habesha') || (img.getAttribute('href') || '').includes('coffee') || (img.getAttribute('href') || '').includes('svg'))
      if (graphicImg) {
        return {
          x: parseFloat(graphicImg.getAttribute('x') || '0'),
          y: parseFloat(graphicImg.getAttribute('y') || '0'),
          width: parseFloat(graphicImg.getAttribute('width') || '0'),
          height: parseFloat(graphicImg.getAttribute('height') || '0')
        }
      }
      return null
    })

    if (zipEditGraphic && zipPreviewGraphic) {
      const expX = (zipEditGraphic.left / 500) * 1024
      const expY = (zipEditGraphic.top / 500) * 1024
      const driftX = Math.abs(zipPreviewGraphic.x - expX)
      const driftY = Math.abs(zipPreviewGraphic.y - expY)
      results.zipLeftChestParity = { driftX, driftY, isZeroDrift: driftX < 0.01 && driftY < 0.01 }
      console.log(`Zip Left Chest Parity Drift: X=${driftX.toFixed(4)}px, Y=${driftY.toFixed(4)}px`)
    }

    // ═══════════════════════════════════════════════════════════
    // TEST 3: Dark Heather and Maroon blank asset resolution
    // ═══════════════════════════════════════════════════════════
    console.log('\n--- 3. Testing Dark Heather & Maroon Blank Resolution ---')
    const colorChecks = await page.evaluate(async () => {
      // Find color buttons
      const checks = []
      for (const color of ['Dark Heather', 'Maroon', 'White', 'Black']) {
        const swatches = Array.from(document.querySelectorAll('button[title]'))
        const swatch = swatches.find(b => (b.getAttribute('title') || '').toLowerCase().startsWith(color.toLowerCase()))
        if (swatch) {
          swatch.click()
          await new Promise(r => setTimeout(r, 600))
          const svg = document.querySelector('svg[viewBox="0 0 1024 1024"]')
          const blankImage = svg?.querySelector('image')
          const href = blankImage ? blankImage.getAttribute('href') : null
          const hasFilter = blankImage ? blankImage.getAttribute('filter') : null
          checks.push({ color, href, isDirectAsset: !hasFilter })
        }
      }
      return checks
    })
    console.log('Colorway Blank Checks:', colorChecks)
    results.darkHeatherAndMaroonBlanks = colorChecks

    // Save final screenshots
    await page.screenshot({ path: path.join(outputDir, '07-hoodie-zip-verified-parity.png') })
    console.log('Saved 07-hoodie-zip-verified-parity.png')

  } catch (err) {
    console.error('Verification Error:', err)
    results.errors.push(err.message)
  } finally {
    await browser.close()
  }

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('COMPREHENSIVE VERIFICATION RESULTS:')
  console.log(JSON.stringify(results, null, 2))
  console.log('═══════════════════════════════════════════════════════════')
}

runComprehensiveVerification()
