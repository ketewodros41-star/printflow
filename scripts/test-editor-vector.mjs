import puppeteer from 'puppeteer'
import path from 'path'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1024, height: 873, deviceScaleFactor: 2 })

  const svgContent = `
  <svg viewBox="0 0 1024 873" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 1024px; height: 873px; background: #F5F5F0;">
    <defs>
      <!-- Knitted Heather Grain Filter for Sport Grey / Ash / Dark Heather -->
      <filter id="ls-heather" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.92 0.52" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.20 0" result="heatherNoise" />
        <feBlend mode="multiply" in="SourceGraphic" in2="heatherNoise" result="blend" />
        <feComposite in="blend" in2="SourceAlpha" operator="in" />
      </filter>
    </defs>

    <!-- Floor Drop Shadow (Soft Contact) -->
    <path
      d="M 242 165 L 105 320 C 65 375, 45 440, 20 480 C 15 540, 30 630, 48 680 L 58 730 L 126 730 L 140 680 C 170 590, 205 500, 240 435 L 240 805 L 740 805 L 740 435 C 775 500, 810 590, 840 680 L 854 730 L 922 730 L 932 680 C 950 630, 965 540, 960 480 C 935 440, 915 375, 875 320 L 738 165 L 565 95 L 415 95 Z"
      fill="#000000" opacity="0.04" transform="translate(0, 16)" filter="blur(8px)"
    />

    <!-- Garment Body Silhouette Fill (Sport Grey Heather) -->
    <g id="ls-garment-fill" filter="url(#ls-heather)">
      <!-- Torso Base -->
      <path
        d="M 415 95 C 455 85, 525 85, 565 95 L 738 165 L 740 435 L 740 805 L 240 805 L 240 435 L 242 165 Z"
        fill="#C8C5C0"
      />
      <!-- Left Sleeve (Relaxed Curved Flare) -->
      <path
        d="M 242 165 C 195 215, 120 305, 78 355 C 40 405, 18 475, 16 525 C 14 585, 24 645, 48 680 L 58 730 L 126 730 L 140 680 C 160 625, 185 530, 218 475 C 235 450, 240 435, 240 435 Z"
        fill="#C8C5C0"
      />
      <!-- Right Sleeve (Relaxed Curved Flare) -->
      <path
        d="M 738 165 C 785 215, 860 305, 902 355 C 940 405, 962 475, 964 525 C 966 585, 956 645, 932 680 L 922 730 L 854 730 L 840 680 C 820 625, 795 530, 762 475 C 745 450, 740 435, 740 435 Z"
        fill="#C8C5C0"
      />
    </g>

    <!-- Inner Neck Cavity (Back Neck Crescent) -->
    <path
      d="M 415 95 C 435 140, 545 140, 565 95 C 530 85, 450 85, 415 95 Z"
      fill="#A4A19A" stroke="#1A1A12" stroke-width="3" stroke-linejoin="round"
    />

    <!-- Characteristic Creases and Apparel Shading Folds (Matching Image 1) -->
    <g stroke="#1A1A12" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
      <!-- Left Sleeve Arm Folds -->
      <path d="M 112 360 C 145 385, 192 418, 218 435" />
      <path d="M 42 505 C 75 518, 128 532, 160 520" />
      <path d="M 45 565 C 80 585, 125 588, 155 572" />
      <path d="M 240 435 C 248 455, 258 480, 262 500" stroke-width="2.2" opacity="0.7" />

      <!-- Right Sleeve Arm Folds -->
      <path d="M 868 360 C 835 385, 788 418, 762 435" />
      <path d="M 938 505 C 905 518, 852 532, 820 520" />
      <path d="M 935 565 C 900 585, 855 588, 825 572" />
      <path d="M 740 435 C 732 455, 722 480, 718 500" stroke-width="2.2" opacity="0.7" />
    </g>

    <!-- Technical Silhouette Outlines (Stroke #1A1A12, 3.2px - 3.5px) -->
    <g stroke="#1A1A12" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
      <!-- Left Sleeve Outer Line -->
      <path d="M 242 165 C 195 215, 120 305, 78 355 C 40 405, 18 475, 16 525 C 14 585, 24 645, 48 680" />
      <!-- Left Wrist Ribbed Cuff -->
      <path d="M 48 680 L 58 730 L 126 730 L 140 680" />
      <path d="M 48 680 L 140 680" stroke-width="2.6" />
      <!-- Left Sleeve Inner Line -->
      <path d="M 140 680 C 160 625, 185 530, 218 475 C 235 450, 240 435, 240 435" />

      <!-- Left Shoulder Seam -->
      <path d="M 242 165 C 255 240, 258 340, 240 435" stroke-width="2.8" />
      <!-- Left Shoulder Line -->
      <path d="M 415 95 L 242 165" />

      <!-- Left Torso Side -->
      <path d="M 240 435 L 240 805" />

      <!-- Bottom Waist Hem Line & Double-Needle Stitch -->
      <path d="M 240 805 L 740 805" />
      <path d="M 240 793 L 740 793" stroke-width="1.8" stroke-dasharray="6 4" stroke-opacity="0.5" />

      <!-- Right Torso Side -->
      <path d="M 740 435 L 740 805" />

      <!-- Right Shoulder Seam -->
      <path d="M 738 165 C 725 240, 722 340, 740 435" stroke-width="2.8" />
      <!-- Right Shoulder Line -->
      <path d="M 565 95 L 738 165" />

      <!-- Right Sleeve Outer Line -->
      <path d="M 738 165 C 785 215, 860 305, 902 355 C 940 405, 962 475, 964 525 C 966 585, 956 645, 932 680" />
      <!-- Right Wrist Ribbed Cuff -->
      <path d="M 932 680 L 922 730 L 854 730 L 840 680" />
      <path d="M 932 680 L 840 680" stroke-width="2.6" />
      <!-- Right Sleeve Inner Line -->
      <path d="M 840 680 C 820 625, 795 530, 762 475 C 745 450, 740 435, 740 435" />

      <!-- Crewneck Ribbed Collar Front Band -->
      <path d="M 415 95 C 420 160, 560 160, 565 95" stroke-width="3.4" fill="#D5D2CB" />
      <path d="M 405 95 C 410 180, 570 180, 575 95" stroke-width="2.6" />
    </g>

    <!-- Calibrated 12" x 16" Printable Area Bounds (Matching Image 1) -->
    <rect
      x="318"
      y="245"
      width="344"
      height="455"
      stroke="#1A1A12"
      stroke-width="2.6"
      stroke-dasharray="8 6"
      fill="none"
      opacity="0.95"
    />
  </svg>
  `

  await page.setContent(svgContent)
  const outPath = path.resolve('public/mockup-tests/test-editor-vector-exact.png')
  await page.screenshot({ path: outPath })
  console.log(`Saved screenshot to: ${outPath}`)
  await browser.close()
}

run().catch(console.error)
