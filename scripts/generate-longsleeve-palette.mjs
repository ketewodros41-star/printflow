import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  const whiteBase64 = fs.readFileSync('public/mockups/longsleeve-flatlay-white.png').toString('base64')
  const greyBase64 = fs.readFileSync('public/mockups/longsleeve-flatlay-grey.png').toString('base64')

  const PALETTE = [
    { name: 'longsleeve-flatlay-black.png', hex: '#18181b', shadowBoost: 0.15, base: 'white' },
    { name: 'longsleeve-flatlay-navy.png', hex: '#1b2a4a', shadowBoost: 0.22, base: 'white' },
    { name: 'longsleeve-flatlay-red.png', hex: '#c62828', shadowBoost: 0.25, base: 'white' },
    { name: 'longsleeve-flatlay-forest-green.png', hex: '#1b4332', shadowBoost: 0.22, base: 'white' },
    { name: 'longsleeve-flatlay-maroon.png', hex: '#5c1d24', shadowBoost: 0.24, base: 'white' },
    { name: 'longsleeve-flatlay-royal.png', hex: '#1d4ed8', shadowBoost: 0.22, base: 'white' },
    { name: 'longsleeve-flatlay-sand.png', hex: '#d4c5b3', shadowBoost: 0.10, base: 'white' },
    { name: 'longsleeve-flatlay-military-green.png', hex: '#4b5320', shadowBoost: 0.20, base: 'white' },
    { name: 'longsleeve-flatlay-orange.png', hex: '#ea580c', shadowBoost: 0.22, base: 'white' },
    { name: 'longsleeve-flatlay-carolina-blue.png', hex: '#7baed1', shadowBoost: 0.12, base: 'white' },
    { name: 'longsleeve-flatlay-dark-heather.png', hex: '#4a4a48', shadowBoost: 0.15, base: 'grey' },
    { name: 'longsleeve-flatlay-ash.png', hex: '#dededb', shadowBoost: 0.05, base: 'grey' },
  ]

  for (const item of PALETTE) {
    console.log(`Dyeing ${item.name} (${item.hex})...`)
    const baseSource = item.base === 'grey' ? greyBase64 : whiteBase64
    const dyedPngBase64 = await page.evaluate((b64, hex, shadowBoost) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        img.onload = () => {
          const c = document.createElement('canvas')
          c.width = img.width
          c.height = img.height
          const ctx = c.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, c.width, c.height)
          const d = imgData.data

          // Parse target hex
          const rDye = parseInt(hex.slice(1, 3), 16) / 255
          const gDye = parseInt(hex.slice(3, 5), 16) / 255
          const bDye = parseInt(hex.slice(5, 7), 16) / 255

          const L_ref = 0.90 // White baseline reference

          for (let i = 0; i < d.length; i += 4) {
            const alpha = d[i+3]
            if (alpha < 8) continue

            // Normalized source luminance
            const rS = d[i] / 255
            const gS = d[i+1] / 255
            const bS = d[i+2] / 255
            const L = 0.299 * rS + 0.587 * gS + 0.114 * bS

            // Normalized fold lighting factor
            const L_norm = Math.min(1.0, L / L_ref)

            // S-curve shadow dye absorption
            const dyeFactor = Math.pow(L_norm, 1.15) * (1 + shadowBoost * (1 - L_norm))

            let rOut = rDye * dyeFactor
            let gOut = gDye * dyeFactor
            let bOut = bDye * dyeFactor

            // Preserve Fresnel specular highlight on peaks
            if (L > L_ref) {
              const spec = Math.pow((L - L_ref) / (1.0 - L_ref), 1.3)
              rOut = rOut + (1.0 - rOut) * spec
              gOut = gOut + (1.0 - gOut) * spec
              bOut = bOut + (1.0 - bOut) * spec
            }

            d[i]   = Math.min(255, Math.max(0, Math.round(rOut * 255)))
            d[i+1] = Math.min(255, Math.max(0, Math.round(gOut * 255)))
            d[i+2] = Math.min(255, Math.max(0, Math.round(bOut * 255)))
          }

          ctx.putImageData(imgData, 0, 0)
          resolve(c.toDataURL('image/png').split(',')[1])
        }
      })
    }, baseSource, item.hex, item.shadowBoost)

    const outPath = path.resolve('public/mockups', item.name)
    fs.writeFileSync(outPath, Buffer.from(dyedPngBase64, 'base64'))
    console.log(`Saved ${outPath}`)
  }

  // Generate Back Flat Lay Blank (high back collar)
  console.log('Generating Back Flat Lay Blank...')
  const backPngBase64 = await page.evaluate((b64) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = `data:image/png;base64,${b64}`
      img.onload = () => {
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0)

        // Fill inner neck collar cavity with high back collar band
        const centerX = Math.floor(img.width / 2)
        const neckTopY = Math.floor(img.height * 0.14)
        const neckBottomY = Math.floor(img.height * 0.22)
        const neckWidth = Math.floor(img.width * 0.22)

        const neckImgData = ctx.getImageData(centerX - neckWidth/2, neckTopY, neckWidth, neckBottomY - neckTopY)
        const nd = neckImgData.data
        for (let i = 0; i < nd.length; i += 4) {
          if (nd[i+3] > 20) {
            // Fill with smooth cotton back collar tone
            nd[i] = 244
            nd[i+1] = 244
            nd[i+2] = 246
          }
        }
        ctx.putImageData(neckImgData, centerX - neckWidth/2, neckTopY)

        // Draw back collar ribbing arc
        ctx.beginPath()
        ctx.ellipse(centerX, neckTopY + 22, neckWidth * 0.44, 18, 0, 0, Math.PI)
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'
        ctx.lineWidth = 4
        ctx.stroke()

        resolve(c.toDataURL('image/png').split(',')[1])
      }
    })
  }, whiteBase64)

  const backOutPath = path.resolve('public/mockups/longsleeve-flatlay-back.png')
  fs.writeFileSync(backOutPath, Buffer.from(backPngBase64, 'base64'))
  console.log(`Saved ${backOutPath}`)

  await browser.close()
  console.log('Full Long-Sleeve palette generated successfully!')
}

run().catch(console.error)
