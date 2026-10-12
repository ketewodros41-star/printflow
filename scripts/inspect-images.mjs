import fs from 'fs'
import puppeteer from 'puppeteer'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  const files = [
    { name: 'editor_white', path: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749150895_1a9f3ef0.png' },
    { name: 'editor_grey', path: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749182633_ecbde48b.png' },
    { name: 'preview_white', path: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png' },
    { name: 'preview_grey', path: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749422347_0f817cad.png' },
    { name: 'preview_neon', path: 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png' },
  ]

  for (const item of files) {
    const dataUrl = 'data:image/png;base64,' + fs.readFileSync(item.path).toString('base64')
    const stats = await page.evaluate((dUrl) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = dUrl
        img.onload = () => {
          const c = document.createElement('canvas')
          c.width = img.width
          c.height = img.height
          const ctx = c.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const corner = ctx.getImageData(0, 0, 1, 1).data
          const center = ctx.getImageData(Math.floor(img.width / 2), Math.floor(img.height / 2), 1, 1).data
          resolve({
            width: img.width,
            height: img.height,
            corner: [corner[0], corner[1], corner[2], corner[3]],
            center: [center[0], center[1], center[2], center[3]]
          })
        }
      })
    }, dataUrl)
    console.log(item.name, stats)
  }

  await browser.close()
}

run().catch(console.error)
