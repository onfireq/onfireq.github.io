import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';
import { setImmediate } from 'node:timers/promises';

function load(file, dependencies = {}, globals = {}) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8').replaceAll('import.meta.url', '"file:///hero-component.tsx"'), {
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

const surfaceEvents = {}, queue = new Map();
const surface = {
  addEventListener: (name, fn) => { surfaceEvents[name] = fn; },
  removeEventListener: name => { delete surfaceEvents[name]; },
};
let nextId = 0, lastPose, ready = 0, unavailable = 0, errors = 0, rendererDisposed = false;
let failWebGL = false, allocations = 0, renders = 0;
const compilations = [];
class Renderer {
  constructor() { if (failWebGL) throw new Error('No WebGL'); }
  setClearColor() {}
  setDrawingBufferSize(width, height, ratio) {
    assert.equal(ratio, 2, 'preserve full resolution');
    allocations++;
  }
  compileAsync() { return new Promise((resolve, reject) => compilations.push({ resolve, reject })); }
  render(model) { renders++; lastPose = JSON.stringify(model.children.map(object => object.rotation.toArray())); }
  dispose() { rendererDisposed = true; }
}
const runtime = load('src/lib/hero-renderer.ts', { three: { WebGLRenderer: Renderer }, './hero-scene': scene }, {
  requestAnimationFrame: fn => { queue.set(++nextId, fn); return nextId; },
  cancelAnimationFrame: id => queue.delete(id),
});
let state = { width: 1440, height: 900, pixelRatio: 2, light: false, visible: true, active: false };
const callbacks = { onReady: () => ready++, onUnavailable: () => unavailable++, onError: () => errors++ };
const controller = runtime.createHeroRenderer(surface, state, callbacks);
const update = patch => { state = { ...state, ...patch }; controller.update(state); };
assert.equal(ready, 0);
assert.equal(renders, 0, 'no synchronous draw before compilation');
assert.equal(queue.size, 0);
update({}); update({});
assert.equal(allocations, 1, 'same-size updates must not reallocate');
compilations.shift().resolve(); await setImmediate();
const advance = time => {
  assert.equal(queue.size, 1);
  const [id, callback] = queue.entries().next().value;
  queue.delete(id); callback(time);
};
advance(1000); advance(2000);
assert.equal(ready, 1); assert.equal(lastPose, initial); assert.equal(renders, 1);
update({ active: true });
advance(3000); assert.equal(lastPose, initial);
advance(3016); assert.notEqual(lastPose, initial);
const pose = lastPose;
update({ light: true }); assert.equal(lastPose, pose);
update({ width: 390 }); assert.equal(lastPose, pose);
update({ visible: false }); assert.equal(queue.size, 0);
update({ visible: true }); advance(100000); assert.equal(lastPose, pose);
surfaceEvents.webglcontextlost({ preventDefault() {} });
assert.equal(unavailable, 1); assert.equal(queue.size, 0);
const rendersBeforeRestore = renders;
surfaceEvents.webglcontextrestored();
assert.equal(renders, rendersBeforeRestore); assert.equal(queue.size, 0);
compilations.shift().resolve(); await setImmediate();
advance(300000); advance(300016); assert.equal(lastPose, pose);
controller.dispose(); assert.equal(queue.size, 0); assert.equal(rendererDisposed, true);
assert.equal(Object.keys(surfaceEvents).length, 0);
// Unmount during compilation must never render/reveal after disposal.
rendererDisposed = false;
const pending = runtime.createHeroRenderer(surface, state, callbacks);
const oldReady = ready, oldRenders = renders;
pending.dispose(); assert.equal(rendererDisposed, false);
compilations.shift().resolve(); await setImmediate();
assert.equal(rendererDisposed, true); assert.equal(ready, oldReady); assert.equal(renders, oldRenders);
assert.equal(queue.size, 0);
const failed = runtime.createHeroRenderer(surface, state, callbacks);
compilations.shift().reject(new Error('Compile failed')); await setImmediate();
assert.equal(errors, 1); assert.equal(queue.size, 0); failed.dispose();
failWebGL = true;
assert.throws(() => runtime.createHeroRenderer(surface, state, callbacks), /No WebGL/);
const css = fs.readFileSync('src/components/HeroBackground.module.css', 'utf8');
assert.doesNotMatch(css, /(?:animation|transition)\s*:/);
console.log('Shared Three.js renderer: geometry, warm-up, full resolution, pause/resume, recovery and disposal passed.');

// Exercise the browser bridge without a real GPU: failures after transfer must
// replace the canvas and load the shared main-thread renderer only once.
function bridgeHarness({ unsupported = false, constructorFailure = false } = {}) {
  const effects = [], refs = [], workers = [], surfaces = [], observed = {}, events = {}, timers = new Map();
  let index = 0, timerId = 0, bridgeReady = 0, bridgeUnavailable = 0, imports = 0, mainDisposed = false;
  const updates = [];
  const host = { clientWidth: 1440, clientHeight: 900, dataset: {}, replaceChildren(...children) { this.children = children; } };
  const doc = { hidden: false, documentElement: { dataset: { theme: 'dark' } },
    createElement() {
      const canvas = { style: {}, transferred: false };
      if (!unsupported) canvas.transferControlToOffscreen = () => {
        assert.equal(canvas.transferred, false, 'never transfer a canvas twice');
        canvas.transferred = true;
        return { offscreen: true };
      };
      surfaces.push(canvas); return canvas;
    },
    addEventListener: (name, fn) => { events[name] = fn; },
    removeEventListener: name => { delete events[name]; },
  };
  class Worker {
    constructor() {
      if (constructorFailure) throw new Error('Worker blocked');
      this.messages = []; workers.push(this);
    }
    postMessage(message, transfer) { this.messages.push({ message, transfer }); }
    terminate() { this.terminated = true; }
  }
  const observer = name => class {
    constructor(callback) { observed[name] = callback; }
    observe() {} disconnect() { delete observed[name]; }
  };
  const dependencies = {
    react: { useEffect: fn => effects.push(fn), useRef: value => {
      const i = index++; return refs[i] ??= { current: i === 0 ? host : value };
    } },
    'react/jsx-runtime': { jsx() {} },
  };
  Object.defineProperty(dependencies, '@/lib/hero-renderer', { get() {
    imports++;
    return { createHeroRenderer(canvas, initial, cb) {
      assert.equal(canvas.transferred, false, 'fallback needs an untransferred canvas');
      updates.push(initial); cb.onReady();
      return { update: state => updates.push(state), dispose() { mainDisposed = true; } };
    } };
  } });
  const bridge = load('src/components/ThreeBackground.tsx', dependencies, {
    document: doc, window: { devicePixelRatio: 2, addEventListener() {}, removeEventListener() {} },
    Worker, URL,
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id),
    ResizeObserver: observer('size'), IntersectionObserver: observer('intersection'), MutationObserver: observer('theme'),
  });
  bridge.default({ active: false, onReady: () => bridgeReady++, onUnavailable: () => bridgeUnavailable++ });
  effects[0](); const cleanup = effects[1]();
  return { host, workers, surfaces, doc, events, observed, updates, timers, cleanup,
    active() { refs[1].current = true; refs[2].current(); },
    stats: () => ({ bridgeReady, bridgeUnavailable, imports, mainDisposed }),
  };
}
const bridge = bridgeHarness();
const worker = bridge.workers[0];
assert.equal(bridge.host.dataset.renderThread, 'worker');
assert.equal(bridge.stats().imports, 0, 'worker path must never evaluate Three on the main thread');
assert.equal(worker.messages[0].message.type, 'init');
assert.equal(worker.messages[0].transfer.length, 1);
worker.onmessage({ data: { type: 'initialized' } }); assert.equal(bridge.timers.size, 0);
worker.onmessage({ data: { type: 'ready' } }); assert.equal(bridge.stats().bridgeReady, 1);
bridge.active(); assert.equal(worker.messages.at(-1).message.state.active, true);
bridge.doc.documentElement.dataset.theme = 'light'; bridge.observed.theme();
assert.equal(worker.messages.at(-1).message.state.light, true);
bridge.doc.hidden = true; bridge.events.visibilitychange();
assert.equal(worker.messages.at(-1).message.state.visible, false);
bridge.doc.hidden = false; bridge.observed.intersection([{ isIntersecting: false }]);
assert.equal(worker.messages.at(-1).message.state.visible, false);
bridge.host.clientWidth = 390; bridge.observed.size();
assert.equal(worker.messages.at(-1).message.state.width, 390);
worker.onmessage({ data: { type: 'error' } }); await setImmediate();
assert.equal(worker.terminated, true); assert.equal(bridge.surfaces.length, 2);
assert.equal(bridge.host.dataset.renderThread, 'main'); assert.equal(bridge.stats().imports, 1);
worker.onerror(); await setImmediate(); assert.equal(bridge.stats().imports, 1, 'fallback happens only once');
bridge.cleanup(); assert.equal(bridge.stats().mainDisposed, true);
assert.equal(Object.keys(bridge.observed).length + Object.keys(bridge.events).length, 0);
for (const options of [{ unsupported: true }, { constructorFailure: true }]) {
  const test = bridgeHarness(options); await setImmediate();
  assert.equal(test.host.dataset.renderThread, 'main'); assert.equal(test.stats().bridgeReady, 1);
  test.cleanup();
}
const cancelled = bridgeHarness();
cancelled.workers[0].onerror(); cancelled.cleanup(); await setImmediate();
assert.equal(cancelled.stats().bridgeReady, 0, 'late import must not initialize after unmount');
const timeout = bridgeHarness();
[...timeout.timers.values()][0](); await setImmediate();
assert.equal(timeout.host.dataset.renderThread, 'main'); timeout.cleanup();
const strict = bridgeHarness(); strict.cleanup();
const remount = bridgeHarness(); remount.cleanup();
assert.equal(strict.workers[0].terminated, true); assert.equal(remount.workers[0].terminated, true);
console.log('Worker bridge: transfer, theme/size/visibility sync, failure/timeout fallback, lazy import and cleanup passed.');
