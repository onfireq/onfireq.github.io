import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';

function load(file, dependencies = {}, globals = {}) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require: name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }, ...globals });
  return compiled.exports;
}
const scene = load('src/lib/hero-scene.ts', { three: THREE });
const one = scene.createHeroScene(), two = scene.createHeroScene();
assert.equal(one.particles.geometry.getAttribute('position').count, 1400);
assert.equal(one.sphere.geometry.type, 'IcosahedronGeometry');
assert.equal(one.rings.length, 4);
assert.deepEqual(one.particles.geometry.attributes.position.array, two.particles.geometry.attributes.position.array);
const poses = model => JSON.stringify(model.scene.children.map(object => object.rotation.toArray()));
const initial = poses(one);
one.setTime(10); assert.notEqual(poses(one), initial);
one.setTime(0); assert.equal(poses(one), initial);
one.setTheme(true); assert.equal(poses(one), initial);
assert.equal(one.particles.material.blending, THREE.NormalBlending);
one.setTheme(false); assert.equal(one.particles.material.blending, THREE.AdditiveBlending);
one.dispose(); two.dispose();

const host = { clientWidth: 1440, clientHeight: 900 };
const surfaceEvents = {}, events = {}, observers = {}, queue = new Map();
const surface = { parentElement: host,
  addEventListener: (name, fn) => { surfaceEvents[name] = fn; },
  removeEventListener: name => { delete surfaceEvents[name]; },
};
let effects = [], refs = [], refIndex = 0, nextId = 0, lastPose, ready = 0, unavailable = 0, rendererDisposed = false;
let failWebGL = false;
class Renderer {
  constructor() { if (failWebGL) throw new Error('No WebGL'); }
  setClearColor() {} setPixelRatio() {} setSize() {}
  render(model) { lastPose = JSON.stringify(model.children.map(object => object.rotation.toArray())); }
  dispose() { rendererDisposed = true; }
}
const document = { hidden: false, documentElement: { dataset: { theme: 'dark' } },
  addEventListener: (name, fn) => { events[name] = fn; },
  removeEventListener: name => { delete events[name]; },
};
const observer = name => class {
  constructor(callback) { observers[name] = callback; }
  observe() {} disconnect() { delete observers[name]; }
};
const component = load('src/components/ThreeBackground.tsx', {
  react: { useEffect: fn => effects.push(fn), useRef: value => {
    const index = refIndex++;
    return refs[index] ??= { current: index === 0 ? surface : value };
  } },
  'react/jsx-runtime': { jsx() {} },
  three: { WebGLRenderer: Renderer }, '@/lib/hero-scene': scene,
}, {
  document, window: { devicePixelRatio: 2, addEventListener() {}, removeEventListener() {} },
  requestAnimationFrame: fn => { queue.set(++nextId, fn); return nextId; },
  cancelAnimationFrame: id => queue.delete(id),
  ResizeObserver: observer('size'), IntersectionObserver: observer('intersection'), MutationObserver: observer('theme'),
});
const props = { active: false, onReady: () => ready++, onUnavailable: () => unavailable++ };
component.default(props); effects[0](); const cleanup = effects[1]();
assert.equal(ready, 1);
assert.equal(lastPose, initial, 'WebGL must render the actual t=0 pose before revealing');
const advance = time => {
  assert.equal(queue.size, 1);
  const [id, callback] = queue.entries().next().value;
  queue.delete(id); callback(time);
};
advance(1000); advance(2000);
assert.equal(lastPose, initial, 'hidden scene must not start rotating');
refs[1].current = true;
advance(3000); assert.equal(lastPose, initial, 'first visible frame must still match the preview');
advance(3016); assert.notEqual(lastPose, initial);
const pose = lastPose;
document.documentElement.dataset.theme = 'light'; observers.theme(); assert.equal(lastPose, pose);
host.clientWidth = 390; observers.size(); assert.equal(lastPose, pose);
document.hidden = true; events.visibilitychange(); assert.equal(queue.size, 0);
document.hidden = false; events.visibilitychange(); advance(100000); assert.equal(lastPose, pose);
observers.intersection([{ isIntersecting: false }]); assert.equal(queue.size, 0);
observers.intersection([{ isIntersecting: true }]); advance(200000); assert.equal(lastPose, pose);
surfaceEvents.webglcontextlost({ preventDefault() {} });
assert.equal(unavailable, 1); assert.equal(queue.size, 0);
surfaceEvents.webglcontextrestored(); advance(300000); assert.equal(lastPose, pose);
cleanup(); assert.equal(queue.size, 0); assert.equal(rendererDisposed, true);
assert.equal(Object.keys(observers).length + Object.keys(events).length + Object.keys(surfaceEvents).length, 0);
// A machine without WebGL must retain the static preview instead of hiding the hero.
failWebGL = true; refs = []; refIndex = 0; effects = [];
component.default(props); effects[0](); effects[1]();
assert.equal(unavailable, 2); assert.equal(queue.size, 0);
const css = fs.readFileSync('src/components/HeroBackground.module.css', 'utf8');
assert.doesNotMatch(css, /(?:animation|transition)\s*:/, 'static preview must not animate or cross-fade');
console.log('Three.js geometry, first-frame handoff, theme, resize, pause/resume, WebGL recovery and cleanup checks passed.');
