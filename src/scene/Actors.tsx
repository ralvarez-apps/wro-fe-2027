import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type ReactNode, useRef } from 'react'
import type * as THREE from 'three'
import { BOX, COLORS, CONE, coneSquares } from '../rules/field'
import { ROBOT_MAX_MM } from '../rules/limits'
import { ROBOT_BODY } from '../scenarios/plan'
import type { BoxSpec, ProductKind } from '../scenarios/types'
import { live, refreshLive, useApp } from '../state/store'
import { Rect, toScene } from './helpers'

/** Advances playback and publishes one computed state per frame. Runs before the other frame hooks. */
export function Animator() {
  useFrame((_, dt) => {
    useApp.getState().tick(Math.min(dt, 0.1))
    refreshLive()
  }, -1)
  return null
}

const WALL = 4

function Product({ kind }: { kind: ProductKind }) {
  const mat = <meshStandardMaterial color={COLORS.product} metalness={0.4} roughness={0.4} />
  if (kind === 'cylinder')
    return (
      <mesh position={[0, 25, 0]}>
        <cylinderGeometry args={[22, 22, 36, 24]} />
        {mat}
      </mesh>
    )
  if (kind === 'pyramid')
    return (
      <mesh position={[0, 25, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[30, 40, 4]} />
        {mat}
      </mesh>
    )
  return (
    <mesh position={[0, 25, 0]}>
      <boxGeometry args={[40, 36, 40]} />
      {mat}
    </mesh>
  )
}

function BoxMesh({ spec }: { spec: BoxSpec }) {
  const ref = useRef<THREE.Group>(null)
  const selected = useApp((s) => s.selected === 'box')
  useFrame(() => {
    const pose = live.current.boxes.get(spec.id)
    const g = ref.current
    if (!pose || !g) return
    const [x, z] = toScene(pose.x, pose.z)
    g.position.set(x, pose.y, z)
    g.rotation.y = pose.rotY
  })
  const color = spec.requested || spec.product ? COLORS.box : '#6fbf9a'
  const mat = <meshStandardMaterial color={color} emissive={selected ? '#115533' : '#000000'} />
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        useApp.getState().select('box')
      }}
    >
      {/* open-top box: floor + four walls, on 12 mm feet */}
      <mesh position={[0, 12 + WALL / 2, 0]} castShadow>
        <boxGeometry args={[BOX.lengthMm, WALL, BOX.depthMm]} />
        {mat}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`x${s}`} position={[(s * (BOX.lengthMm - WALL)) / 2, 12 + BOX.heightMm / 2 - 6, 0]} castShadow>
          <boxGeometry args={[WALL, BOX.heightMm - 12, BOX.depthMm]} />
          {mat}
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} position={[0, 12 + BOX.heightMm / 2 - 6, (s * (BOX.depthMm - WALL)) / 2]} castShadow>
          <boxGeometry args={[BOX.lengthMm, BOX.heightMm - 12, WALL]} />
          {mat}
        </mesh>
      ))}
      {spec.product && <Product kind={spec.product} />}
    </group>
  )
}

export function Boxes() {
  const boxes = useApp((s) => s.plan.boxes)
  return (
    <>
      {boxes.map((b) => (
        <BoxMesh key={b.id} spec={b} />
      ))}
    </>
  )
}

export function Robot() {
  const ref = useRef<THREE.Group>(null)
  const limit = useApp((s) => s.overlays.limit)
  const { widthMm: w, depthMm: d, heightMm: h } = ROBOT_BODY
  useFrame(() => {
    const r = live.current.robot
    const g = ref.current
    if (!g) return
    const [x, z] = toScene(r.x, r.z)
    g.position.set(x, 0, z)
    g.rotation.y = r.heading
  })
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        useApp.getState().select('robot')
      }}
    >
      <mesh position={[0, h / 2 + 10, 0]} castShadow>
        <boxGeometry args={[w, h - 10, d]} />
        <meshStandardMaterial color="#2f6fed" />
      </mesh>
      {/* wheels */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * (w + 6)) / 2, 22, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[22, 22, 12, 20]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
      {/* front marker */}
      <mesh position={[0, h + 4, d / 2 - 22]}>
        <boxGeometry args={[70, 8, 30]} />
        <meshStandardMaterial color="#ffd23f" />
      </mesh>
      {limit && (
        <>
          <mesh position={[0, 2, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[ROBOT_MAX_MM, ROBOT_MAX_MM]} />
            <meshBasicMaterial color="#ff8a00" transparent opacity={0.22} depthWrite={false} />
          </mesh>
          <Html center position={[0, 40, ROBOT_MAX_MM / 2 + 40]} distanceFactor={3200} className="tag tag-limit">
            max robot 500 × 500 mm
          </Html>
        </>
      )}
    </group>
  )
}

export function Cones() {
  const blocked = useApp((s) => s.setup.blockedAisles)
  return (
    <group onClick={(e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      useApp.getState().select('cone')
    }}>
      {blocked.flatMap((a) =>
        coneSquares(a).map((c) => {
          const [x, z] = toScene(c.x, c.z)
          const half = 65
          return (
            <ConeAt key={`${a}-${c.z}`} x={x} z={z}>
              <Rect x0={c.x - half} x1={c.x + half} z0={c.z - half} z1={c.z + half} y={2} color="#ff8a00" width={2} />
            </ConeAt>
          )
        }),
      )}
    </group>
  )
}

function ConeAt({ x, z, children }: { x: number; z: number; children: ReactNode }) {
  return (
    <>
      <group position={[x, 0, z]}>
        <mesh position={[0, CONE.heightMm / 2, 0]} castShadow>
          <coneGeometry args={[CONE.baseMm * 0.5, CONE.heightMm, 24, 1]} />
          <meshStandardMaterial color={COLORS.cone} />
        </mesh>
        <mesh position={[0, CONE.heightMm * 0.45, 0]}>
          <cylinderGeometry args={[CONE.baseMm * 0.27, CONE.baseMm * 0.3, 14, 24]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
      {children}
    </>
  )
}

export function PathLine() {
  const plan = useApp((s) => s.plan)
  const show = useApp((s) => s.overlays.path)
  if (!show) return null
  const pts: [number, number, number][] = []
  for (const seg of plan.segments) {
    if (seg.kind !== 'move') continue
    for (const p of seg.path) {
      const [x, z] = toScene(p.x, p.z)
      pts.push([x, 3, z])
    }
  }
  if (pts.length < 2) return null
  return <Line points={pts} color="#00b8d9" lineWidth={2} dashed dashSize={40} gapSize={25} />
}
