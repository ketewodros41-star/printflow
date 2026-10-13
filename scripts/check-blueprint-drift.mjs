import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const products = ['mug-classic', 'tote-standard', 'tshirt-longsleeve', 'tshirt-classic', 'hoodie-gildan', 'hoodie-zip'];

  for (const pid of products) {
    await page.goto(`http://localhost:3000/create/${pid}`, { waitUntil: 'networkidle0' });
    const data = await page.evaluate(() => {
      const cutLineEl = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Cut Line'));
      const printBoxEl = cutLineEl ? cutLineEl.parentElement : null;
      const stage = printBoxEl ? printBoxEl.parentElement : null;
      if (!stage || !printBoxEl) return { error: 'Could not find stage or printBox' };

      const stageRect = stage.getBoundingClientRect();
      const pbRect = printBoxEl.getBoundingClientRect();
      const svg = stage.querySelector('svg');
      const svgRect = svg ? svg.getBoundingClientRect() : null;
      const viewBox = svg ? svg.getAttribute('viewBox') : null;

      // Also get the bounding box of the main body element in SVG
      const mainPath = svg ? (svg.querySelector('#mug-cylinder path') || svg.querySelector('path[d*="520"]') || svg.querySelector('path[d*="415"]') || svg.querySelector('#hoodie-body') || svg.querySelector('path')) : null;
      const pathRect = mainPath ? mainPath.getBoundingClientRect() : null;

      return {
        stage: { w: Math.round(stageRect.width), h: Math.round(stageRect.height) },
        printBox: {
          left: Math.round(pbRect.left - stageRect.left),
          top: Math.round(pbRect.top - stageRect.top),
          w: Math.round(pbRect.width),
          h: Math.round(pbRect.height)
        },
        svg: {
          viewBox,
          renderedW: Math.round(svgRect.width),
          renderedH: Math.round(svgRect.height),
          leftOffset: Math.round(svgRect.left - stageRect.left),
          topOffset: Math.round(svgRect.top - stageRect.top)
        },
        pathRelToStage: pathRect ? {
          top: Math.round(pathRect.top - stageRect.top),
          left: Math.round(pathRect.left - stageRect.left),
          w: Math.round(pathRect.width),
          h: Math.round(pathRect.height)
        } : null
      };
    });
    console.log(`\n=== ${pid} ===`);
    console.log(JSON.stringify(data, null, 2));
  }
  await browser.close();
})();
