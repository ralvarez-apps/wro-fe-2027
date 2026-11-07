import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FIELD } from '../rules/field'
import { useApp } from '../state/store'
import { Animator, Boxes, Cones, PathLine, Robot } from './Actors'
import { Field } from './Field'
import { Racks } from './Racks'

const CAMERAS = {
  angled: [0, 2300, 2500] as [number, number, number],
  top: [0, 4200, 1] as [number, number, number],
  follow: [0, 1500, 2600] as [number, number, number],
}

export function Scene() {
  const view = useApp((s) => s.view)
  return (
    <Canvas shadows dpr={[1, 2]} onPointerMissed={() => useApp.getState().select(null)} data-testid="scene">
      <color attach="background" args={['#0f141a']} />
      <PerspectiveCamera key={view} makeDefault fov={42} near={10} far={20000} position={CAMERAS[view]} up={view === 'top' ? [0, 0, -1] : [0, 1, 0]} />
      <OrbitControls key={`oc-${view}`} target={[0, 0, FIELD.lengthMm * 0.05]} maxPolarAngle={Math.PI / 2.05} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[1200, 2500, 800]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-1800} shadow-camera-right={1800} shadow-camera-top={1800} shadow-camera-bottom={-1800} shadow-camera-far={7000} />
      <hemisphereLight args={['#ffffff', '#334155', 0.6]} />
      <Animator />
      <Field />
      <Racks />
      <Cones />
      <PathLine />
      <Boxes />
      <Robot />
    </Canvas>
  )
}
