import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const outputDir = path.resolve('public/test-verifications/vector-blueprint')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function run() {
  console.log('🚀 Starting Comprehensive 2D Vector Blueprint vs Photorealistic Preview Verification...')

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

  const testReport = []

  try {
    // ═════════════════════════════════════════════════════════════════════════
    // 1. PULLOVER HOODIE (/create/hoodie-gildan)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing Pullover Hoodie (/create/hoodie-gildan) ---')
    await page.goto('http://localhost:3000/create/hoodie-gildan', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    // Check Edit mode backdrop: MUST be 2D vector blueprint, NOT photographic blank
    const hoodieEditCheck = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      if (!stage) return { foundStage: false }

      // Check if SVG elements of HoodieMockup exist
      const hasKangaroo = !!stage.querySelector('#kangaroo-pouch-pocket')
      const hasWaistband = !!stage.querySelector('#ribbed-waistband')
      const hasWristCuffs = !!stage.querySelector('#ribbed-wrist-cuffs')
      const hasInnerHood = !!stage.querySelector('#inner-hood-opening')
      
      // Check that photographic image underlay does NOT exist in Edit mode
      const photoImages = Array.from(stage.querySelectorAll('img, svg image')).filter(el => {
        const src = el.getAttribute('src') || el.getAttribute('href') || ''
        return src.includes('hoodie-flatlay') || src.includes('.png') || src.includes('.jpg')
      })

      return {
        foundStage: true,
        hasKangaroo,
        hasWaistband,
        hasWristCuffs,
        hasInnerHood,
        photoUnderlayCount: photoImages.length,
      }
    })
    console.log('Pullover Hoodie Edit Mode Check:', hoodieEditCheck)

    // Add starter artwork
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    // Change color to Forest Green
    await page.evaluate(() => {
      const colorBtns = Array.from(document.querySelectorAll('button[title*="Forest Green"], button[title*="Green"], span'))
      const greenBtn = colorBtns.find(b => (b.getAttribute('title') || b.textContent || '').includes('Forest Green'))
      if (greenBtn) greenBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    await page.screenshot({ path: path.join(outputDir, '01-pullover-hoodie-edit-blueprint.png') })
    console.log('Saved 01-pullover-hoodie-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    // Check Preview mode: MUST have photorealistic blank
    const hoodiePreviewCheck = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image'))
      const photoBlank = svgImages.find(img => (img.getAttribute('href') || '').includes('hoodie-flatlay'))
      const artGroup = document.querySelector('#artwork-projection-group')
      return {
        hasPhotoBlank: !!photoBlank,
        photoBlankUrl: photoBlank?.getAttribute('href') || null,
        hasArtworkProjection: !!artGroup,
      }
    })
    console.log('Pullover Hoodie Preview Mode Check:', hoodiePreviewCheck)

    await page.screenshot({ path: path.join(outputDir, '02-pullover-hoodie-preview-photoreal.png') })
    console.log('Saved 02-pullover-hoodie-preview-photoreal.png')

    testReport.push({
      product: 'Pullover Hoodie',
      editModeVectorBlueprint: hoodieEditCheck.hasKangaroo && hoodieEditCheck.hasWaistband && hoodieEditCheck.photoUnderlayCount === 0,
      previewModePhotoreal: hoodiePreviewCheck.hasPhotoBlank && hoodiePreviewCheck.hasArtworkProjection,
    })

    // ═════════════════════════════════════════════════════════════════════════
    // 2. FULL-ZIP HOODIE (/create/hoodie-zip)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 2. Testing Full-Zip Hoodie (/create/hoodie-zip) ---')
    await page.goto('http://localhost:3000/create/hoodie-zip', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    const zipEditCheck = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      if (!stage) return { foundStage: false }

      const hasZipper = !!stage.querySelector('#authentic-center-zipper')
      const hasSplitPockets = !!stage.querySelector('#split-kangaroo-pockets')
      const hasZipperPull = !!stage.querySelector('#zipper-slider-pull')
      const hasRibbedHem = !!stage.querySelector('#zip-ribbed-waistband')

      const photoImages = Array.from(stage.querySelectorAll('img, svg image')).filter(el => {
        const src = el.getAttribute('src') || el.getAttribute('href') || ''
        return src.includes('hoodie-zip') || src.includes('.png') || src.includes('.jpg')
      })

      return {
        foundStage: true,
        hasZipper,
        hasSplitPockets,
        hasZipperPull,
        hasRibbedHem,
        photoUnderlayCount: photoImages.length,
      }
    })
    console.log('Full-Zip Hoodie Edit Mode Check:', zipEditCheck)

    // Add starter artwork
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    await page.screenshot({ path: path.join(outputDir, '03-zip-hoodie-edit-blueprint.png') })
    console.log('Saved 03-zip-hoodie-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    const zipPreviewCheck = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image'))
      const photoBlank = svgImages.find(img => (img.getAttribute('href') || '').includes('hoodie-zip'))
      const clipPath = document.querySelector('clipPath[id*="zip-chest-clip"]')
      const artGroup = document.querySelector('#artwork-projection-group')
      return {
        hasPhotoBlank: !!photoBlank,
        photoBlankUrl: photoBlank?.getAttribute('href') || null,
        hasZipperClip: !!clipPath,
        hasArtworkProjection: !!artGroup,
      }
    })
    console.log('Full-Zip Hoodie Preview Mode Check:', zipPreviewCheck)

    await page.screenshot({ path: path.join(outputDir, '04-zip-hoodie-preview-photoreal.png') })
    console.log('Saved 04-zip-hoodie-preview-photoreal.png')

    testReport.push({
      product: 'Full-Zip Hoodie',
      editModeVectorBlueprint: zipEditCheck.hasZipper && zipEditCheck.hasSplitPockets && zipEditCheck.photoUnderlayCount === 0,
      previewModePhotoreal: zipPreviewCheck.hasPhotoBlank && zipPreviewCheck.hasZipperClip,
    })

    // ═════════════════════════════════════════════════════════════════════════
    // 3. SHORT SLEEVE T-SHIRT (/create/tshirt-classic)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 3. Testing Short Sleeve T-Shirt (/create/tshirt-classic) ---')
    await page.goto('http://localhost:3000/create/tshirt-classic', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    const tshirtEditCheck = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      if (!stage) return { foundStage: false }

      const hasShirtBody = !!stage.querySelector('#shirt-body')
      const hasInnerNeck = !!stage.querySelector('#inner-neck')
      const photoImages = Array.from(stage.querySelectorAll('img, svg image')).filter(el => {
        const src = el.getAttribute('src') || el.getAttribute('href') || ''
        return src.includes('tshirt-flatlay') || src.includes('.png') || src.includes('.jpg')
      })

      return {
        foundStage: true,
        hasShirtBody,
        hasInnerNeck,
        photoUnderlayCount: photoImages.length,
      }
    })
    console.log('T-Shirt Edit Mode Check:', tshirtEditCheck)

    // Add text
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

    await page.screenshot({ path: path.join(outputDir, '05-tshirt-edit-blueprint.png') })
    console.log('Saved 05-tshirt-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    const tshirtPreviewCheck = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image'))
      const photoBlank = svgImages.find(img => (img.getAttribute('href') || '').includes('tshirt-flatlay'))
      return {
        hasPhotoBlank: !!photoBlank,
        photoBlankUrl: photoBlank?.getAttribute('href') || null,
      }
    })
    console.log('T-Shirt Preview Mode Check:', tshirtPreviewCheck)

    await page.screenshot({ path: path.join(outputDir, '06-tshirt-preview-photoreal.png') })
    console.log('Saved 06-tshirt-preview-photoreal.png')

    testReport.push({
      product: 'Short Sleeve T-Shirt',
      editModeVectorBlueprint: tshirtEditCheck.hasShirtBody && tshirtEditCheck.photoUnderlayCount === 0,
      previewModePhotoreal: tshirtPreviewCheck.hasPhotoBlank,
    })

    // ═════════════════════════════════════════════════════════════════════════
    // 4. LONG SLEEVE SHIRT (/create/tshirt-longsleeve)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 4. Testing Long Sleeve Shirt (/create/tshirt-longsleeve) ---')
    await page.goto('http://localhost:3000/create/tshirt-longsleeve', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    const lsEditCheck = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      if (!stage) return { foundStage: false }

      const hasLsBase = !!stage.querySelector('[id*="longsleeve-base"]')
      const photoImages = Array.from(stage.querySelectorAll('img, svg image')).filter(el => {
        const src = el.getAttribute('src') || el.getAttribute('href') || ''
        return src.includes('longsleeve-flatlay') || src.includes('.png') || src.includes('.jpg')
      })

      return {
        foundStage: true,
        hasLsBase,
        photoUnderlayCount: photoImages.length,
      }
    })
    console.log('Long Sleeve Edit Mode Check:', lsEditCheck)

    // Add starter artwork
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    await page.screenshot({ path: path.join(outputDir, '07-longsleeve-edit-blueprint.png') })
    console.log('Saved 07-longsleeve-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    const lsPreviewCheck = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image'))
      const photoBlank = svgImages.find(img => (img.getAttribute('href') || '').includes('longsleeve-flatlay'))
      return {
        hasPhotoBlank: !!photoBlank,
        photoBlankUrl: photoBlank?.getAttribute('href') || null,
      }
    })
    console.log('Long Sleeve Preview Mode Check:', lsPreviewCheck)

    await page.screenshot({ path: path.join(outputDir, '08-longsleeve-preview-photoreal.png') })
    console.log('Saved 08-longsleeve-preview-photoreal.png')

    testReport.push({
      product: 'Long Sleeve Shirt',
      editModeVectorBlueprint: lsEditCheck.hasLsBase && lsEditCheck.photoUnderlayCount === 0,
      previewModePhotoreal: lsPreviewCheck.hasPhotoBlank,
    })

    // ═════════════════════════════════════════════════════════════════════════
    // 5. TOTE BAG (/create/tote-standard)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 5. Testing Tote Bag (/create/tote-standard) ---')
    await page.goto('http://localhost:3000/create/tote-standard', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    const toteEditCheck = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      if (!stage) return { foundStage: false }

      const svgPaths = Array.from(stage.querySelectorAll('svg path'))
      const photoImages = Array.from(stage.querySelectorAll('img, svg image')).filter(el => {
        const src = el.getAttribute('src') || el.getAttribute('href') || ''
        return src.includes('tote-flatlay') || src.includes('.png') || src.includes('.jpg')
      })

      return {
        foundStage: true,
        svgPathCount: svgPaths.length,
        photoUnderlayCount: photoImages.length,
      }
    })
    console.log('Tote Bag Edit Mode Check:', toteEditCheck)

    // Add starter artwork
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    await page.screenshot({ path: path.join(outputDir, '09-tote-edit-blueprint.png') })
    console.log('Saved 09-tote-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    const totePreviewCheck = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image'))
      const photoBlank = svgImages.find(img => (img.getAttribute('href') || '').includes('tote-flatlay'))
      return {
        hasPhotoBlank: !!photoBlank,
        photoBlankUrl: photoBlank?.getAttribute('href') || null,
      }
    })
    console.log('Tote Bag Preview Mode Check:', totePreviewCheck)

    await page.screenshot({ path: path.join(outputDir, '10-tote-preview-photoreal.png') })
    console.log('Saved 10-tote-preview-photoreal.png')

    testReport.push({
      product: 'Tote Bag',
      editModeVectorBlueprint: toteEditCheck.svgPathCount > 0 && toteEditCheck.photoUnderlayCount === 0,
      previewModePhotoreal: totePreviewCheck.hasPhotoBlank,
    })

    // ═════════════════════════════════════════════════════════════════════════
    // 6. CERAMIC MUG (/create/mug-classic)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 6. Testing Ceramic Mug (/create/mug-classic) ---')
    await page.goto('http://localhost:3000/create/mug-classic', { waitUntil: 'networkidle2' })
    await new Promise(r => setTimeout(r, 1200))

    const mugEditCheck = await page.evaluate(() => {
      const stage = Array.from(document.querySelectorAll('div')).find(el => el.style.width === '500px')
      if (!stage) return { foundStage: false }

      const hasCylinder = !!stage.querySelector('#mug-cylinder')
      const hasHandle = !!stage.querySelector('#mug-handle')
      const photoImages = Array.from(stage.querySelectorAll('img, svg image')).filter(el => {
        const src = el.getAttribute('src') || el.getAttribute('href') || ''
        return src.includes('mug-studio') || src.includes('.png') || src.includes('.jpg')
      })

      return {
        foundStage: true,
        hasCylinder,
        hasHandle,
        photoUnderlayCount: photoImages.length,
      }
    })
    console.log('Mug Edit Mode Check:', mugEditCheck)

    // Add starter artwork
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const artBtn = btns.find(b => b.textContent && b.textContent.includes('Be Good'))
      if (artBtn) artBtn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    await page.screenshot({ path: path.join(outputDir, '11-mug-edit-blueprint.png') })
    console.log('Saved 11-mug-edit-blueprint.png')

    // Switch to Preview Mode
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'))
      const prevTab = tabs.find(b => b.textContent && b.textContent.includes('Preview'))
      if (prevTab) prevTab.click()
    })
    await new Promise(r => setTimeout(r, 1200))

    const mugPreviewCheck = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image'))
      const photoBlank = svgImages.find(img => (img.getAttribute('href') || '').includes('mug-studio'))
      return {
        hasPhotoBlank: !!photoBlank,
        photoBlankUrl: photoBlank?.getAttribute('href') || null,
      }
    })
    console.log('Mug Preview Mode Check:', mugPreviewCheck)

    await page.screenshot({ path: path.join(outputDir, '12-mug-preview-photoreal.png') })
    console.log('Saved 12-mug-preview-photoreal.png')

    testReport.push({
      product: 'Ceramic Mug',
      editModeVectorBlueprint: mugEditCheck.hasCylinder && mugEditCheck.hasHandle && mugEditCheck.photoUnderlayCount === 0,
      previewModePhotoreal: mugPreviewCheck.hasPhotoBlank,
    })

    console.log('\n═════════════════════════════════════════════════════════════════')
    console.log('📊 FINAL TEST REPORT SUMMARY:')
    console.table(testReport)
    console.log('═════════════════════════════════════════════════════════════════')

    const allPassed = testReport.every(t => t.editModeVectorBlueprint && t.previewModePhotoreal)
    if (!allPassed) {
      throw new Error('Some test cases failed verification!')
    }
    console.log('🎉 ALL 6 PRODUCT CATEGORIES PASSED 100% WITH EDIT BLUEPRINT & PREVIEW PHOTOREAL PARITY!')
  } finally {
    await browser.close()
  }
}

run().catch(err => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
