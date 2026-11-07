// Drives the built app in headless Chromium and saves screenshots (README images, smoke check).
// Needs a running preview (`pnpm preview`) and a Chromium: CHROMIUM_PATH=<chrome binary>.
// BASE_URL defaults to the preview URL, OUT_DIR to docs/images. Exits 1 on any page error.
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const base = process.env.BASE_URL ?? 'http://localhost:4173/fe/2027/'
const out = process.env.OUT_DIR ?? 'docs/images'
const exe = process.env.CHROMIUM_PATH
if (!exe) {
  console.error('set CHROMIUM_PATH to a Chromium/Chrome binary')
  process.exit(2)
}
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  executablePath: exe,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

const seek = async (s) => {
  await page.locator('input[aria-label="Time"]').fill(String(s))
  await page.waitForTimeout(700)
}
const example = (i) => page.locator('select').first().selectOption({ index: i })

await page.goto(base)
await page.waitForTimeout(1500)
await seek(30)
await page.screenshot({ path: `${out}/senior-m1.png` })

await example(3) // Advanced M1, aisles 2+4 blocked
await page.getByLabel('Robot size limit (500 mm)').check()
await page.getByRole('button', { name: 'top' }).click()
await page.waitForTimeout(600)
await seek(40)
await page.screenshot({ path: `${out}/advanced-m1-top.png` })

await example(5) // Advanced M2
await page.getByRole('button', { name: 'angled' }).click()
await page.waitForTimeout(600)
await seek(45)
await page.screenshot({ path: `${out}/advanced-m2.png` })

await browser.close()
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`screenshots written to ${out}`)
