import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * AuroraFlowScene — a flowing curl-noise particle nebula.
 *
 * Thousands of GPU-shaded particles are swept through an invisible 3D curl-noise
 * flow field, swirling like living energy / a digital aurora. All motion and
 * colouring happen in the vertex/fragment shaders (the CPU only advances a clock),
 * so it stays smooth even at high particle counts. Transparent canvas so it blends
 * seamlessly into the page background — no box, no seam. Restrained bloom, gentle
 * mouse parallax, pauses off-screen / when the tab is hidden.
 *
 * Self-contained (own renderer / RAF / cleanup) like the other scenes here.
 */

interface AuroraFlowSceneProps {
  className?: string;
}

const MOBILE_BREAKPOINT = 640;

// Classic Ashima simplex noise + curl, used to advect particles in the shader.
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

const AuroraFlowScene: React.FC<AuroraFlowSceneProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0); // transparent — matches the page background exactly
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

    // ---- Particle cloud (base positions in a soft sphere) --------------
    const count = isMobile ? 6000 : 12000;
    const base = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // denser toward the centre → a glowing core with a diffuse halo
      const r = 3.3 * Math.cbrt(Math.random()) * (0.55 + Math.random() * 0.45);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      base[i * 3] = r * Math.sin(ph) * Math.cos(th);
      base[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      base[i * 3 + 2] = r * Math.cos(ph);
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
        uSize: { value: (isMobile ? 26 : 34) * dpr },
        uAmp: { value: 1.9 },
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
          float t = uTime * 0.05;
          vec3 p = position;
          // Advect the particle through the curl field; slow, organic swirl.
          vec3 flow = curlNoise(p * 0.32 + vec3(0.0, 0.0, t));
          vec3 flow2 = curlNoise(p * 0.7 - vec3(t, 0.0, 0.0));
          float breathe = 0.7 + 0.3 * sin(uTime * 0.25 + aSeed);
          vec3 disp = p + flow * uAmp * breathe + flow2 * (uAmp * 0.35);
          vSpeed = clamp(length(flow + flow2 * 0.5) * 0.7, 0.0, 1.0);
          vSeed = aSeed;
          vec4 mv = modelViewMatrix * vec4(disp, 1.0);
          vFade = smoothstep(14.0, 4.0, -mv.z);
          gl_PointSize = uSize * (0.4 + vSpeed) * (1.0 / -mv.z);
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
          // colour by flow speed, with a slow per-particle hue drift
          vec3 col = mix(uColorA, uColorC, vSpeed);
          col = mix(col, uColorB, 0.5 + 0.5 * sin(uTime * 0.3 + vSeed));
          float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + vSeed * 6.2831);
          gl_FragColor = vec4(col, core * twinkle * (0.2 + 0.8 * vFade));
        }
      `,
    }));
    group.add(new THREE.Points(geo, material));

    // ---- Post-processing: bloom for the glow --------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.85, 0.7, 0.15);
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

      material.uniforms.uTime.value = t;

      group.rotation.y += dt * 0.05;
      group.rotation.x = mouse.y * 0.28;
      group.rotation.z = mouse.x * 0.1;

      camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.05;
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

export default AuroraFlowScene;
