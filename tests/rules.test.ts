import { describe, expect, it } from 'vitest'
import { AISLES, FIELD, RACK, RACK_UNITS, ROW_Z0, ROW_Z1, aisle, rowX0 } from '../src/rules/field'
import { ROBOT_MAX_MM } from '../src/rules/limits'

describe('field geometry (Game Rules pp.7-9)', () => {
  it('aisles and rack rows add up to the field width', () => {
    const rows = RACK.rows * RACK.depthMm
    const gaps = AISLES.reduce((s, a) => s + (a.x1 - a.x0), 0)
    expect(rows + gaps).toBe(FIELD.widthMm)
  })
  it('row length is 4 uprights + 3 inner widths', () => {
    expect(4 * RACK.uprightMm + 3 * RACK.innerWidthMm).toBe(RACK.rowLengthMm)
  })
  it('rack rows end 400 mm before the front wall', () => {
    expect(FIELD.lengthMm - ROW_Z1).toBe(400)
    expect(ROW_Z0).toBe(1002)
  })
  it('has 9 units numbered from the Workbench end, row by row', () => {
    expect(RACK_UNITS).toHaveLength(9)
    expect(RACK_UNITS[0]?.row).toBe(0)
    expect(RACK_UNITS[3]?.row).toBe(1)
    expect(RACK_UNITS[8]?.center.x).toBe(rowX0(2) + 60)
  })
  it('a maximum-size robot fits only the two wide aisles', () => {
    const fits = AISLES.filter((a) => a.x1 - a.x0 >= ROBOT_MAX_MM).map((a) => a.index)
    expect(fits).toEqual([0, 3])
    expect(aisle(1).x1 - aisle(1).x0).toBe(400)
  })
})
