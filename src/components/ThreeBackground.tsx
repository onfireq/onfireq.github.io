"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

const PARTICLE_COUNT = 1400;

function createParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  let seed = 0x6d2b79f5;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const r = 2.5 + random() * 2;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return positions;
}

const PARTICLE_POSITIONS = createParticlePositions(PARTICLE_COUNT);

function ParticleField({ light }: { light: boolean }) {
  const ref = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      const step = Math.min(delta, 0.1);
      ref.current.rotation.x += step * 0.05;
      ref.current.rotation.y += step * 0.08;
    }
  });

  return (
    <Points ref={ref} positions={PARTICLE_POSITIONS} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={light ? "#4338ca" : "#6c63ff"}
        opacity={light ? 0.42 : 1}
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </Points>
  );
}

function WireframeSphere({ light }: { light: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      const step = Math.min(delta, 0.1);
      ref.current.rotation.x += step * 0.15;
      ref.current.rotation.y += step * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial
        color={light ? "#0369a1" : "#00d9ff"}
        wireframe
        transparent
        opacity={light ? 0.13 : 0.08}
      />
    </mesh>
  );
}

function FloatingRings({ light }: { light: boolean }) {
  const rings = useMemo(() => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      const radius = 2.2 + i * 0.6;
      const rotation = (i * Math.PI) / 3;
      items.push({ radius, rotation, speed: 0.1 + i * 0.05 });
    }
    return items;
  }, []);

  return (
    <>
      {rings.map((ring, i) => (
        <Ring
          key={i}
          radius={ring.radius}
          initialRotation={ring.rotation}
          speed={ring.speed}
          light={light}
        />
      ))}
    </>
  );
}

function Ring({
  radius,
  initialRotation,
  speed,
  light,
}: {
  radius: number;
  initialRotation: number;
  speed: number;
  light: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      const step = Math.min(delta, 0.1);
      ref.current.rotation.x += step * speed;
      ref.current.rotation.z += step * speed * 0.7;
    }
  });

  return (
    <mesh ref={ref} rotation={[initialRotation, 0, initialRotation * 0.5]}>
      <torusGeometry args={[radius, 0.004, 16, 100]} />
      <meshBasicMaterial
        color={new THREE.Color().setHSL(0.7 + initialRotation * 0.1, 0.8, light ? 0.38 : 0.6)}
        transparent
        opacity={light ? 0.13 : 0.15}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  const { theme } = useTheme();
  const light = theme === "light";

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.25]}
        frameloop="always"
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <ParticleField light={light} />
        <WireframeSphere light={light} />
        <FloatingRings light={light} />
      </Canvas>
    </div>
  );
}
