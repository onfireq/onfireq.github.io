import { Vector3 } from "three";
import type { CSSProperties } from "react";
import { createHeroScene, HERO_RINGS } from "@/lib/hero-scene";
import styles from "./HeroBackground.module.css";

// Generated at export time from the actual Three.js scene, at t=0.
function firstFrame() {
  const model = createHeroScene();
  model.scene.updateMatrixWorld(true);
  const project = (point: Vector3) => {
    point.project(model.camera);
    return `${(point.x * 500).toFixed(2)},${(-point.y * 500).toFixed(2)}`;
  };
  const positions = model.sphere.geometry.getAttribute("position");
  const triangles = [];
  for (let i = 0; i < positions.count; i += 3) {
    const vertices = [0, 1, 2].map(j => project(new Vector3().fromBufferAttribute(positions, i + j)));
    triangles.push(`M${vertices.join("L")}Z`);
  }
  const particles = model.particles.geometry.getAttribute("position");
  const stars = Array.from({ length: particles.count }, (_, i) => {
    const point = new Vector3().fromBufferAttribute(particles, i);
    const r = 3.75 / (5 - point.z);
    const [x,y] = project(point).split(",").map(Number);
    const radius = r.toFixed(2), diameter = (r*2).toFixed(2);
    return `M${(x-r).toFixed(2)},${y}a${radius},${radius} 0 1,0 ${diameter},0a${radius},${radius} 0 1,0 -${diameter},0`;
  }).join("");
  const rings = model.rings.map((ring, i) => {
    const points = Array.from({ length: 100 }, (_, j) => {
      const angle = j / 100 * Math.PI * 2, radius = HERO_RINGS[i].radius;
      return project(ring.localToWorld(new Vector3(Math.cos(angle)*radius, Math.sin(angle)*radius, 0)));
    });
    return `M${points.join("L")}Z`;
  });
  const palette = (light: boolean) => {
    model.setTheme(light);
    return {
      stars: model.particles.material.color.getStyle(), starOpacity: model.particles.material.opacity,
      wire: model.sphere.material.color.getStyle(), wireOpacity: model.sphere.material.opacity,
      rings: model.rings.map(ring => ring.material.color.getStyle()), ringOpacity: model.rings[0].material.opacity,
    };
  };
  const dark = palette(false), light = palette(true);
  model.dispose();
  return { triangles, stars, rings, dark, light };
}
const frame = firstFrame();
const paletteVars = Object.fromEntries(["dark", "light"].flatMap(theme => {
  const colors = frame[theme as "dark" | "light"];
  return [
    [`--${theme}-stars`, colors.stars], [`--${theme}-star-opacity`, colors.starOpacity],
    [`--${theme}-wire`, colors.wire], [`--${theme}-wire-opacity`, colors.wireOpacity],
    [`--${theme}-ring-opacity`, colors.ringOpacity],
    ...colors.rings.map((color, i) => [`--${theme}-ring-${i}`, color]),
  ];
})) as CSSProperties;

export default function HeroBackdrop() {
  return (
    <svg className={styles.artwork} style={paletteVars} viewBox="-500 -500 1000 1000" fill="none" focusable="false">
      <path fill="var(--stars)" opacity="var(--star-opacity)" d={frame.stars} />
      {frame.triangles.map((path, i) => (
        <path key={i} stroke="var(--wire)" strokeOpacity="var(--wire-opacity)" strokeWidth="1" vectorEffect="non-scaling-stroke" d={path} />
      ))}
      {frame.rings.map((path, i) => (
        <path key={i} stroke={`var(--ring-${i})`} strokeOpacity="var(--ring-opacity)" strokeWidth="1.4" d={path} />
      ))}
    </svg>
  );
}
