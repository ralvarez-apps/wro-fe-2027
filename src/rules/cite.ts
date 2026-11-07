/** How a value was obtained from the rulebooks. */
export type FactKind = 'text' | 'figure' | 'derived' | 'assumed'

export interface Cite {
  readonly doc: 'game' | 'general'
  /** PDF page; null when the value is an assumption not found in the rules. */
  readonly page: number | null
  readonly kind: FactKind
}

export interface Fact {
  readonly label: string
  readonly value: string
  readonly cite: Cite
}

export const game = (page: number, kind: FactKind = 'text'): Cite => ({ doc: 'game', page, kind })
export const general = (page: number, kind: FactKind = 'text'): Cite => ({ doc: 'general', page, kind })
/** A value the rulebooks do not give; the app picks a plausible one and says so. */
export const assumed: Cite = { doc: 'game', page: null, kind: 'assumed' }

export function formatCite(c: Cite): string {
  if (c.page === null) return 'assumed — not in the rules'
  const doc = c.doc === 'game' ? 'Game Rules' : 'General Rules'
  return `${doc} p.${c.page}${c.kind === 'text' ? '' : ` (${c.kind})`}`
}
