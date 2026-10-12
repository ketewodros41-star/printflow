const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const pages = [
    ['/', 'screenshot-home.png'],
    ['/catalog', 'screenshot-catalog.png'],
    ['/catalog/1', 'screenshot-product.png'],
    ['/pricing', 'screenshot-pricing.png'],
    ['/login', 'screenshot-login.png'],
    ['/dashboard', 'screenshot-dashboard.png'],
    ['/dashboard/orders', 'screenshot-orders.png'],
    ['/store/addis-style-hub/checkout', 'screenshot-checkout.png'],
    ['/admin', 'screenshot-admin.png'],
    ['/create/1', 'screenshot-creator.png'],
  ];

  for (const [path, filename] of pages) {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: filename, fullPage: false });
    console.log(`✓ ${filename}`);
  }

  await browser.close();
  console.log('Done');
})();
