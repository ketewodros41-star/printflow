import puppeteer from 'puppeteer'
import fs from 'fs'

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 600 })
  const html = `
    <!DOCTYPE html>
    <html><body style="margin:0;background:#E2E8F0;display:flex;gap:20px;padding:20px;">
      <div style="background:#FFF;padding:10px;">
        <h3>Original White Source Cuff (Left & Right)</h3>
        <div style="display:flex;gap:10px;">
          <div style="width:200px;height:220px;overflow:hidden;border:1px solid #ccc;position:relative;">
            <img src="http://localhost:3000/mockups/longsleeve-flatlay-white.png" style="position:absolute;left:-40px;top:-550px;width:1024px;" />
          </div>
          <div style="width:200px;height:220px;overflow:hidden;border:1px solid #ccc;position:relative;">
            <img src="http://localhost:3000/mockups/longsleeve-flatlay-white.png" style="position:absolute;left:-820px;top:-550px;width:1024px;" />
          </div>
        </div>
      </div>
      <div style="background:#FFF;padding:10px;">
        <h3>In-App Preview with Current ClipPath</h3>
        <div style="display:flex;gap:10px;">
          <div style="width:200px;height:220px;overflow:hidden;border:1px solid #ccc;position:relative;">
            <svg viewBox="0 0 1024 953" style="position:absolute;left:-40px;top:-550px;width:1024px;">
              <clipPath id="test-clip">
                <path d="M 512 126 C 540 126, 580 132, 606 138 L 764 180 C 830 240, 895 320, 940 450 C 965 525, 978 600, 974 650 L 946 674 L 918 668 C 885 590, 830 500, 756 440 L 758 796 C 680 803, 580 805, 512 804 C 440 805, 340 803, 268 796 L 268 440 C 194 500, 139 590, 106 668 L 78 674 L 50 650 C 46 600, 59 525, 84 450 C 129 320, 194 240, 260 180 L 418 138 C 444 132, 484 126, 512 126 Z" />
              </clipPath>
              <image href="http://localhost:3000/mockups/longsleeve-flatlay-white.png" width="1024" height="953" clip-path="url(#test-clip)" />
            </svg>
          </div>
          <div style="width:200px;height:220px;overflow:hidden;border:1px solid #ccc;position:relative;">
            <svg viewBox="0 0 1024 953" style="position:absolute;left:-820px;top:-550px;width:1024px;">
              <clipPath id="test-clip2">
                <path d="M 512 126 C 540 126, 580 132, 606 138 L 764 180 C 830 240, 895 320, 940 450 C 965 525, 978 600, 974 650 L 946 674 L 918 668 C 885 590, 830 500, 756 440 L 758 796 C 680 803, 580 805, 512 804 C 440 805, 340 803, 268 796 L 268 440 C 194 500, 139 590, 106 668 L 78 674 L 50 650 C 46 600, 59 525, 84 450 C 129 320, 194 240, 260 180 L 418 138 C 444 132, 484 126, 512 126 Z" />
              </clipPath>
              <image href="http://localhost:3000/mockups/longsleeve-flatlay-white.png" width="1024" height="953" clip-path="url(#test-clip2)" />
            </svg>
          </div>
        </div>
      </div>
    </body></html>
  `
  await page.setContent(html, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: 'scripts/screenshots/cuff-comparison.png' })
  console.log('Saved cuff comparison');
  await browser.close()
}

main().catch(console.error)
