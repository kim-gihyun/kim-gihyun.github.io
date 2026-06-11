// Reusable interactive 3D viewer — drawing-set edition.
// Any element with [data-model="path.glb"] becomes an orbitable model.
// Extras:
//   data-wire-intro  — model loads as a blueprint wireframe, then "solidifies"
//   a sibling .section-ctl <input type=range> drives a live section cut
// Falls back to the inner image if the model can't load.
// window.mountViewer(stage) mounts on demand (project modal) and returns
// a handle with .dispose().

let modulesPromise = null;
function loadModules() {
  if (!modulesPromise) {
    modulesPromise = Promise.all([
      import('three'),
      import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/controls/OrbitControls.js'),
      import('three/addons/environments/RoomEnvironment.js'),
      import('three/addons/loaders/DRACOLoader.js')
    ]);
  }
  return modulesPromise;
}

window.mountViewer = function (stage) {
  const handle = { disposed: false, dispose: function () { this.disposed = true; } };
  loadModules().then(function (mods) {
    if (handle.disposed) return;
    const THREE = mods[0], gl = mods[1], oc = mods[2], env = mods[3], dr = mods[4];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const inner = initViewer(stage, THREE, gl, oc, env, dr, reduced);
      handle.dispose = inner.dispose;
      if (handle.disposed) inner.dispose();
    } catch (e) { stage.classList.add('failed'); }
  }).catch(function () { stage.classList.add('failed'); });
  return handle;
};

// Auto-mount inline models. On small screens, skip project-card models
// (avoids several live WebGL contexts on phones) — the CAD image shows instead.
var smallScreen = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
document.querySelectorAll('[data-model]').forEach(function (s) {
  if (smallScreen && s.classList.contains('ptile-stage')) return;
  window.mountViewer(s);
});

function initViewer(stage, THREE, gl, oc, env, dr, reduced) {
  const url = stage.getAttribute('data-model');
  const W = () => stage.clientWidth || 1;
  const H = () => stage.clientHeight || 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new env.RoomEnvironment(), 0.04).texture;

  const cam = new THREE.PerspectiveCamera(38, W() / H(), 0.01, 100);
  cam.position.set(0, 1.1, 4.2);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb6cc, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 7, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xeaf2ff, 0.7); fill.position.set(-6, 1, 4); scene.add(fill);
  const rim = new THREE.DirectionalLight(0x8fbaff, 0.6); rim.position.set(-4, -3, -5); scene.add(rim);

  const controls = new oc.OrbitControls(cam, renderer.domElement);
  controls.enableZoom = false; controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.autoRotate = !reduced; controls.autoRotateSpeed = 1.1;

  // rotation mode: drag + auto-rotate (default) or mouse-tracked (data-mouse-rotate)
  const mouseMode = stage.hasAttribute('data-mouse-rotate');
  let spin = null, tYaw = 0, tPitch = 0, cYaw = 0, cPitch = 0, autoAngle = 0;
  let onMove = null, onTouch = null;
  if (mouseMode) {
    controls.enabled = false; controls.autoRotate = false;
    const aim = (x, y) => {
      tYaw = (x / window.innerWidth - 0.5) * 1.4;
      tPitch = (y / window.innerHeight - 0.5) * 0.5;
    };
    onMove = (e) => aim(e.clientX, e.clientY);
    onTouch = (e) => { if (e.touches[0]) aim(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
  }

  // section cut: a world-space clipping plane driven by a sibling slider
  const sectionCtl = (function () {
    const scope = stage.closest('.hero-visual') || stage.parentElement;
    return scope ? scope.querySelector('.section-ctl:not(.explode-ctl)') : null;
  })();
  const exCtl = (function () {
    const scope = stage.closest('.hero-visual') || stage.parentElement;
    return scope ? scope.querySelector('.explode-ctl') : null;
  })();
  const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1e6); // x <= c
  const wantIntro = stage.hasAttribute('data-wire-intro') && !reduced;

  const material = new THREE.MeshStandardMaterial({
    color: 0x6c95c4, metalness: 0.7, roughness: 0.34, flatShading: true,
    side: THREE.DoubleSide,
    clippingPlanes: sectionCtl ? [clipPlane] : null
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x2e6fb0, wireframe: true, transparent: true, opacity: 0.85,
    clippingPlanes: sectionCtl ? [clipPlane] : null
  });

  const onLoad = (gltf) => {
    const root = gltf.scene;
    const wires = [];
    const parts = [];
    // CAD exporters embed their own cameras/lights — silence them
    root.traverse((o) => {
      if (o.isLight || o.isCamera) o.visible = false;
      if (o.isMesh) parts.push(o);
    });
    const multiPart = parts.length > 1;
    parts.forEach((o) => {
      o.material = material;
      if (o.geometry) { o.geometry.deleteAttribute('normal'); o.geometry.computeVertexNormals(); }
      if (wantIntro && !multiPart) {
        const wm = new THREE.Mesh(o.geometry, wireMat);
        wm.position.copy(o.position); wm.quaternion.copy(o.quaternion); wm.scale.copy(o.scale);
        wires.push({ src: o, mesh: wm });
      }
    });
    // attach wireframe twins next to their sources
    wires.forEach(function (w) { (w.src.parent || root).add(w.mesh); });

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -center.y, -center.z);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scaler = new THREE.Group();
    scaler.add(root);
    scaler.scale.setScalar(2.4 / maxDim);

    const deg = (attr, dflt) => {
      const a = stage.getAttribute(attr);
      const n = a == null ? dflt : parseFloat(a);
      return (isNaN(n) ? dflt : n) * Math.PI / 180;
    };
    const pivot = new THREE.Group();
    pivot.add(scaler);
    pivot.rotation.set(deg('data-rx', 90), deg('data-ry', 0), deg('data-rz', 0));

    spin = new THREE.Group();
    spin.add(pivot);
    scene.add(spin);

    const fitBox = new THREE.Box3().setFromObject(spin);
    const fitCenter = fitBox.getCenter(new THREE.Vector3());
    const fitSize = fitBox.getSize(new THREE.Vector3());
    const sphere = (fitSize.length() * 0.5) || 1;
    const yawSafe = (Math.max(Math.hypot(fitSize.x, fitSize.z), fitSize.y) * 0.5) || 1;
    const radius = mouseMode ? yawSafe : sphere;
    const fov = cam.fov * Math.PI / 180;
    const zoom = parseFloat(stage.getAttribute('data-zoom')) || 1;
    let dist = (radius / Math.sin(fov / 2)) * (mouseMode ? 0.98 : 0.9) / zoom;
    // exploded assemblies need breathing room so parts don't clip the frame
    if (multiPart && exCtl) dist *= 1.22;
    const az = mouseMode ? 0 : 0.6;
    cam.position.set(fitCenter.x + Math.sin(az) * dist, fitCenter.y + radius * 0.32, fitCenter.z + Math.cos(az) * dist);
    cam.near = Math.max(dist / 100, 0.001);
    cam.far = dist * 100;
    cam.updateProjectionMatrix();
    controls.target.copy(fitCenter);
    controls.update();
    stage.classList.add('loaded');

    // ---- section slider wiring ----
    if (sectionCtl) {
      const input = sectionCtl.querySelector('input[type="range"]');
      const read = sectionCtl.querySelector('.sc-read');
      // the model spins, so clip across the widest horizontal extent
      const half = Math.max(fitSize.x, fitSize.z) * 0.5 + 0.05;
      const lo = fitCenter.x - half, hi = fitCenter.x + half;
      const apply = function () {
        const v = parseFloat(input.value) / 100;
        clipPlane.constant = lo + (hi - lo) * v;
        if (read) read.textContent = Math.round(v * 100) + '%';
      };
      if (input) { input.addEventListener('input', apply); apply(); }
      sectionCtl.classList.add('ready');
    }

    // ---- exploded view (multi-part assemblies) ----
    if (multiPart && exCtl) try {
      spin.updateMatrixWorld(true);
      parts.forEach((o) => {
        const bcW = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
        const pInv = o.parent.matrixWorld.clone().invert();
        const a = bcW.clone().applyMatrix4(pInv);
        const b = fitCenter.clone().applyMatrix4(pInv);
        o.userData.exDir = a.sub(b);
        o.userData.exBase = o.position.clone();
      });
      const exInput = exCtl.querySelector('input[type="range"]');
      const exRead = exCtl.querySelector('.sc-read');
      const MAXF = 0.7;
      const exApply = (f) => {
        parts.forEach((o) => o.position.copy(o.userData.exBase).addScaledVector(o.userData.exDir, f));
        if (exRead) exRead.textContent = Math.round(f / MAXF * 100) + '%';
      };
      if (exInput) exInput.addEventListener('input', () => exApply(parseFloat(exInput.value) / 100 * MAXF));
      exCtl.hidden = false; exCtl.classList.add('ready');
      // intro: arrive exploded, hold a beat, then assemble itself
      if (!reduced) {
        const HOLD = 450, D = 2200, startF = MAXF;
        exApply(startF);
        if (exInput) exInput.value = Math.round(startF / MAXF * 100);
        const t0 = performance.now();
        (function step(t) {
          const p = Math.min(Math.max((t - t0 - HOLD) / D, 0), 1);
          const e = 1 - Math.pow(1 - p, 3);            // ease-out, like parts seating home
          const f = startF * (1 - e);
          exApply(f);
          if (exInput) exInput.value = Math.round(f / MAXF * 100);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      } else { exApply(0); }
    } catch (e) { /* explode is an enhancement — never let it kill the render */ }

    // ---- wireframe -> solid intro (single-mesh models) ----
    if (wantIntro && wires.length) {
      material.transparent = true; material.opacity = 0;
      const t0 = performance.now(), durW = 1100, durS = 1700;
      (function fade(t) {
        const e = t - t0;
        const ps = Math.min(Math.max((e - 500) / durS, 0), 1);
        material.opacity = ps * ps * (3 - 2 * ps);
        const pw = Math.min(Math.max((e - 900) / durW, 0), 1);
        wireMat.opacity = 0.85 * (1 - pw);
        if (ps < 1 || pw < 1) requestAnimationFrame(fade);
        else {
          material.transparent = false; material.opacity = 1; material.needsUpdate = true;
          wires.forEach(function (w) { if (w.mesh.parent) w.mesh.parent.remove(w.mesh); });
        }
      })(t0);
    }
  };

  // load with optional fallback (e.g. assembly file not pushed yet)
  const loader = new gl.GLTFLoader();
  // SolidWorks exports are Draco-compressed — attach the decoder
  const draco = new dr.DRACOLoader();
  draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
  loader.setDRACOLoader(draco);
  const fallbackUrl = stage.getAttribute('data-model-fallback');
  loader.load(url, onLoad, undefined, () => {
    if (fallbackUrl && fallbackUrl !== url) {
      loader.load(fallbackUrl, onLoad, undefined, () => { stage.classList.add('failed'); });
    } else {
      stage.classList.add('failed');
    }
  });

  function resize() { renderer.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); }
  window.addEventListener('resize', resize);

  let rafId = 0, running = true;
  (function loop() {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (mouseMode && spin) {
      if (!reduced) autoAngle += 0.0024;
      cYaw += (tYaw - cYaw) * 0.05;
      cPitch += (tPitch - cPitch) * 0.05;
      spin.rotation.y = autoAngle + cYaw * 0.6;
      spin.rotation.x = cPitch * 0.6;
    } else {
      controls.update();
    }
    renderer.render(scene, cam);
  })();

  return {
    dispose: function () {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (onMove) window.removeEventListener('mousemove', onMove);
      if (onTouch) window.removeEventListener('touchmove', onTouch);
      try { controls.dispose(); } catch (e) {}
      try { pmrem.dispose(); } catch (e) {}
      try { renderer.dispose(); } catch (e) {}
      const c = renderer.domElement;
      if (c && c.parentNode) c.parentNode.removeChild(c);
    }
  };
}
