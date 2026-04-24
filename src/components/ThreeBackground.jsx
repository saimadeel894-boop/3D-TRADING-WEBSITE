import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Particles() {
  const group = useRef(null)

  const { geo, mat } = useMemo(() => {
    const count = 1000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const c1 = new THREE.Color('#00d4ff')
    const c2 = new THREE.Color('#8b5cf6')
    const c3 = new THREE.Color('#f0b429')
    for (let i = 0; i < count; i += 1) {
      const r = 4.2 + Math.random() * 6.6
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 4.6
      positions[i * 3 + 0] = Math.cos(theta) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(theta) * r
      const pick = Math.random()
      const col = pick < 0.55 ? c1 : pick < 0.86 ? c2 : c3
      colors[i * 3 + 0] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const m = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
    return { geo: g, mat: m }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.06
      group.current.rotation.x = Math.sin(t * 0.2) * 0.06
    }
  })

  return (
    <group ref={group}>
      <points geometry={geo}>
        <primitive attach="material" object={mat} />
      </points>
      <gridHelper args={[30, 40, '#0a2a3a', '#071a24']} position={[0, -2.2, 0]} />
      <ambientLight intensity={0.28} />
      <pointLight intensity={0.8} color="#00d4ff" position={[2.2, 1.6, 2.4]} />
      <pointLight intensity={0.5} color="#8b5cf6" position={[-2.4, 1.2, -1.8]} />
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.8, 8.5], fov: 55 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['rgba(0,0,0,0)']} />
        <Particles />
      </Canvas>
    </div>
  )
}

