import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const load = (file, dependencies = {}, globals = {}) => {
  const compiled = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require: name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }, ...globals });
  return compiled.exports;
};
const scene = load('src/lib/hero-scene.ts');
const first = scene.sceneFrame(0);
assert.equal(first.edges.length, 120);
assert.equal(first.particles.length, 1000);
assert.equal(first.rings.length, 4);
for (const seconds of [0, 1, 60, 600, 3600]) {
  const frame = scene.sceneFrame(seconds);
  const points = [...frame.edges.flat(), ...frame.rings.flat(), ...frame.particles.map(p => p.point)];
  assert.ok(points.flat().every(Number.isFinite), 'projection must remain finite throughout rotation');
}

// Exercise the real renderer with a controlled clock. Browser observers and
// Canvas are minimal recording doubles; scene calculations remain unmocked.
const host = { clientWidth: 1440, clientHeight: 900, dataset: {} };
let moves = [], effect, ref = 0, nextId = 0;
const queue = new Map(), observers = {}, listeners = {};
const ctx = {
  setTransform() {}, clearRect() { moves = []; }, translate() {}, scale() {},
  moveTo(x,y) { moves.push([x,y]); }, lineTo() {}, closePath() {},
  beginPath() {}, arc() {}, fill() {}, stroke() {},
};
const surface = { getContext: () => ctx };
const document = { hidden: false, documentElement: {},
  addEventListener: (name, fn) => { listeners[name] = fn; },
  removeEventListener: name => { delete listeners[name]; },
};
const observer = name => class {
  constructor(callback) { observers[name] = callback; }
  observe() {} disconnect() { delete observers[name]; }
};
const hero = load('src/components/HeroBackground.tsx', {
  react: { useEffect: fn => { effect = fn; }, useRef: () => ({ current: ref++ === 0 ? host : surface }) },
  'react/jsx-runtime': { jsx() {}, jsxs() {} },
  '@/lib/hero-scene': scene, './HeroBackground.module.css': { default: {} },
}, {
  document,
  window: { devicePixelRatio: 2, addEventListener() {}, removeEventListener() {} },
  getComputedStyle: () => ({ getPropertyValue: () => '#abcdef' }),
  requestAnimationFrame: fn => { queue.set(++nextId, fn); return nextId; },
  cancelAnimationFrame: id => queue.delete(id),
  ResizeObserver: observer('size'), IntersectionObserver: observer('intersection'), MutationObserver: observer('theme'),
});
hero.default({ children: null });
const cleanup = effect();
assert.equal(host.dataset.ready, 'true');
const snapshot = () => JSON.stringify(moves);
const initial = snapshot();
const advance = time => {
  assert.equal(queue.size, 1, 'only one animation loop may be pending');
  const [id, callback] = queue.entries().next().value;
  queue.delete(id); callback(time);
};
advance(1000);
assert.equal(snapshot(), initial, 'first animation frame must match the static pose');
advance(1016);
assert.notEqual(snapshot(), initial, 'animation must advance');
const pose = snapshot();
observers.theme();
assert.equal(snapshot(), pose, 'theme changes must preserve rotation');
host.clientWidth = 390; host.clientHeight = 844; observers.size();
assert.equal(snapshot(), pose, 'resize must preserve world coordinates');
document.hidden = true; listeners.visibilitychange();
assert.equal(queue.size, 0, 'hidden tabs must stop drawing');
document.hidden = false; listeners.visibilitychange();
advance(100000);
assert.equal(snapshot(), pose, 'returning to a tab must not jump forward');
observers.intersection([{ isIntersecting: false }]);
assert.equal(queue.size, 0, 'offscreen scenes must stop drawing');
observers.intersection([{ isIntersecting: true }]);
advance(200000);
assert.equal(snapshot(), pose, 'scrolling back must resume the same pose');
cleanup();
assert.equal(queue.size, 0);
assert.equal(Object.keys(observers).length, 0);
assert.equal(Object.keys(listeners).length, 0);
console.log('Hero geometry, first frame, animation, theme, resize, pause/resume and cleanup checks passed.');
