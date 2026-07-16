import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * ProductFactoryScene — a calm, premium ambient hero backdrop.
 *
 * A slowly rotating wireframe core wrapped in two thin orbital rings, floating
 * over a soft field of drifting particles. Deliberately understated: gentle
 * motion, restrained bloom, subtle mouse parallax. No scroll-jacking.
 *
 * Self-contained (own renderer / RAF / cleanup) like the other scenes here.
 */

interface ProductFactorySceneProps {
  className?: string;
}

// Brand tokens (tailwind primary-500 / accent-500 / secondary-500).
const PRIMARY = new THREE.Color('#0ea5e9');
const ACCENT = new THREE.Color('#f97316');
const SECONDARY = new THREE.Color('#d946ef');

const MOBILE_BREAKPOINT = 640;

const ProductFactoryScene: React.FC<ProductFactorySceneProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T): T => {
      disposables.push(o);
      return o;
    };

    const root = new THREE.Group();
    scene.add(root);

    // ---- Wireframe core (icosahedron) ----------------------------------
    const coreGeo = track(new THREE.IcosahedronGeometry(2.6, 1));
    const core = new THREE.LineSegments(
      track(new THREE.WireframeGeometry(coreGeo)),
      track(new THREE.LineBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    root.add(core);

    // Glowing vertices on the core.
    const vertGeo = track(new THREE.IcosahedronGeometry(2.6, 1));
    const verts = new THREE.Points(
      vertGeo,
      track(new THREE.PointsMaterial({ color: 0xbfe9ff, size: 0.14, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    root.add(verts);

    // Soft inner glow sphere (subtle, NOT blown out).
    const glow = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.5, 32, 32)),
      track(new THREE.MeshBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    root.add(glow);

    // ---- Two thin orbital rings ----------------------------------------
    const ringA = new THREE.Mesh(
      track(new THREE.TorusGeometry(4.0, 0.012, 8, 160)),
      track(new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    ringA.rotation.set(Math.PI / 2.2, 0.3, 0);
    root.add(ringA);

    const ringB = new THREE.Mesh(
      track(new THREE.TorusGeometry(4.9, 0.01, 8, 160)),
      track(new THREE.MeshBasicMaterial({ color: SECONDARY, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    ringB.rotation.set(Math.PI / 1.7, -0.4, 0.6);
    root.add(ringB);

    // A few bright nodes riding ring A.
    const orbiters: THREE.Mesh[] = [];
    const orbGeo = track(new THREE.SphereGeometry(0.09, 10, 10));
    const orbMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    for (let i = 0; i < 4; i++) {
      const o = new THREE.Mesh(orbGeo, orbMat);
      root.add(o);
      orbiters.push(o);
    }

    // ---- Drifting particle dust ----------------------------------------
    const dustCount = isMobile ? 220 : 420;
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 6 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dustPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      dustPos[i * 3 + 2] = r * Math.cos(ph) - 4;
      const c = PRIMARY.clone().lerp(SECONDARY, Math.random());
      dustCol[i * 3] = c.r;
      dustCol[i * 3 + 1] = c.g;
      dustCol[i * 3 + 2] = c.b;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
    const dust = new THREE.Points(
      dustGeo,
      track(new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    scene.add(dust);

    // ---- Post-processing: restrained bloom -----------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.6, 0.35);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ---- Mouse parallax -------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // ---- Resize ---------------------------------------------------------
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ---- Visibility gating ---------------------------------------------
    let onScreen = true;
    let tabVisible = document.visibilityState === 'visible';
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0 });
    io.observe(container);
    const onVis = () => (tabVisible = document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    // ---- Animation loop -------------------------------------------------
    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (disposed || !onScreen || !tabVisible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Slow, calm rotation + gentle tilt toward the cursor.
      root.rotation.y += dt * 0.12;
      root.rotation.x = mouse.y * 0.25;
      root.rotation.z = mouse.x * 0.12;

      verts.rotation.copy(core.rotation);
      glow.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05);

      ringA.rotation.z += dt * 0.18;
      ringB.rotation.z -= dt * 0.12;

      orbiters.forEach((o, i) => {
        const a = t * 0.5 + (i / orbiters.length) * Math.PI * 2;
        // Ride ring A's tilted plane.
        const p = new THREE.Vector3(Math.cos(a) * 4.0, Math.sin(a) * 4.0, 0);
        p.applyEuler(ringA.rotation);
        o.position.copy(p);
      });

      dust.rotation.y += dt * 0.015;

      // Subtle camera parallax.
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      composer.render();
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVis);
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" style={{ width: '100%', height: '100%' }} />;
};

export default ProductFactoryScene;
