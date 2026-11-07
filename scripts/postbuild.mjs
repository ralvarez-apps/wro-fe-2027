// Copies deploy/_headers to dist/_headers: the platform reads it from the asset root, not from dist/fe/2027.
import { copyFileSync } from 'node:fs'

copyFileSync(new URL('../deploy/_headers', import.meta.url), new URL('../dist/_headers', import.meta.url))
