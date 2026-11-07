import { Line } from '@react-three/drei'
import { FIELD } from '../rules/field'

/** Rules coordinates (mm, origin at the Workbench-wall/left-wall corner) → centred scene coordinates. */
export const toScene = (x: number, z: number): [number, number] => [x - FIELD.widthMm / 2, z - FIELD.lengthMm / 2]

export function Rect({
  x0,
  x1,
  z0,
  z1,
  y = 2,
  color,
  dashed = false,
  width = 2,
}: {
  x0: number
  x1: number
  z0: number
  z1: number
  y?: number
  color: string
  dashed?: boolean
  width?: number
}) {
  const [a, c] = toScene(x0, z0)
  const [b, d] = toScene(x1, z1)
  return (
    <Line
      points={[
        [a, y, c],
        [b, y, c],
        [b, y, d],
        [a, y, d],
        [a, y, c],
      ]}
      color={color}
      lineWidth={width}
      dashed={dashed}
      dashSize={30}
      gapSize={20}
    />
  )
}
