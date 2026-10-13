import puppeteer from 'puppeteer'

async function testExport() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/create/hoodie-gildan', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1000))

  // Switch to Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const prevBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Preview')
    if (prevBtn) prevBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  const exportResult = await page.evaluate(async () => {
    const svgEl = document.querySelector('svg[viewBox="0 0 1024 1024"]')
    if (!svgEl) return { error: 'No svg' }

    // Test 1: Exactly what page.tsx does (converting / to window.location.origin + href)
    const clonedSvg1 = svgEl.cloneNode(true)
    const imgElements1 = clonedSvg1.querySelectorAll('image')
    imgElements1.forEach((img) => {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href')
      if (href && href.startsWith('/')) {
        img.setAttribute('href', `${window.location.origin}${href}`)
      }
    })

    const svgStr1 = new XMLSerializer().serializeToString(clonedSvg1)
    const blob1 = new Blob([svgStr1], { type: 'image/svg+xml;charset=utf-8' })
    const url1 = URL.createObjectURL(blob1)

    const img1 = new Image()
    await new Promise((resolve) => {
      img1.onload = () => resolve()
      img1.onerror = () => resolve()
      img1.src = url1
    })

    const c1 = document.createElement('canvas')
    c1.width = 1024
    c1.height = 1024
    const ctx1 = c1.getContext('2d')
    ctx1.drawImage(img1, 0, 0, 1024, 1024)
    const data1 = ctx1.getImageData(0, 0, 1024, 1024).data
    let pixels1 = 0
    for (let i = 0; i < data1.length; i += 4) {
      if (data1[i + 3] > 10) pixels1++
    }

    // Test 2: Inlining images as Base64 data URLs
    const clonedSvg2 = svgEl.cloneNode(true)
    const imgElements2 = clonedSvg2.querySelectorAll('image')
    for (const img of Array.from(imgElements2)) {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href')
      if (href && href.startsWith('/')) {
        const resp = await fetch(href)
        const blob = await resp.blob()
        const dataUrl = await new Promise((res) => {
          const reader = new FileReader()
          reader.onloadend = () => res(reader.result)
          reader.readAsDataURL(blob)
        })
        img.setAttribute('href', dataUrl)
      }
    }

    const svgStr2 = new XMLSerializer().serializeToString(clonedSvg2)
    const blob2 = new Blob([svgStr2], { type: 'image/svg+xml;charset=utf-8' })
    const url2 = URL.createObjectURL(blob2)

    const img2 = new Image()
    await new Promise((resolve) => {
      img2.onload = () => resolve()
      img2.onerror = () => resolve()
      img2.src = url2
    })

    const c2 = document.createElement('canvas')
    c2.width = 1024
    c2.height = 1024
    const ctx2 = c2.getContext('2d')
    ctx2.drawImage(img2, 0, 0, 1024, 1024)
    const data2 = ctx2.getImageData(0, 0, 1024, 1024).data
    let pixels2 = 0
    for (let i = 0; i < data2.length; i += 4) {
      if (data2[i + 3] > 10) pixels2++
    }

    return {
      test1_absolute_url_pixels: pixels1,
      test2_base64_inlined_pixels: pixels2,
    }
  })

  console.log('Comparison Result:', exportResult)
  await browser.close()
}

testExport()
