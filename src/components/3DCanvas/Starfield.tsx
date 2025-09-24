import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
  initialColor?: string;
  rotationSpeed?: number;
  textureUrl?: string;
  starSize?: number;
  xySpread?: number;
  zMin?: number; 
  zDepth?: number; 
}
function Starfield({
  count = 7000,
  initialColor = 'white',
  rotationSpeed = 0.005,
  textureUrl = '/star.png',
  starSize = 0.5,
}: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const starTexture = useLoader(THREE.TextureLoader, textureUrl);

  const positions = useMemo(() => {
    const positionsArray = new Float32Array(count * 3);

    const xySpread = 150;     
    const zMinDistanceFromOrigin = 10;
    const zFieldDepth = 100;  

    for (let i = 0; i < count; i++) {
      positionsArray[i * 3] = (Math.random() - 0.5) * xySpread;
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * xySpread;
      positionsArray[i * 3 + 2] = -(zMinDistanceFromOrigin + Math.random() * zFieldDepth);
    }
    return positionsArray;
  }, [count]);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * rotationSpeed;
      pointsRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        map={starTexture}
        size={starSize}
        color={initialColor}
        sizeAttenuation={true}
        transparent={true}
        alphaTest={0.01}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default Starfield;