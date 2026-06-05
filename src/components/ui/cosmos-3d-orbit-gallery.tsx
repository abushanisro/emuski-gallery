import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function ParticleSphere() {
  const PARTICLE_COUNT = 1500
  const SPHERE_RADIUS = 9
  const RANDOMNESS = 3

  const groupRef = useRef<THREE.Group>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const color = new THREE.Color()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const r = SPHERE_RADIUS + (Math.random() - 0.5) * RANDOMNESS

      positions[i * 3]     = r * Math.cos(theta) * Math.sin(phi)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi)

      color.setHSL(0.06 + Math.random() * 0.08, 0.75, 0.55 + Math.random() * 0.3)
      colors[i * 3]     = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0006
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
