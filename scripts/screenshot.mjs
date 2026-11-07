import { chromium } from 'playwright-core'
const exe = process.env.CHROMIUM_PATH
const b = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1500, height: 900 } })
const logs = []
p.on('console', m => logs.push(m.type() + ': ' + m.text().slice(0, 200)))
p.on('pageerror', e => logs.push('PAGEERROR ' + e.message))
await p.goto('http://localhost:4173/')
await p.waitForTimeout(2500)
await p.screenshot({ path: './.cache/shots/a-initial.png' })
// play to mid
await p.getByRole('button', { name: 'Play' }).click()
await p.waitForTimeout(100)
await p.locator('input[aria-label="Time"]').fill('30')
await p.waitForTimeout(800)
await p.screenshot({ path: './.cache/shots/b-mid.png' })
console.log(logs.join('\n'))
await b.close()
