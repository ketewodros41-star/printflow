import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function build() {
  console.log('Building Ultra-Smooth Photorealistic Long Sleeve Blanks...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()

  const whiteSrc = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png'
  const greySrc = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749422347_0f817cad.png'
  const neonSrc = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png'

  const whiteB64 = fs.readFileSync(whiteSrc).toString('base64')
  const greyB64 = fs.readFileSync(greySrc).toString('base64')
  const neonB64 = fs.readFileSync(neonSrc).toString('base64')

  // Helper function to extract smooth transparent blank
  const isolateBlank = async (b64, lumaThreshold) => {
    return page.evaluate((b64, lumaThreshold) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = 'data:image/png;base64,' + b64
        img.onload = () => {
          const w = img.width, h = img.height
          const total = w * h
          const c = document.createElement('canvas')
          c.width = w; c.height = h
          const ctx = c.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, w, h)
          const d = imgData.data

          const luma = new Float32Array(total)
          for (let i = 0; i < total; i++) {
            const idx = i * 4
            luma[i] = 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2]
          }

          const isBg = new Uint8Array(total)
          const queue = new Int32Array(total)
          let qHead = 0, qTail = 0

          // Seed 4 outer borders of canvas
          for (let x = 0; x < w; x++) {
            isBg[x] = 1; queue[qTail++] = x
            isBg[(h - 1) * w + x] = 1; queue[qTail++] = (h - 1) * w + x
          }
          for (let y = 0; y < h; y++) {
            isBg[y * w] = 1; queue[qTail++] = y * w
            isBg[y * w + (w - 1)] = 1; queue[qTail++] = y * w + (w - 1)
          }

          // Natural Flood Fill with exact threshold to prevent tooth/notching
          while (qHead < qTail) {
            const curr = queue[qHead++]
            const cx = curr % w
            const cy = Math.floor(curr / w)

            const nbs = [curr - 1, curr + 1, curr - w, curr + w]
            for (const n of nbs) {
              if (n >= 0 && n < total && !isBg[n]) {
                const nx = n % w, ny = Math.floor(n / w)
                if (Math.abs(nx - cx) <= 1 && Math.abs(ny - cy) <= 1) {
                  let bg = false
                  if (ny > 815 || ny < 100 || nx < 38 || nx > 986) {
                    bg = true
                  } else if (luma[n] >= lumaThreshold) {
                    bg = true
                  }

                  if (bg) {
                    isBg[n] = 1
                    queue[qTail++] = n
                  }
                }
              }
            }
          }

          // 3x3 Gaussian-weighted smoothing for anti-aliasing
          const smoothAlpha = new Float32Array(total)
          const weights = [1, 2, 1, 2, 4, 2, 1, 2, 1]
          const weightSum = 16

          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = y * w + x
              let bgSum = 0
              let k = 0
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const nIdx = (y + dy) * w + (x + dx)
                  bgSum += isBg[nIdx] * weights[k++]
                }
              }
              const bgFraction = bgSum / weightSum
              smoothAlpha[idx] = Math.max(0, Math.min(1, 1 - bgFraction))
            }
          }

          for (let i = 0; i < total; i++) {
            const idx = i * 4
            d[idx + 3] = Math.round(smoothAlpha[i] * 255)
          }

          ctx.putImageData(imgData, 0, 0)
          resolve(c.toDataURL('image/png').split(',')[1])
        }
      })
    }, b64, lumaThreshold)
  }

  // Step 1: White blank
  console.log('1. Isolating White Blank...')
  const whitePngB64 = await isolateBlank(whiteB64, 248.5)
  fs.writeFileSync('public/mockups/longsleeve-flatlay-white.png', Buffer.from(whitePngB64, 'base64'))
  console.log('Saved public/mockups/longsleeve-flatlay-white.png')

  // Step 2: Grey blank
  console.log('2. Isolating Grey Blank...')
  const greyPngB64 = await isolateBlank(greyB64, 245.0)
  fs.writeFileSync('public/mockups/longsleeve-flatlay-grey.png', Buffer.from(greyPngB64, 'base64'))
  console.log('Saved public/mockups/longsleeve-flatlay-grey.png')

  // Step 3: Neon blank
  console.log('3. Isolating Neon Blank...')
  const neonPngB64 = await isolateBlank(neonB64, 245.0)
  fs.writeFileSync('public/mockups/longsleeve-flatlay-neon.png', Buffer.from(neonPngB64, 'base64'))
  console.log('Saved public/mockups/longsleeve-flatlay-neon.png')

  // Step 4: Re-dye all remaining 12 palette colors
  const PALETTE = [
    { name: 'longsleeve-flatlay-black.png', hex: '#1C1C1E', base: 'white', specular: 0.035, gammaAdj: 0.95 },
    { name: 'longsleeve-flatlay-navy.png', hex: '#1B2A4A', base: 'white', specular: 0.030, gammaAdj: 0.98 },
    { name: 'longsleeve-flatlay-red.png', hex: '#C62828', base: 'white', specular: 0.020, gammaAdj: 1.00 },
    { name: 'longsleeve-flatlay-forest-green.png', hex: '#1B4332', base: 'white', specular: 0.025, gammaAdj: 0.98 },
    { name: 'longsleeve-flatlay-maroon.png', hex: '#5C1D24', base: 'white', specular: 0.025, gammaAdj: 0.98 },
    { name: 'longsleeve-flatlay-royal.png', hex: '#1D4ED8', base: 'white', specular: 0.022, gammaAdj: 1.00 },
    { name: 'longsleeve-flatlay-sand.png', hex: '#D4C5B3', base: 'white', specular: 0.015, gammaAdj: 1.00 },
    { name: 'longsleeve-flatlay-military-green.png', hex: '#4B5320', base: 'white', specular: 0.025, gammaAdj: 0.98 },
    { name: 'longsleeve-flatlay-orange.png', hex: '#EA580C', base: 'white', specular: 0.020, gammaAdj: 1.00 },
    { name: 'longsleeve-flatlay-carolina-blue.png', hex: '#7BAED1', base: 'white', specular: 0.018, gammaAdj: 1.00 },
    { name: 'longsleeve-flatlay-dark-heather.png', hex: '#4A4A48', base: 'grey', specular: 0.025, gammaAdj: 0.96 },
    { name: 'longsleeve-flatlay-ash.png', hex: '#DEDEDB', base: 'grey', specular: 0.010, gammaAdj: 1.00 },
  ]

  for (const item of PALETTE) {
    console.log(`Dyeing ${item.name} (${item.hex})...`)
    const baseSource = item.base === 'grey' ? greyPngB64 : whitePngB64
    const dyedPngBase64 = await page.evaluate((b64, hex, specular, gammaAdj) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        img.onload = () => {
          const w = img.width, h = img.height
          const c = document.createElement('canvas')
          c.width = w; c.height = h
          const ctx = c.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, w, h)
          const d = imgData.data

          const rT = parseInt(hex.slice(1, 3), 16) / 255
          const gT = parseInt(hex.slice(3, 5), 16) / 255
          const bT = parseInt(hex.slice(5, 7), 16) / 255

          const rTL = Math.pow(rT, 2.2)
          const gTL = Math.pow(gT, 2.2)
          const bTL = Math.pow(bT, 2.2)

          const maxWhiteLinear = Math.pow(0.96, 2.2)

          for (let i = 0; i < d.length; i += 4) {
            const alpha = d[i + 3]
            if (alpha < 5) {
              d[i + 3] = 0
              continue
            }

            const rS = d[i] / 255
            const gS = d[i + 1] / 255
            const bS = d[i + 2] / 255
            const rSL = Math.pow(rS, 2.2)
            const gSL = Math.pow(gS, 2.2)
            const bSL = Math.pow(bS, 2.2)

            let sL = (0.299 * rSL + 0.587 * gSL + 0.114 * bSL) / maxWhiteLinear
            sL = Math.pow(Math.min(1.08, Math.max(0.01, sL)), gammaAdj || 1.0)

            let rOutL = rTL * sL
            let gOutL = gTL * sL
            let bOutL = bTL * sL

            if (specular > 0) {
              const specFactor = Math.pow(Math.max(0, sL - 0.65) / 0.35, 2.0) * specular
              rOutL += specFactor
              gOutL += specFactor
              bOutL += specFactor
            }

            d[i]     = Math.min(255, Math.max(0, Math.round(Math.pow(rOutL, 1.0 / 2.2) * 255)))
            d[i + 1] = Math.min(255, Math.max(0, Math.round(Math.pow(gOutL, 1.0 / 2.2) * 255)))
            d[i + 2] = Math.min(255, Math.max(0, Math.round(Math.pow(bOutL, 1.0 / 2.2) * 255)))
          }

          ctx.putImageData(imgData, 0, 0)
          resolve(c.toDataURL('image/png').split(',')[1])
        }
      })
    }, baseSource, item.hex, item.specular, item.gammaAdj)

    const outPath = path.resolve('public/mockups', item.name)
    fs.writeFileSync(outPath, Buffer.from(dyedPngBase64, 'base64'))
    console.log(`Saved ${outPath}`)
  }

  // Step 5: Back Blank from clean white blank
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
        const imgData = ctx.getImageData(0, 0, c.width, c.height)
        const d = imgData.data

        for (let y = 120; y < 172; y++) {
          for (let x = 445; x < 580; x++) {
            const idx = (y * c.width + x) * 4
            const dx = (x - 512) / 65
            const dy = (y - 138) / 30
            if (dx * dx + dy * dy < 1.0) {
              const sampleIdx = (128 * c.width + x) * 4
              d[idx] = d[sampleIdx]
              d[idx+1] = d[sampleIdx+1]
              d[idx+2] = d[sampleIdx+2]
              d[idx+3] = 255
            }
          }
        }
        ctx.putImageData(imgData, 0, 0)
        resolve(c.toDataURL('image/png').split(',')[1])
      }
    })
  }, whitePngB64)

  fs.writeFileSync('public/mockups/longsleeve-flatlay-back.png', Buffer.from(backPngBase64, 'base64'))
  console.log('Saved public/mockups/longsleeve-flatlay-back.png')

  await browser.close()
  console.log('All 15 blanks rebuilt successfully with silky-smooth alpha matting!')
}

build().catch(console.error)
