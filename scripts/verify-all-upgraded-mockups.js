const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PRODUCTS = [
  { id: 'tank-muscle', name: 'Muscle Tank Top' },
  { id: 'hoodie-zip', name: 'Heavyweight Full-Zip Hoodie' },
  { id: 'hoodie-premium', name: 'Premium Pullover Hoodie' },
  { id: 'sweatshirt-crew', name: 'Crewneck Sweatshirt' },
  { id: 'mug-classic', name: 'Ceramic Mug Classic' },
  { id: 'tote-standard', name: 'Canvas Tote Standard' },
];

(async () => {
  const outDir = path.join(__dirname, '..', 'public', 'test-verifications');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 960 }
  });

  const results = [];

  for (const prod of PRODUCTS) {
    console.log(`\n================ Testing ${prod.name} (${prod.id}) ================`);
    const page = await browser.newPage();

    const merchantUser = { id: 'm1', email: 'test@printflow.et', role: 'merchant' };
    await page.evaluateOnNewDocument((user) => {
      localStorage.setItem('pf_user_v1', JSON.stringify(user));
      document.cookie = 'pf_session=' + encodeURIComponent(JSON.stringify(user)) + '; path=/';
    }, merchantUser);

    await page.goto(`http://localhost:3000/create/${prod.id}`, { waitUntil: 'networkidle2' });

    // Add a test text layer if needed to ensure artwork group and shaders are active
    await page.evaluate(() => {
      const textBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Text'));
      if (textBtn) textBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const addTextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add Text Layer'));
      if (addTextBtn) addTextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click Preview button
    const previewClicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Preview');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!previewClicked) {
      console.error(`Preview button not found for ${prod.id}!`);
      results.push({ id: prod.id, success: false, error: 'Preview button not found' });
      await page.close();
      continue;
    }

    await page.waitForSelector('svg[viewBox="0 0 1024 1024"] image', { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1200));

    // Inspect SVG image hrefs and rendering details
    const inspection = await page.evaluate(() => {
      const svgImages = Array.from(document.querySelectorAll('svg image')).map(img => ({
        href: img.getAttribute('href'),
        width: img.getAttribute('width'),
        height: img.getAttribute('height'),
        filter: img.getAttribute('filter'),
        transform: img.getAttribute('transform')
      }));

      const hasArtworkGroup = !!document.getElementById('artwork-projection-group');
      const hasCartoonZipper = !!document.getElementById('metallic-zipper');
      const defs = Array.from(document.querySelectorAll('svg defs *')).map(el => el.tagName + '#' + el.id);

      return {
        svgImages,
        hasArtworkGroup,
        hasCartoonZipper,
        defsCount: defs.length
      };
    });

    console.log(`Inspection for ${prod.id}:`, JSON.stringify(inspection, null, 2));

    const shotPath = path.join(outDir, `${prod.id}-preview.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Screenshot saved to ${shotPath}`);

    // Test secondary scenes (Back or Handle Left)
    let secondaryInspection = null;
    let secondarySceneLabel = '';

    if (prod.id.includes('tank') || prod.id.includes('hoodie') || prod.id.includes('sweatshirt')) {
      secondarySceneLabel = 'back';
      const clickedBack = await page.evaluate(() => {
        const scenes = Array.from(document.querySelectorAll('button')).filter(b => {
          const t = b.textContent ? b.textContent.toLowerCase() : '';
          return t.includes('back');
        });
        if (scenes.length > 0) {
          scenes[0].click();
          return true;
        }
        return false;
      });

      if (clickedBack) {
        await new Promise(r => setTimeout(r, 800));
        secondaryInspection = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('svg image')).map(img => ({
            href: img.getAttribute('href'),
            width: img.getAttribute('width'),
            height: img.getAttribute('height')
          }));
        });
        const backShotPath = path.join(outDir, `${prod.id}-preview-back.png`);
        await page.screenshot({ path: backShotPath });
        console.log(`Back view screenshot saved to ${backShotPath}. Assets:`, secondaryInspection);
      }
    } else if (prod.id.includes('mug')) {
      secondarySceneLabel = 'handle-left';
      const clickedHandleLeft = await page.evaluate(() => {
        const scenes = Array.from(document.querySelectorAll('button')).filter(b => {
          const t = b.textContent ? b.textContent.toLowerCase() : '';
          return t.includes('handle left');
        });
        if (scenes.length > 0) {
          scenes[0].click();
          return true;
        }
        return false;
      });

      if (clickedHandleLeft) {
        await new Promise(r => setTimeout(r, 800));
        secondaryInspection = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('svg image')).map(img => ({
            href: img.getAttribute('href'),
            transform: img.getAttribute('transform')
          }));
        });
        const leftShotPath = path.join(outDir, `${prod.id}-preview-handle-left.png`);
        await page.screenshot({ path: leftShotPath });
        console.log(`Handle Left screenshot saved to ${leftShotPath}. Assets:`, secondaryInspection);
      }
    }

    results.push({
      id: prod.id,
      name: prod.name,
      success: inspection.svgImages.length > 0 && inspection.svgImages.some(img => img.href && img.href.startsWith('/mockups/')),
      inspection,
      secondarySceneLabel,
      secondaryInspection
    });

    await page.close();
  }

  await browser.close();

  console.log('\n================ FINAL VERIFICATION SUMMARY ================');
  console.log(JSON.stringify(results, null, 2));
})();
