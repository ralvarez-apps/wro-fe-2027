// Deploys dist/ as a Cloudflare Worker (static assets) bound to SITE_HOST + SITE_PATH.
// Configuration, not code: SITE_HOST (bare hostname), SITE_PATH (default /fe/2027) and SITE_ZONE come from
// .env or the shell. wrangler cannot take a route on its command line, so this writes
// wrangler.deploy.jsonc (git-ignored) from wrangler.jsonc plus the route, then runs wrangler against it.
// A path route cannot be a Custom Domain, so SITE_HOST needs a proxied DNS record in SITE_ZONE.
// Without SITE_HOST nothing is bound and the Worker answers on its workers.dev address.
// The API token is a secret handled by reference: CLOUDFLARE_API_TOKEN_FILE names a file that holds it
// (mode 0600, outside the repo; a leading ~ is expanded), read here and handed to wrangler only.
// Extra arguments go to wrangler (`node scripts/deploy.mjs --dry-run`).
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'

const host = (process.env.SITE_HOST ?? '').trim().toLowerCase()
const path = (process.env.SITE_PATH ?? '/fe/2027').trim().replace(/\/+$/, '')
if (host && !/^(?=.{4,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) {
  console.error(`SITE_HOST must be a bare hostname, got "${host}"`)
  process.exit(2)
}
if (!/^(\/[a-z0-9-]+)+$/.test(path)) {
  console.error(`SITE_PATH must look like /fe/2027, got "${path}"`)
  process.exit(2)
}
const zone = (process.env.SITE_ZONE ?? host.split('.').slice(-2).join('.')).trim().toLowerCase()

// wrangler.jsonc allows // comments and trailing commas; nothing else is non-JSON.
const strip = (text) =>
  text
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .replace(/,(\s*[}\]])/g, '$1')

const base = JSON.parse(strip(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')))
// `path*` matches /fe/2027 and /fe/2027/...; the assets layer redirects /fe/2027 to /fe/2027/.
const config = host ? { ...base, routes: [{ pattern: `${host}${path}*`, zone_name: zone }] } : base
const out = new URL('../wrangler.deploy.jsonc', import.meta.url)
writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`)
console.error(
  host
    ? `deploying ${config.name} to ${host}${path} (zone ${zone})`
    : `deploying ${config.name} with no custom route (SITE_HOST unset)`,
)

const env = { ...process.env }
const tokenFile = (env.CLOUDFLARE_API_TOKEN_FILE ?? '').trim().replace(/^~(?=\/|$)/, homedir())
if (!env.CLOUDFLARE_API_TOKEN && tokenFile) {
  try {
    env.CLOUDFLARE_API_TOKEN = readFileSync(tokenFile, 'utf8').trim()
  } catch {
    console.error(`cannot read CLOUDFLARE_API_TOKEN_FILE (${tokenFile})`)
    process.exit(2)
  }
}

const run = spawnSync('pnpm', ['dlx', 'wrangler@4', 'deploy', '--config', out.pathname, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: new URL('..', import.meta.url).pathname,
  env,
})
process.exit(run.status ?? 1)
