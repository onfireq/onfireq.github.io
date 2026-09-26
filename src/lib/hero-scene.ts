// Shared by the exported first frame and Canvas. Coordinates are relative to
// a 1000px-high viewport with a 60-degree camera at z = 5.
type Vec3 = [number, number, number];
export type Point = [number, number];
const focalLength = 500 / Math.tan(Math.PI / 6);

function normalize([x, y, z]: Vec3, radius: number): Vec3 {
  const scale = radius / Math.hypot(x, y, z);
  return [x * scale, y * scale, z * scale];
}

function createSphere() {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices: Vec3[] = [
    [-1,t,0], [1,t,0], [-1,-t,0], [1,-t,0],
    [0,-1,t], [0,1,t], [0,-1,-t], [0,1,-t],
    [t,0,-1], [t,0,1], [-t,0,-1], [-t,0,1],
  ].map(v => normalize(v as Vec3, 1.8));
  const faces = [
    [0,11,5], [0,5,1], [0,1,7], [0,7,10], [0,10,11],
    [1,5,9], [5,11,4], [11,10,2], [10,7,6], [7,1,8],
    [3,9,4], [3,4,2], [3,2,6], [3,6,8], [3,8,9],
    [4,9,5], [2,4,11], [6,2,10], [8,6,7], [9,8,1],
  ];
  const midpoints = new Map<string, number>();
  const midpoint = (a: number, b: number) => {
    const key = [a,b].sort((x,y) => x-y).join(",");
    const existing = midpoints.get(key);
    if (existing !== undefined) return existing;
    const index = vertices.length;
    vertices.push(normalize(vertices[a].map((n,i) => (n + vertices[b][i]) / 2) as Vec3, 1.8));
    midpoints.set(key, index);
    return index;
  };
  const edges = new Map<string, [number, number]>();
  for (const [a,b,c] of faces) {
    const ab = midpoint(a,b), bc = midpoint(b,c), ca = midpoint(c,a);
    for (const triangle of [[a,ab,ca], [b,bc,ab], [c,ca,bc], [ab,bc,ca]]) {
      for (let i = 0; i < 3; i++) {
        const pair = [triangle[i], triangle[(i+1)%3]].sort((x,y) => x-y) as [number,number];
        edges.set(pair.join(","), pair);
      }
    }
  }
  return { vertices, edges: [...edges.values()] };
}

function createParticles() {
  let seed = 0x6d2b79f5;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: 1000 }, (): Vec3 => {
    const radius = 2.5 + random() * 2;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    return [radius*Math.sin(phi)*Math.cos(theta), radius*Math.sin(phi)*Math.sin(theta), radius*Math.cos(phi)];
  });
}

// Calculate trigonometry once per group, rather than once per point.
function rotation(x: number, y: number, z = 0) {
  const cx = Math.cos(x), sx = Math.sin(x), cy = Math.cos(y), sy = Math.sin(y), cz = Math.cos(z), sz = Math.sin(z);
  return ([px,py,pz]: Vec3): Vec3 => {
    const zx = px*cz - py*sz, zy = px*sz + py*cz;
    const yx = zx*cy + pz*sy, yz = -zx*sy + pz*cy;
    return [yx, zy*cx - yz*sx, zy*sx + yz*cx];
  };
}

function project([x,y,z]: Vec3): Point {
  const scale = focalLength / (5 - z);
  return [x * scale, -y * scale];
}

const sphere = createSphere();
const particles = createParticles();
const rings = Array.from({ length: 4 }, (_, i) =>
  Array.from({ length: 96 }, (_, j): Vec3 => {
    const angle = j / 96 * Math.PI * 2, radius = 2.2 + i * 0.6;
    return [Math.cos(angle)*radius, Math.sin(angle)*radius, 0];
  }),
);

export function sceneFrame(seconds: number) {
  const sphereRotation = rotation(seconds * 0.15, seconds * 0.2);
  const vertices = sphere.vertices.map(v => project(sphereRotation(v)));
  const particleRotation = rotation(seconds * 0.05, seconds * 0.08);
  return {
    edges: sphere.edges.map(([a,b]) => [vertices[a], vertices[b]] as [Point, Point]),
    particles: particles.map(p => {
      const rotated = particleRotation(p);
      return { point: project(rotated), radius: Math.min(2.2, 3 / (5 - rotated[2])) };
    }),
    rings: rings.map((points, i) => {
      const initial = i * Math.PI / 3, speed = 0.1 + i * 0.05;
      const rotate = rotation(initial + seconds*speed, 0, initial*0.5 + seconds*speed*0.7);
      return points.map(p => project(rotate(p)));
    }),
  };
}

export function linePath(points: Point[], closed = false) {
  return points.map(([x,y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join("") + (closed ? "Z" : "");
}
