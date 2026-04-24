import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function WireGlobe() {
  const group = useRef(null)
  const ring = useRef(null)
  const points = useRef(null)

  const { particleGeometry, mats } = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const c1 = new THREE.Color('#60a5fa')
    const c2 = new THREE.Color('#a78bfa')

    for (let i = 0; i < count; i += 1) {
      const radius = 1.35 + Math.random() * 0.45
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      const t = Math.random()
      const col = c1.clone().lerp(c2, t)
      colors[i * 3 + 0] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const wireMatA = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#60a5fa'),
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    })
    const wireMatB = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#a78bfa'),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const ringMatA = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#93c5fd'),
      transparent: true,
      opacity: 0.95,
    })
    const ringMatB = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#60a5fa'),
      transparent: true,
      opacity: 0.08,
    })

    const ptsMat = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
    })

    return {
      particleGeometry: geo,
      mats: { wireMatA, wireMatB, ringMatA, ringMatB, ptsMat },
    }
  }, [])

  useEffect(() => {
    return () => {
      particleGeometry.dispose()
      mats.wireMatA.dispose()
      mats.wireMatB.dispose()
      mats.ringMatA.dispose()
      mats.ringMatB.dispose()
      mats.ptsMat.dispose()
    }
  }, [mats, particleGeometry])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) group.current.rotation.y = t * 0.12
    if (ring.current) ring.current.rotation.z = t * 0.18
    if (points.current) points.current.rotation.y = -t * 0.08
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={mats.wireMatA} attach="material" />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <primitive object={mats.wireMatB} attach="material" />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.32, 0.01, 12, 240]} />
        <primitive object={mats.ringMatA} attach="material" />
      </mesh>

      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.32, 0.04, 8, 240]} />
        <primitive object={mats.ringMatB} attach="material" />
      </mesh>

      <points ref={points} geometry={particleGeometry}>
        <primitive object={mats.ptsMat} attach="material" />
      </points>

      <pointLight intensity={1.4} color="#60a5fa" position={[0, 0, 0]} distance={6} />
      <pointLight intensity={0.8} color="#a78bfa" position={[0.6, 0.2, 0.8]} distance={6} />
    </group>
  )
}

export default function Globe3D({ className = '', bloom = true }) {
  return (
    <div className={['relative', className].join(' ')}>
      <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-[radial-gradient(closest-side,rgba(59,130,246,0.22),rgba(139,92,246,0.06),rgba(10,14,26,0))] blur-2xl" />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.25} />
        <WireGlobe />
        {bloom ? (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.12}
              luminanceSmoothing={0.2}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.32} darkness={0.9} />
          </EffectComposer>
        ) : null}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}

