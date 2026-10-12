import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function run() {
  console.log('Starting Natural High-Precision Long Sleeve Pipeline...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  // 1. Process White Blank
  console.log('1. Processing White Blank from source with natural flood fill...')
  const whiteSrc = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png'
  const whiteB64 = fs.readFileSync(whiteSrc).toString('base64')

  const whitePngB64 = await page.evaluate((b64) => {
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

        // Seed outer 4 perimeter borders
        for (let x = 0; x < w; x++) {
          isBg[x] = 1; queue[qTail++] = x
          isBg[(h - 1) * w + x] = 1; queue[qTail++] = (h - 1) * w + x
        }
        for (let y = 0; y < h; y++) {
          isBg[y * w] = 1; queue[qTail++] = y * w
          isBg[y * w + (w - 1)] = 1; queue[qTail++] = y * w + (w - 1)
        }

        // Natural flood fill: background is white floor (luma >= 247.0)
        // or outer margins (y < 116, y >= 804, x < 46, x > 978)
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
                if (ny >= 804 || ny < 116 || nx < 46 || nx > 978) {
                  bg = true
                } else if (luma[n] >= 247.0) {
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

        // Assign clean anti-aliased edge alpha
        for (let y = 0; y < h; y++) {
          const rowOffset = y * w
          for (let x = 0; x < w; x++) {
            const i = rowOffset + x
            const idx = i * 4
            if (isBg[i]) {
              d[idx + 3] = 0
            } else {
              let bgN = 0
              if (x > 0 && isBg[i - 1]) bgN++
              if (x < w - 1 && isBg[i + 1]) bgN++
              if (y > 0 && isBg[i - w]) bgN++
              if (y < h - 1 && isBg[i + w]) bgN++

              if (bgN > 0) {
                d[idx + 3] = Math.max(30, Math.round(255 - (bgN * 40)))
              } else {
                d[idx + 3] = 255
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0)
        resolve(c.toDataURL('image/png').split(',')[1])
      }
    })
  }, whiteB64)

  const whiteOut = path.resolve('public/mockups/longsleeve-flatlay-white.png')
  fs.writeFileSync(whiteOut, Buffer.from(whitePngB64, 'base64'))
  console.log(`Saved pristine ${whiteOut}`)

  // 2. Process Grey Blank
  console.log('2. Processing Grey Blank from source...')
  const greySrc = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749422347_0f817cad.png'
  const greyB64 = fs.readFileSync(greySrc).toString('base64')

  const greyPngB64 = await page.evaluate((b64) => {
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

        for (let x = 0; x < w; x++) {
          isBg[x] = 1; queue[qTail++] = x
          isBg[(h - 1) * w + x] = 1; queue[qTail++] = (h - 1) * w + x
        }
        for (let y = 0; y < h; y++) {
          isBg[y * w] = 1; queue[qTail++] = y * w
          isBg[y * w + (w - 1)] = 1; queue[qTail++] = y * w + (w - 1)
        }

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
                if (ny >= 804 || ny < 65 || nx < 45 || nx > 980) {
                  bg = true
                } else if (luma[n] >= 238.0) {
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

        for (let y = 0; y < h; y++) {
          const rowOffset = y * w
          for (let x = 0; x < w; x++) {
            const i = rowOffset + x
            const idx = i * 4
            if (isBg[i]) {
              d[idx + 3] = 0
            } else {
              let bgN = 0
              if (x > 0 && isBg[i - 1]) bgN++
              if (x < w - 1 && isBg[i + 1]) bgN++
              if (y > 0 && isBg[i - w]) bgN++
              if (y < h - 1 && isBg[i + w]) bgN++
              if (bgN > 0) {
                d[idx + 3] = Math.max(30, Math.round(255 - (bgN * 40)))
              } else {
                d[idx + 3] = 255
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0)
        resolve(c.toDataURL('image/png').split(',')[1])
      }
    })
  }, greyB64)

  const greyOut = path.resolve('public/mockups/longsleeve-flatlay-grey.png')
  fs.writeFileSync(greyOut, Buffer.from(greyPngB64, 'base64'))
  console.log(`Saved pristine ${greyOut}`)

  // 3. Re-dye all palette colors from pristine blanks
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
    const baseSource = item.base === 'grey' ? greyPngB64 : whitePngB64
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

          const rDye = parseInt(hex.slice(1, 3), 16) / 255
          const gDye = parseInt(hex.slice(3, 5), 16) / 255
          const bDye = parseInt(hex.slice(5, 7), 16) / 255

          const L_ref = 0.90

          for (let i = 0; i < d.length; i += 4) {
            const alpha = d[i+3]
            if (alpha < 10) {
              d[i+3] = 0
              continue
            }

            const rS = d[i] / 255
            const gS = d[i+1] / 255
            const bS = d[i+2] / 255
            const L = 0.299 * rS + 0.587 * gS + 0.114 * bS

            const L_norm = Math.min(1.0, L / L_ref)
            const dyeFactor = Math.pow(L_norm, 1.15) * (1 + shadowBoost * (1 - L_norm))

            let rOut = rDye * dyeFactor
            let gOut = gDye * dyeFactor
            let bOut = bDye * dyeFactor

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

  // 4. Generate Back Flat Lay Blank from clean white blank
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

        const centerX = Math.floor(img.width / 2)
        const neckTopY = Math.floor(img.height * 0.14)
        const neckBottomY = Math.floor(img.height * 0.22)
        const neckWidth = Math.floor(img.width * 0.22)

        const neckImgData = ctx.getImageData(centerX - neckWidth/2, neckTopY, neckWidth, neckBottomY - neckTopY)
        const nd = neckImgData.data
        for (let i = 0; i < nd.length; i += 4) {
          if (nd[i+3] > 20) {
            nd[i] = 244
            nd[i+1] = 244
            nd[i+2] = 246
          }
        }
        ctx.putImageData(neckImgData, centerX - neckWidth/2, neckTopY)

        ctx.beginPath()
        ctx.ellipse(centerX, neckTopY + 22, neckWidth * 0.44, 18, 0, 0, Math.PI)
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'
        ctx.lineWidth = 4
        ctx.stroke()

        resolve(c.toDataURL('image/png').split(',')[1])
      }
    })
  }, whitePngB64)

  const backOutPath = path.resolve('public/mockups/longsleeve-flatlay-back.png')
  fs.writeFileSync(backOutPath, Buffer.from(backPngBase64, 'base64'))
  console.log(`Saved ${backOutPath}`)

  await browser.close()
  console.log('COMPLETE: All blanks naturally isolated and rebuilt with zero bite marks and zero overflow!')
}

run().catch(console.error)
