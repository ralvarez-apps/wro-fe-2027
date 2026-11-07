import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { COLORS, RACK, RACK_UNITS, ROW_Z0, rowX0 } from '../rules/field'
import { useApp } from '../state/store'
import { toScene } from './helpers'

const SHELF_T = 15

export function Racks() {
  const labels = useApp((s) => s.overlays.labels)
  const xray = useApp((s) => s.overlays.xray)
  const opacity = xray ? 0.3 : 1
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    useApp.getState().select('rack')
  }
  return (
    <group onClick={onClick}>
      {[0, 1, 2].map((row) => {
        const [cx, cz0] = toScene(rowX0(row) + RACK.depthMm / 2, ROW_Z0)
        return (
          <group key={row} position={[cx, 0, cz0]}>
            {/* four shared uprights */}
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[0, RACK.heightMm / 2, i * (RACK.innerWidthMm + RACK.uprightMm) + RACK.uprightMm / 2]} castShadow>
                <boxGeometry args={[RACK.depthMm, RACK.heightMm, RACK.uprightMm]} />
                <meshStandardMaterial color={COLORS.rackBody} transparent={xray} opacity={opacity} depthWrite={!xray} />
              </mesh>
            ))}
            {/* three levels spanning the row; red front/back bands */}
            {RACK.levelTopMm.map((top) => (
              <group key={top} position={[0, top - SHELF_T / 2, RACK.rowLengthMm / 2]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[RACK.depthMm, SHELF_T, RACK.rowLengthMm]} />
                  <meshStandardMaterial color={COLORS.rackBody} transparent={xray} opacity={opacity} depthWrite={!xray} />
                </mesh>
                {[-1, 1].map((side) => (
                  <mesh key={side} position={[(side * (RACK.depthMm + 1)) / 2, 0, 0]}>
                    <boxGeometry args={[1.5, SHELF_T, RACK.rowLengthMm]} />
                    <meshStandardMaterial color={COLORS.rackFace} transparent={xray} opacity={xray ? 0.6 : 1} depthWrite={!xray} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        )
      })}
      {labels &&
        RACK_UNITS.map((u) => {
          const [x, z] = toScene(u.center.x, u.center.z)
          return (
            <Html key={u.id} center position={[x, RACK.heightMm + 30, z]} distanceFactor={3200} className="tag tag-rack">
              {u.id}
            </Html>
          )
        })}
    </group>
  )
}
