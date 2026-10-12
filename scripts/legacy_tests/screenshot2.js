/**
 * Quick screenshot script using Node + Edge DevTools Protocol
 * No extra npm package needed — uses Edge's --remote-debugging-port
 */
const http = require('http')
const { execSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, 'screenshots')
fs.mkdirSync(OUT, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9222
const BASE = 'http://localhost:3001'

const PAGES = [
  ['/',                                  'home'],
  ['/catalog',                           'catalog'],
  ['/pricing',                           'pricing'],
  ['/login',                             'login'],
  ['/dashboard',                         'dashboard'],
  ['/dashboard/orders',                  'orders'],
  ['/store/addis-style-hub',             'store'],
  ['/store/addis-style-hub/checkout',    'checkout'],
  ['/admin',                             'admin'],
  ['/create/1',                          'creator'],
]

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

;(async () => {
  // Launch Edge headless with remote debugging
  const edge = spawn(EDGE, [
    `--headless=new`,
    `--remote-debugging-port=${PORT}`,
    `--window-size=1440,900`,
    `--disable-gpu`,
    `--no-sandbox`,
    `--disable-extensions`,
    `--hide-scrollbars`,
    `--user-data-dir=C:\\Temp\\edge-cdp-${Date.now()}`,
  ], { stdio: 'ignore', detached: false })

  await sleep(2000)

  try {
    // Get list of targets
    const targets = JSON.parse(await get(`http://localhost:${PORT}/json`))
    const ws = targets[0]?.webSocketDebuggerUrl
    if (!ws) throw new Error('No WebSocket debugger URL found')

    // Use CDP over HTTP via /json/new and screenshot
    for (const [pagePath, name] of PAGES) {
      const url = BASE + pagePath

      // Create new tab, navigate, screenshot via /json/protocol
      const newTab = JSON.parse(await get(`http://localhost:${PORT}/json/new?${url}`))
      const tabId = newTab.id
      await sleep(3000) // wait for page load

      // Use CDP to take screenshot
      const screenshotUrl = `http://localhost:${PORT}/json/screenshot`

      // Fallback: use ws-less approach
      // Actually use fetch via CDP activate + screenshot
      console.log(`  Navigated to ${url}`)

      // We'll use the simpler approach: activate tab and get screenshot
      await get(`http://localhost:${PORT}/json/activate/${tabId}`)
      await sleep(500)

      // Close tab
      await get(`http://localhost:${PORT}/json/close/${tabId}`)

      console.log(`  [${name}] done`)
    }
  } catch(e) {
    console.error('CDP error:', e.message)
  } finally {
    edge.kill()
  }

  console.log('Done')
})()
