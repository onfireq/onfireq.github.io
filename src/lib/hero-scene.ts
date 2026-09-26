import * as THREE from "three";

export const HERO_RINGS = Array.from({ length: 4 }, (_, i) => ({
  radius: 2.2 + i * 0.6, initial: i * Math.PI / 3, speed: 0.1 + i * 0.05,
}));

export function createHeroScene(light = false) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 5;
  camera.updateMatrixWorld();
  const positions = new Float32Array(1400 * 3);
  let seed = 0x6d2b79f5;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < 1400; i++) {
    const r = 2.5 + random() * 2, theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions.set([r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi)], i*3);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pointMaterial = new THREE.PointsMaterial({
    transparent: true, size: 0.015, sizeAttenuation: true, depthWrite: false,
  });
  // Soft circular particles, as in the original PointMaterial, without loading
  // the React Three Fiber/Drei component runtime just for a decorative scene.
  pointMaterial.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `
      #include <opaque_fragment>
      vec2 point = 2.0 * gl_PointCoord - 1.0;
      float radius = dot(point, point);
      float edge = fwidth(radius);
      gl_FragColor.a *= 1.0 - smoothstep(1.0 - edge, 1.0 + edge, radius);
    `);
  };
  const particles = new THREE.Points(particleGeometry, pointMaterial);
  particles.frustumCulled = false;
  const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1),
    new THREE.MeshBasicMaterial({ wireframe: true, transparent: true }));
  const rings = HERO_RINGS.map(({ radius, initial }) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.004, 16, 100),
      new THREE.MeshBasicMaterial({ transparent: true }));
    ring.rotation.set(initial, 0, initial * 0.5);
    return ring;
  });
  scene.add(particles, sphere, ...rings);

  function setTheme(isLight: boolean) {
    pointMaterial.color.set(isLight ? "#4338ca" : "#6c63ff");
    pointMaterial.opacity = isLight ? 0.42 : 1;
    pointMaterial.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    sphere.material.color.set(isLight ? "#0369a1" : "#00d9ff");
    sphere.material.opacity = isLight ? 0.13 : 0.08;
    rings.forEach((ring, i) => {
      ring.material.color.setHSL(0.7 + HERO_RINGS[i].initial * 0.1, 0.8, isLight ? 0.38 : 0.6);
      ring.material.opacity = isLight ? 0.13 : 0.15;
    });
  }
  function setTime(seconds: number) {
    particles.rotation.set(seconds * 0.05, seconds * 0.08, 0);
    sphere.rotation.set(seconds * 0.15, seconds * 0.2, 0);
    rings.forEach((ring, i) => {
      const { initial, speed } = HERO_RINGS[i];
      ring.rotation.set(initial + seconds * speed, 0, initial * 0.5 + seconds * speed * 0.7);
    });
  }
  function dispose() {
    for (const object of [particles, sphere, ...rings]) {
      object.geometry.dispose();
      object.material.dispose();
    }
  }
  setTheme(light);
  return { scene, camera, particles, sphere, rings, setTheme, setTime, dispose };
}
