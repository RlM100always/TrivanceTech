import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * NetworkGlobeScene — the hero's "live data network" globe.
 *
 * A rotating sphere of GPU-shaded, twinkling, depth-faded points wired into a
 * faint mesh, with light pulses that travel along great-circle arcs between
 * nodes (the signature "connections lighting up" effect). Wrapped by tilted
 * orbital rings with glowing riders and a soft dust field. Restrained bloom,
 * inertial mouse parallax, no scroll-jacking.
 *
 * Self-contained (own renderer / RAF / cleanup) like the other scenes here.
 */

interface NetworkGlobeSceneProps {
  className?: string;
}

// Brand tokens.
const PRIMARY = new THREE.Color('#6366f1'); // indigo
const LIGHT = new THREE.Color('#a5b4fc');
const SECONDARY = new THREE.Color('#d946ef'); // fuchsia
const CYAN = new THREE.Color('#67e8f9');
const NODE = new THREE.Color('#dbeafe');

const MOBILE_BREAKPOINT = 640;
const R = 3.4; // globe radius

const rand = (a: number, b: number) => a + Math.random() * (b - a);

const NetworkGlobeScene: React.FC<NetworkGlobeSceneProps> = ({ className }) => {
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
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T): T => {
      disposables.push(o);
      return o;
    };

    const globe = new THREE.Group();
    scene.add(globe);

    // ---- Fibonacci sphere points --------------------------------------
    const pointCount = isMobile ? 420 : 720;
    const spherePts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      spherePts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(R));
    }

    // ---- Shaded, twinkling, depth-faded points ------------------------
    const ptPos = new Float32Array(pointCount * 3);
    const ptScale = new Float32Array(pointCount);
    const ptSeed = new Float32Array(pointCount);
    spherePts.forEach((p, i) => {
      ptPos[i * 3] = p.x;
      ptPos[i * 3 + 1] = p.y;
      ptPos[i * 3 + 2] = p.z;
      ptScale[i] = rand(0.5, 1.8);
      ptSeed[i] = rand(0, Math.PI * 2);
    });
    const ptGeo = track(new THREE.BufferGeometry());
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    ptGeo.setAttribute('aScale', new THREE.BufferAttribute(ptScale, 1));
    ptGeo.setAttribute('aSeed', new THREE.BufferAttribute(ptSeed, 1));

    const pointMat = track(new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: (isMobile ? 12 : 17) * dpr },
        uColor: { value: NODE.clone() },
        uHi: { value: LIGHT.clone() },
      },
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aSeed;
        uniform float uTime;
        uniform float uSize;
        varying float vTw;
        varying float vFade;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vTw = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed);
          vFade = smoothstep(17.0, 6.5, -mv.z);   // dim the far hemisphere
          gl_PointSize = uSize * aScale * (1.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform vec3 uHi;
        varying float vTw;
        varying float vFade;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          vec3 col = mix(uColor, uHi, vTw);
          gl_FragColor = vec4(col, core * vTw * (0.25 + 0.75 * vFade));
        }
      `,
    }));
    globe.add(new THREE.Points(ptGeo, pointMat));

    // ---- Faint surface mesh (near-neighbour links) --------------------
    const linkVerts: number[] = [];
    const maxDist = R * 0.42;
    for (let i = 0; i < pointCount; i++) {
      let made = 0;
      for (let j = i + 1; j < pointCount && made < 2; j++) {
        if (spherePts[i].distanceTo(spherePts[j]) < maxDist) {
          const a = spherePts[i], b = spherePts[j];
          linkVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          made++;
        }
      }
    }
    const linkGeo = track(new THREE.BufferGeometry());
    linkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linkVerts), 3));
    globe.add(new THREE.LineSegments(
      linkGeo,
      track(new THREE.LineBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false })),
    ));

    // Soft inner glow.
    const glow = new THREE.Mesh(
      track(new THREE.SphereGeometry(R * 0.9, 32, 32)),
      track(new THREE.MeshBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    globe.add(glow);

    // ---- Traveling light pulses on great-circle arcs ------------------
    const arcMats: THREE.ShaderMaterial[] = [];
    const arcVert = /* glsl */ `
      attribute float aT;
      varying float vT;
      void main() {
        vT = aT;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const arcFrag = /* glsl */ `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uOffset;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vT;
      void main() {
        float head = fract(uTime * uSpeed + uOffset);
        float d = head - vT;
        if (d < 0.0) d += 1.0;          // wrap the comet
        float comet = exp(-d * 16.0);   // bright head, fading tail
        float base = 0.08;              // faint always-on filament
        vec3 col = mix(uColorB, uColorA, vT) + comet * 0.6;
        float alpha = (base + comet) * (0.4 + 0.6 * sin(vT * 3.14159));
        gl_FragColor = vec4(col, alpha);
      }
    `;
    const arcCount = isMobile ? 12 : 20;
    const arcPalette: [THREE.Color, THREE.Color][] = [
      [CYAN, PRIMARY],
      [SECONDARY, PRIMARY],
      [LIGHT, CYAN],
      [PRIMARY, SECONDARY],
    ];
    for (let a = 0; a < arcCount; a++) {
      const p0 = spherePts[(Math.random() * pointCount) | 0].clone();
      const p1 = spherePts[(Math.random() * pointCount) | 0].clone();
      if (p0.distanceTo(p1) < R * 0.6) continue; // skip trivially short arcs
      const mid = p0.clone().add(p1).multiplyScalar(0.5);
      const lift = 1 + THREE.MathUtils.clamp(p0.distanceTo(p1) / (R * 2.4), 0.18, 0.8);
      mid.normalize().multiplyScalar(R * lift);
      const curve = new THREE.QuadraticBezierCurve3(p0, mid, p1);
      const seg = 54;
      const pts = curve.getPoints(seg);
      const pos = new Float32Array((seg + 1) * 3);
      const ts = new Float32Array(seg + 1);
      pts.forEach((p, i) => {
        pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
        ts[i] = i / seg;
      });
      const g = track(new THREE.BufferGeometry());
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aT', new THREE.BufferAttribute(ts, 1));
      const pal = arcPalette[a % arcPalette.length];
      const m = track(new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
        vertexShader: arcVert, fragmentShader: arcFrag,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: rand(0.12, 0.32) },
          uOffset: { value: Math.random() },
          uColorA: { value: pal[0].clone() },
          uColorB: { value: pal[1].clone() },
        },
      }));
      arcMats.push(m);
      globe.add(new THREE.Line(g, m));
    }

    // ---- Tilted orbital rings + glowing riders ------------------------
    const rings: THREE.Mesh[] = [];
    const ringSpecs = [
      { r: R * 1.55, tube: 0.012, color: LIGHT, opacity: 0.55, rot: [Math.PI / 2.2, 0.3, 0] as const },
      { r: R * 1.95, tube: 0.01, color: SECONDARY, opacity: 0.42, rot: [Math.PI / 1.7, -0.4, 0.6] as const },
    ];
    ringSpecs.forEach((s) => {
      const ring = new THREE.Mesh(
        track(new THREE.TorusGeometry(s.r, s.tube, 8, 220)),
        track(new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: s.opacity, blending: THREE.AdditiveBlending, depthWrite: false })),
      );
      ring.rotation.set(s.rot[0], s.rot[1], s.rot[2]);
      globe.add(ring);
      rings.push(ring);
    });

    const orbiters: THREE.Mesh[] = [];
    const orbGeo = track(new THREE.SphereGeometry(0.075, 12, 12));
    const orbMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    for (let i = 0; i < 6; i++) {
      const o = new THREE.Mesh(orbGeo, orbMat);
      globe.add(o);
      orbiters.push(o);
    }

    // ---- Drifting dust ------------------------------------------------
    const dustCount = isMobile ? 220 : 400;
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 7 + Math.random() * 15;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dustPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.75;
      dustPos[i * 3 + 2] = r * Math.cos(ph) - 4;
      const c = PRIMARY.clone().lerp(LIGHT, Math.random());
      dustCol[i * 3] = c.r; dustCol[i * 3 + 1] = c.g; dustCol[i * 3 + 2] = c.b;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
    const dust = new THREE.Points(
      dustGeo,
      track(new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    scene.add(dust);

    // ---- Post-processing: bloom ---------------------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.6, 0.22);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ---- Inertial mouse parallax --------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // ---- Resize --------------------------------------------------------
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

    // ---- Visibility gating --------------------------------------------
    let onScreen = true;
    let tabVisible = document.visibilityState === 'visible';
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0 });
    io.observe(container);
    const onVis = () => (tabVisible = document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    // ---- Animation loop -----------------------------------------------
    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (disposed || !onScreen || !tabVisible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      globe.rotation.y += dt * 0.09;
      globe.rotation.x = mouse.y * 0.22;
      globe.rotation.z = mouse.x * 0.08;

      pointMat.uniforms.uTime.value = t;
      arcMats.forEach((m) => (m.uniforms.uTime.value = t));

      glow.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
      rings[0].rotation.z += dt * 0.15;
      rings[1].rotation.z -= dt * 0.1;

      orbiters.forEach((o, i) => {
        const ring = i % 2 === 0 ? rings[0] : rings[1];
        const rr = i % 2 === 0 ? ringSpecs[0].r : ringSpecs[1].r;
        const a = t * 0.5 + (i / orbiters.length) * Math.PI * 2;
        const p = new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, 0);
        p.applyEuler(ring.rotation);
        o.position.copy(p);
      });

      dust.rotation.y += dt * 0.012;

      camera.position.x += (mouse.x * 1.0 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.7 - camera.position.y) * 0.05;
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

export default NetworkGlobeScene;
