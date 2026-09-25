// This component runs only during static export. No Three.js code is sent to
// the browser for this SVG; it matches the live scene's camera and geometry.
import { IcosahedronGeometry, PerspectiveCamera, Vector3 } from "three";
import styles from "./HeroBackground.module.css";

function spherePath() {
  const geometry = new IcosahedronGeometry(1.8, 1);
  const camera = new PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 5;
  camera.updateMatrixWorld();
  const positions = geometry.getAttribute("position");
  const point = new Vector3();
  const lines: string[] = [];
  for (let i = 0; i < positions.count; i += 3) {
    const triangle = [];
    for (let j = 0; j < 3; j++) {
      point.fromBufferAttribute(positions, i + j).project(camera);
      triangle.push(`${(point.x * 500).toFixed(2)},${(-point.y * 500).toFixed(2)}`);
    }
    lines.push(`M${triangle.join("L")}Z`);
  }
  geometry.dispose();
  return lines.join("");
}

const wireframe = spherePath();
const particles = Array.from({ length: 160 }, (_, i) => {
  // Deterministic, compact star field, available even before hydration.
  const x = ((i * 167 + 31) % 1999) - 999;
  const y = ((i * 293 + 71) % 997) - 498;
  return `M${x},${y}h${i % 7 === 0 ? 1.5 : 0.6}`;
}).join("");

export default function HeroBackdrop() {
  return (
    <svg className={styles.artwork} viewBox="-500 -500 1000 1000" fill="none" focusable="false">
      <path className={styles.particles} d={particles} strokeLinecap="round" strokeWidth="2" />
      <g className={styles.wireframe}><path d={wireframe} strokeWidth="0.8" /></g>
      {[381, 485, 589, 693].map((radius) => (
        <circle key={radius} className={styles.ring} r={radius} strokeWidth="0.8" />
      ))}
    </svg>
  );
}
