import { linePath, sceneFrame } from "@/lib/hero-scene";
import styles from "./HeroBackground.module.css";

const frame = sceneFrame(0);
const stars = frame.particles.map(({ point: [x,y], radius: r }) => {
  const d = (r*2).toFixed(2), radius = r.toFixed(2);
  return `M${(x-r).toFixed(2)},${y.toFixed(2)}a${radius},${radius} 0 1,0 ${d},0a${radius},${radius} 0 1,0 -${d},0`;
}).join("");

// An exact, still first frame, available before scripts arrive. Canvas starts
// at t=0 with the same geometry and palette, without cross-fading scenes.
export default function HeroBackdrop() {
  return (
    <svg className={styles.artwork} viewBox="-500 -500 1000 1000" fill="none" focusable="false">
      <path fill="var(--hero-particles)" d={stars} />
      <path stroke="var(--hero-wire)" strokeWidth="0.8" d={frame.edges.map(edge => linePath(edge)).join("")} />
      {frame.rings.map((points, i) => (
        <path key={i} stroke={`var(--hero-ring-${i})`} strokeWidth="0.8" d={linePath(points, true)} />
      ))}
    </svg>
  );
}
