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

  const sources = [
    {
      id: 'white',
      srcPath: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png',
      outName: 'longsleeve-flatlay-white.png',
      mode: 'white'
    },
    {
      id: 'grey',
      srcPath: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749422347_0f817cad.png',
      outName: 'longsleeve-flatlay-grey.png',
      mode: 'grey'
    },
    {
      id: 'neon',
      srcPath: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png',
      outName: 'longsleeve-flatlay-neon.png',
      mode: 'neon'
    }
  ]

  for (const item of sources) {
    console.log(`Extracting pristine blank for ${item.id}...`)
    const base64 = fs.readFileSync(item.srcPath).toString('base64')

    const isolatedBase64 = await page.evaluate(async (dUrl, mode) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = 'data:image/png;base64,' + dUrl
        img.onload = () => {
          const w = img.width
          const h = img.height
          const total = w * h
          const c = document.createElement('canvas')
          c.width = w
          c.height = h
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
          let qHead = 0
          let qTail = 0

          function markBg(idx) {
            if (!isBg[idx]) {
              isBg[idx] = 1
              queue[qTail++] = idx
            }
          }

          // 1. Seed outer perimeter margins
          for (let x = 0; x < w; x++) {
            markBg(x)
            markBg((h - 1) * w + x)
            // Anything below bottom hem curve is background
            for (let y = 805; y < h; y++) markBg(y * w + x)
          }
          for (let y = 0; y < h; y++) {
            markBg(y * w)
            markBg(y * w + (w - 1))
            // Outer canvas margins beyond cuff extremities
            for (let x = 0; x < 45; x++) markBg(y * w + x)
            for (let x = 980; x < w; x++) markBg(y * w + x)
            // Empty floor below cuffs
            if (y >= 675) {
              for (let x = 0; x < 265; x++) markBg(y * w + x)
              for (let x = 765; x < w; x++) markBg(y * w + x)
            }
          }
          // Top margin above collar
          for (let y = 0; y < 116; y++) {
            for (let x = 0; x < w; x++) markBg(y * w + x)
          }

          // 2. Seed inner sleeve cavities between arms and torso
          for (let y = 430; y < 675; y++) {
            // Left sleeve gap: x in [170, 265]
            for (let x = 170; x < 265; x++) {
              if (luma[y * w + x] >= (mode === 'grey' ? 240.0 : 243.5)) {
                markBg(y * w + x)
              }
            }
            // Right sleeve gap: x in [765, 875]
            for (let x = 765; x < 875; x++) {
              if (luma[y * w + x] >= (mode === 'grey' ? 240.0 : 243.5)) {
                markBg(y * w + x)
              }
            }
          }

          // 3. Flood fill with boundary stopping conditions
          while (qHead < qTail) {
            const curr = queue[qHead++]
            const cx = curr % w
            const cy = Math.floor(curr / w)

            const nbs = [curr - 1, curr + 1, curr - w, curr + w]
            for (const n of nbs) {
              if (n >= 0 && n < total && !isBg[n]) {
                const nx = n % w, ny = Math.floor(n / w)
                if (Math.abs(nx - cx) <= 1 && Math.abs(ny - cy) <= 1) {
                  let bgFound = false

                  if (mode === 'neon') {
                    // Safety Green / Neon has high green and blue < 150
                    if (d[n * 4 + 2] >= 200 || luma[n] >= 242.0) bgFound = true
                  } else if (mode === 'grey') {
                    if (luma[n] >= 238.0) bgFound = true
                  } else {
                    // White flatlay blank
                    if (ny < 116 || ny >= 805 || nx < 45 || nx > 980) {
                      bgFound = true
                    } else if (ny >= 675 && (nx < 265 || nx > 765)) {
                      bgFound = true
                    } else if (luma[n] >= 249.5) {
                      bgFound = true
                    } else if (luma[n] >= 245.5 && (
                      (nx >= 165 && nx <= 265 && ny >= 430 && ny <= 675) ||
                      (nx >= 765 && nx <= 880 && ny >= 430 && ny <= 675) ||
                      (ny >= 795 && ny <= 805)
                    )) {
                      bgFound = true
                    }
                  }

                  if (bgFound) {
                    isBg[n] = 1
                    queue[qTail++] = n
                  }
                }
              }
            }
          }

          // 4. Sub-pixel anti-aliased edge assignment with zero halo bleed
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const i = y * w + x
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
    }, `data:image/png;base64,${base64}`, item.mode)

    const outPath = path.resolve('public/mockups', item.outName)
    fs.writeFileSync(outPath, Buffer.from(isolatedBase64, 'base64'))
    console.log(`Saved pristine blank: ${outPath}`)
  }

  await browser.close()
  console.log('All 3 base blanks extracted cleanly with zero halos and transparent sleeve cavities!')
}

run().catch(console.error)
