import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * HomeAtmosphere — a full-viewport ambient background for the whole home page.
 *
 * Thousands of GPU-shaded particles drift across the entire screen through an
 * invisible curl-noise flow field (a slow, living aurora). Rendered on a
 * transparent canvas fixed behind all page content — no box, no seam — so the
 * page sections layer over it as translucent glass. Deliberately subtle and
 * low-contrast so text stays perfectly readable. Pauses when the tab is hidden.
 *
 * Self-contained (own renderer / RAF / cleanup).
 */

interface HomeAtmosphereProps {
  className?: string;
}

const MOBILE_BREAKPOINT = 640;

const NOISE_GLSL = /* glsl */ `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  vec3 snoiseVec3(vec3 x){
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }
  vec3 curlNoise(vec3 p){
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    vec3 p_x0 = snoiseVec3(p - dx); vec3 p_x1 = snoiseVec3(p + dx);
    vec3 p_y0 = snoiseVec3(p - dy); vec3 p_y1 = snoiseVec3(p + dy);
    vec3 p_z0 = snoiseVec3(p - dz); vec3 p_z1 = snoiseVec3(p + dz);
    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    return normalize(vec3(x, y, z) / (2.0 * e));
  }
`;

const HomeAtmosphere: React.FC<HomeAtmosphereProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0); // transparent — page background shows through
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T): T => {
      disposables.push(o);
      return o;
    };

    const group = new THREE.Group();
    scene.add(group);

    // ---- Particles spread across a wide, flat volume (fills the screen) --
    const count = isMobile ? 4500 : 9000;
    const base = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() * 2 - 1) * 20;      // wide
      base[i * 3 + 1] = (Math.random() * 2 - 1) * 12;  // tall
      base[i * 3 + 2] = (Math.random() * 2 - 1) * 5;   // shallow depth
      seed[i] = Math.random() * 100.0;
    }
    const geo = track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(base, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

    const material = track(new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: (isMobile ? 30 : 42) * dpr },
        uAmp: { value: 1.4 },
        uColorA: { value: new THREE.Color('#6366f1') }, // indigo
        uColorB: { value: new THREE.Color('#d946ef') }, // fuchsia
        uColorC: { value: new THREE.Color('#67e8f9') }, // cyan
      },
      vertexShader: /* glsl */ `
        ${NOISE_GLSL}
        attribute float aSeed;
        uniform float uTime;
        uniform float uSize;
        uniform float uAmp;
        varying float vSpeed;
        varying float vFade;
        varying float vSeed;
        void main() {
          float t = uTime * 0.04;
          vec3 p = position;
          vec3 flow = curlNoise(p * 0.12 + vec3(0.0, 0.0, t));
          float breathe = 0.7 + 0.3 * sin(uTime * 0.2 + aSeed);
          vec3 disp = p + flow * uAmp * breathe;
          vSpeed = clamp(length(flow) * 0.6, 0.0, 1.0);
          vSeed = aSeed;
          vec4 mv = modelViewMatrix * vec4(disp, 1.0);
          vFade = smoothstep(20.0, 5.0, -mv.z);
          gl_PointSize = uSize * (0.3 + vSpeed) * (1.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying float vSpeed;
        varying float vFade;
        varying float vSeed;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          vec3 col = mix(uColorA, uColorC, vSpeed);
          col = mix(col, uColorB, 0.5 + 0.5 * sin(uTime * 0.25 + vSeed));
          float twinkle = 0.55 + 0.45 * sin(uTime * 1.6 + vSeed * 6.2831);
          gl_FragColor = vec4(col, core * twinkle * (0.15 + 0.85 * vFade) * 0.75);
        }
      `,
    }));
    group.add(new THREE.Points(geo, material));

    // ---- Bloom (soft) --------------------------------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.8, 0.1);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ---- Gentle drift with scroll + mouse ------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // ---- Resize (track viewport, since we're fixed full-screen) --------
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // ---- Visibility gating ---------------------------------------------
    let tabVisible = document.visibilityState === 'visible';
    const onVis = () => (tabVisible = document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    // ---- Animation loop -------------------------------------------------
    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (disposed || !tabVisible) return;

      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      material.uniforms.uTime.value = t;
      group.rotation.z = mouse.x * 0.04;
      group.position.x = mouse.x * 0.6;
      group.position.y = mouse.y * 0.4;

      composer.render();
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
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

export default HomeAtmosphere;
