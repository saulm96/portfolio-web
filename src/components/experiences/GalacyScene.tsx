import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Starfield from '../3DCanvas/Starfield';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';

export interface GalaxySceneProps {
  starParallaxX?: MotionValue<number>;
  starParallaxY?: MotionValue<number>;
}

const galaxySceneContainerStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
};

function SceneContents({ starParallaxX, starParallaxY }: GalaxySceneProps) {
  const initialCameraPosition = useRef<THREE.Vector3 | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (camera && !initialCameraPosition.current) {
      initialCameraPosition.current = camera.position.clone();
    }
  }, [camera]);

  useFrame((state) => {
    if (starParallaxX && starParallaxY && initialCameraPosition.current) {
      const currentParallaxX = starParallaxX.get();
      const currentParallaxY = starParallaxY.get();
      state.camera.position.set(
        initialCameraPosition.current.x + currentParallaxX,
        initialCameraPosition.current.y + currentParallaxY,
        initialCameraPosition.current.z
      );
    }
  });

  return (
    <Starfield count={10000} initialColor="lightblue" rotationSpeed={0.005} starSize={0.35} />
  );
}

export function GalaxyScene({ starParallaxX, starParallaxY }: GalaxySceneProps) {
  return (
    <div style={galaxySceneContainerStyle}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
      >
        <SceneContents starParallaxX={starParallaxX} starParallaxY={starParallaxY} />
      </Canvas>
    </div>
  );
}