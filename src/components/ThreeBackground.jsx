import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function RimPlanet() {
  const g = useRef(null)
  const ring = useRef(null)

  const { mat, ringMat } = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#050813'),
      roughness: 0.7,
      metalness: 0.1,
      emissive: new THREE.Color('#06122a'),
      emissiveIntensity: 0.8,
    })
    const rm = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#7dd3fc'),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return { mat: m, ringMat: rm }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (g.current) g.current.rotation.y = t * 0.08
    if (ring.current) ring.current.rotation.z = t * 0.12
  })

  return (
    <group ref={g} position={[0, 0.4, -1.2]}>
      <mesh>
        <sphereGeometry args={[2.35, 64, 64]} />
        <primitive attach="material" object={mat} />
      </mesh>
      <mesh position={[-0.38, 0.28, 2.1]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.25, 0, 0]}>
        <torusGeometry args={[2.85, 0.02, 10, 260]} />
        <primitive attach="material" object={ringMat} />
      </mesh>
      <mesh rotation={[Math.PI / 2.25, 0, 0]}>
        <torusGeometry args={[2.85, 0.14, 8, 260]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Particles() {
  const group = useRef(null)
  const count = 1200

  const { geo, mat } = useMemo(() => {
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
      // 60% cyan, 25% purple, 15% gold
      const col = pick < 0.60 ? c1 : pick < 0.85 ? c2 : c3
      colors[i * 3 + 0] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const m = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geo: g, mat: m }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.06
      group.current.rotation.x = Math.sin(t * 0.2) * 0.06 + state.pointer.y * 0.05
      group.current.rotation.z = state.pointer.x * 0.03
      group.current.position.x = state.pointer.x * 0.16
      group.current.position.y = state.pointer.y * 0.1
    }
    
    // Subtle Y-axis floating animation
    const positions = geo.attributes.position.array;
    for(let i = 0; i < count; i++) {
       positions[i*3 + 1] += Math.sin(t * 0.3 + i) * 0.0003;
    }
    geo.attributes.position.needsUpdate = true;
  })

  return (
    <group ref={group}>
      <fog attach="fog" args={['#050712', 7, 18]} />
      <points geometry={geo}>
        <primitive attach="material" object={mat} />
      </points>
      <RimPlanet />
      <gridHelper 
        args={[36, 52, 0x003355, 0x003355]} 
        position={[0, -3, 0]} 
        rotation={[Math.PI * 0.08, 0, 0]}
        material-transparent={true}
        material-opacity={0.25}
      />
      <ambientLight intensity={0.28} />
      <pointLight intensity={1.2} color="#00d4ff" position={[2.2, 1.6, 2.4]} distance={18} />
      <pointLight intensity={0.8} color="#8b5cf6" position={[-2.8, 1.4, -1.8]} distance={18} />
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.8, 8.5], fov: 55 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.25]}
      >
        <color attach="background" args={['rgba(0,0,0,0)']} />
        <Particles />
      </Canvas>
    </div>
  )
}


