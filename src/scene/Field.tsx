import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import {
  AISLES,
  FIELD,
  ORDER_AREA,
  ORDER_AREAS,
  STATIONS,
  STATION_PAD_MM,
  STORAGE_LINE_Z,
  WORKBENCH,
  WORKBENCH_CENTER_X,
  WORKBENCH_ZONE,
  ROW_Z0,
  ROW_Z1,
} from '../rules/field'
import { ROBOT_MAX_MM } from '../rules/limits'
import { useApp } from '../state/store'
import { Rect, toScene } from './helpers'

const WALL_T = 20 // assumed thickness; not in the rulebook

function hazardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 32
  const g = c.getContext('2d')
  if (g) {
    g.fillStyle = '#f2c500'
    g.fillRect(0, 0, 128, 32)
    g.fillStyle = '#111'
    for (let x = -32; x < 160; x += 32) {
      g.beginPath()
      g.moveTo(x, 32)
      g.lineTo(x + 16, 32)
      g.lineTo(x + 32, 0)
      g.lineTo(x + 16, 0)
      g.closePath()
      g.fill()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  tex.repeat.set(FIELD.lengthMm / 100, 1)
  return tex
}

const click = (key: Parameters<ReturnType<typeof useApp.getState>['select']>[0]) => (e: ThreeEvent<MouseEvent>) => {
  e.stopPropagation()
  useApp.getState().select(key)
}

export function Field() {
  const setup = useApp((s) => s.setup)
  const overlays = useApp((s) => s.overlays)
  const hazard = useMemo(hazardTexture, [])
  const W = FIELD.widthMm
  const L = FIELD.lengthMm
  const H = 100
  const needs = new Set(setup.blockedAisles)
  const wz = toScene(WORKBENCH_CENTER_X, WORKBENCH_ZONE.z1 - 30)

  return (
    <group>
      {/* floor mat */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow onClick={click('field')}>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#dfe6ee" />
      </mesh>

      {/* walls: Workbench wall, front wall, side walls with hazard stripes (Game Rules p.8) */}
      <mesh position={[0, H / 2, -L / 2 - WALL_T / 2]} onClick={click('field')}>
        <boxGeometry args={[W + 2 * WALL_T, H, WALL_T]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, H / 2, L / 2 + WALL_T / 2]} onClick={click('field')}>
        <boxGeometry args={[W + 2 * WALL_T, H, WALL_T]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * (W + WALL_T)) / 2, H / 2, 0]} onClick={click('field')}>
          <boxGeometry args={[WALL_T, H, L]} />
          <meshStandardMaterial map={hazard} />
        </mesh>
      ))}

      {/* Charging stations: flat yellow pads */}
      {(['A', 'C'] as const).map((id) => {
        const s = STATIONS[id]
        const [x, z] = toScene(s.x, s.z)
        return (
          <group key={id} position={[x, 1, z]} onClick={click('station')}>
            <mesh rotation-x={-Math.PI / 2}>
              <planeGeometry args={[STATION_PAD_MM, STATION_PAD_MM * 1.6]} />
              <meshStandardMaterial color="#f2c500" />
            </mesh>
            {overlays.labels && (
              <Html center position={[0, 4, 0]} distanceFactor={3200} className="tag tag-station">
                Station {id}
              </Html>
            )}
          </group>
        )
      })}

      {/* Order List Areas */}
      {ORDER_AREAS.map((a) => {
        const [x, z] = toScene(a.x, a.z)
        const cardIdx = a.number - 1
        const card = setup.orderCards[cardIdx]
        return (
          <group key={a.number} position={[x, 1, z]} onClick={click('orderArea')}>
            <mesh rotation-x={-Math.PI / 2}>
              <planeGeometry args={[ORDER_AREA.widthMm, ORDER_AREA.depthMm]} />
              <meshStandardMaterial color={card ? '#9fb3c8' : '#c4ccd4'} />
            </mesh>
            {overlays.labels && (
              <Html center position={[0, 6, 0]} distanceFactor={3200} className={card ? 'tag tag-card' : 'tag tag-dim'}>
                {card ? `${a.number} → ${card}` : `${a.number}`}
              </Html>
            )}
          </group>
        )
      })}

      {/* Workbench */}
      <mesh
        position={[WORKBENCH_CENTER_X - W / 2, WORKBENCH.heightMm / 2, WORKBENCH.depthMm / 2 - L / 2]}
        onClick={click('workbench')}
        castShadow
      >
        <boxGeometry args={[WORKBENCH.lengthMm, WORKBENCH.heightMm, WORKBENCH.depthMm]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Zones */}
      {overlays.zones && (
        <group>
          <Rect {...WORKBENCH_ZONE} color="#2a6df4" dashed />
          <Rect x0={0} x1={W} z0={STORAGE_LINE_Z} z1={STORAGE_LINE_Z} color="#2a6df4" dashed />
          {overlays.labels && (
            <>
              <Html center position={[wz[0], 5, wz[1]]} distanceFactor={3200} className="tag tag-zone">
                Workbench Zone
              </Html>
              <Html center position={[toScene(W - 220, 0)[0], 5, toScene(0, STORAGE_LINE_Z + 60)[1]]} distanceFactor={3200} className="tag tag-zone">
                Storage Zone ↓
              </Html>
            </>
          )}
        </group>
      )}

      {/* Aisles */}
      {overlays.aisles &&
        AISLES.map((a) => {
          const blocked = needs.has(a.index)
          const width = a.x1 - a.x0
          const [cx, cz] = toScene((a.x0 + a.x1) / 2, (ROW_Z0 + ROW_Z1) / 2)
          const fits = width >= ROBOT_MAX_MM
          return (
            <group key={a.index} position={[cx, 0.6, cz]}>
              <mesh rotation-x={-Math.PI / 2} onClick={click('aisle')}>
                <planeGeometry args={[width - 6, ROW_Z1 - ROW_Z0]} />
                <meshBasicMaterial color={blocked ? '#e5484d' : '#2fbf71'} transparent opacity={blocked ? 0.28 : 0.14} />
              </mesh>
              {overlays.labels && (
                <Html center position={[0, 4, (ROW_Z1 - ROW_Z0) / 2 + 130]} distanceFactor={3200} className={blocked ? 'tag tag-blocked' : 'tag tag-aisle'}>
                  Aisle {a.index + 1} · {width} mm
                  {blocked && (
                    <>
                      <br />
                      BLOCKED
                    </>
                  )}
                  {overlays.limit && !fits && (
                    <>
                      <br />✗ 500 mm robot won’t fit
                    </>
                  )}
                </Html>
              )}
            </group>
          )
        })}
    </group>
  )
}
