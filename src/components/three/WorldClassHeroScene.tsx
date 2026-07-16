import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { particleVertexShader, particleFragmentShader } from '../../lib/three/shaders';
import { designTokens } from '../../styles/designTokens';

interface WorldClassHeroSceneProps {
  className?: string;
  particleCount?: number;
}

const PRIMARY_COLOR = new THREE.Color(designTokens.colors.primary[500]);
const ACCENT_COLOR = new THREE.Color(designTokens.colors.accent[500]);
const SECONDARY_COLOR = new THREE.Color(designTokens.colors.secondary[500]);

const WorldClassHeroScene: React.FC<WorldClassHeroSceneProps> = ({ 
  className, 
  particleCount = 5000 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scene, width, height } = useThree();
  
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const glowPointsRef = useRef<THREE.Points | null>(null);
  const glowMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const ringMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !scene || !width || !height) return;

    let disposed = false;
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(particleCount * 0.4) : particleCount;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.z = 25;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.autoClear = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ============ POST-PROCESSING (BLOOM) ============
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      encoding: THREE.sRGBEncoding,
    });

    const composer = new EffectComposer(renderer, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.2, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;
    // =================================================

    // ============ PARTICLE FIELD ============
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    const ages = new Float32Array(count);
    const noiseOffsets = new Float32Array(count * 3);
    const opacities = new Float32Array(count);
    const rotations = new Float32Array(count);
    const rotationSpeeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

      const colorMix = Math.random();
      const color1 = PRIMARY_COLOR.clone();
      const color2 = ACCENT_COLOR.clone();
      const color3 = SECONDARY_COLOR.clone();
      const mixColor = color1.clone().lerp(color2, colorMix * 0.5).lerp(color3, colorMix * 0.3);
      
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;

      sizes[i] = (0.3 + Math.random() * 0.8) * (isMobile ? 1.5 : 1);
      lifetimes[i] = 8 + Math.random() * 15;
      ages[i] = Math.random() * lifetimes[i];
      opacities[i] = 0.3 + Math.random() * 0.7;
      rotations[i] = Math.random() * Math.PI * 2;
      rotationSpeeds[i] = (Math.random() - 0.5) * 0.002;

      noiseOffsets[i * 3] = Math.random() * 1000;
      noiseOffsets[i * 3 + 1] = Math.random() * 1000;
      noiseOffsets[i * 3 + 2] = Math.random() * 1000;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    geometry.setAttribute('age', new THREE.BufferAttribute(ages, 1));
    geometry.setAttribute('noiseOffset', new THREE.BufferAttribute(noiseOffsets, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
    geometry.setAttribute('rotationSpeed', new THREE.BufferAttribute(rotationSpeeds, 1));
    geometryRef.current = geometry;

    const particleTexture = createParticleTexture();

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float opacity;
        attribute float rotation;
        attribute float rotationSpeed;
        attribute vec3 velocity;
        attribute float age;
        attribute float lifetime;
        attribute vec3 noiseOffset;
        
        varying vec3 vColor;
        varying float vOpacity;
        varying float vRotation;
        varying float vLifeRatio;
        varying vec2 vUv;
        
        uniform float uTime;
        uniform float uSpeed;
        uniform float uNoiseScale;
        uniform float uNoiseStrength;
        uniform float uPixelRatio;
        uniform float uSize;
        uniform vec3 uMouse;
        uniform float uMouseInfluence;
        
        // Simplex 3D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
          float n_ = 1.0/7.0;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          
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
        
        void main() {
          vUv = uv;
          vColor = color;
          vOpacity = opacity;
          vLifeRatio = age / lifetime;
          
          float lifeFactor = 1.0 - vLifeRatio;
          vRotation = rotation + rotationSpeed * uTime * 100.0;
          
          vec3 pos = position;
          
          // Noise-based movement
          float noiseTime = uTime * uSpeed * 0.1;
          vec3 noisePos = (position + noiseOffset) * uNoiseScale + noiseTime;
          float n1 = snoise(noisePos);
          float n2 = snoise(noisePos + 17.3);
          float n3 = snoise(noisePos + 43.7);
          
          vec3 noiseForce = vec3(n1, n2, n3) * uNoiseStrength * 0.5;
          
          // Mouse attraction
          vec3 toMouse = uMouse - position;
          float mouseDist = length(toMouse);
          float mouseForce = uMouseInfluence * (1.0 - smoothstep(0.0, 15.0, mouseDist));
          noiseForce += normalize(toMouse) * mouseForce * 0.3;
          
          // Orbital motion
          float orbitSpeed = 0.02 + length(position) * 0.001;
          float orbitAngle = uTime * orbitSpeed;
          mat2 rot = mat2(cos(orbitAngle), -sin(orbitAngle), sin(orbitAngle), cos(orbitAngle));
          pos.xz = rot * pos.xz;
          
          pos += velocity * uTime * 10.0 + noiseForce * 0.5;
          
          // Life cycle
          float scale = lifeFactor * lifeFactor;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uSize * uPixelRatio * scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          if (gl_PointSize < 0.5) gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        varying float vRotation;
        varying float vLifeRatio;
        varying vec2 vUv;
        
        uniform sampler2D uPointTexture;
        uniform float uTime;
        uniform vec3 uCoreColor;
        
        void main() {
          vec2 centeredUv = vUv - 0.5;
          
          // Rotate UV
          float cosR = cos(vRotation);
          float sinR = sin(vRotation);
          vec2 rotatedUv = vec2(
            centeredUv.x * cosR - centeredUv.y * sinR,
            centeredUv.x * sinR + centeredUv.y * cosR
          ) + 0.5;
          
          vec4 textureColor = texture2D(uPointTexture, rotatedUv);
          
          // Soft circular falloff
          float dist = length(centeredUv) * 2.0;
          float circle = 1.0 - smoothstep(0.0, 1.0, dist);
          
          // Life-based fade
          float lifeAlpha = smoothstep(1.0, 0.95, vLifeRatio) * smoothstep(0.0, 0.1, vLifeRatio);
          
          float alpha = circle * textureColor.a * vOpacity * lifeAlpha;
          
          if (alpha < 0.01) discard;
          
          // Color shift based on life
          vec3 color = mix(uCoreColor, vColor, vLifeRatio);
          
          // Add bloom-ready bright highlights
          float brightness = 1.0 + (1.0 - vLifeRatio) * 0.5;
          color *= brightness;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.8 },
        uNoiseScale: { value: 0.3 },
        uNoiseStrength: { value: 3.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 1.0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uMouseInfluence: { value: 0.5 },
        uPointTexture: { value: particleTexture },
        uCoreColor: { value: new THREE.Color(0xffffff) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    // ============ GLOW PARTICLES (larger, softer) ============
    const glowCount = Math.floor(count * 0.15);
    const glowPositions = new Float32Array(glowCount * 3);
    const glowSizes = new Float32Array(glowCount);
    const glowColors = new Float32Array(glowCount * 3);
    const glowOpacities = new Float32Array(glowCount);

    for (let i = 0; i < glowCount; i++) {
      const radius = 10 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      glowPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      glowPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      glowPositions[i * 3 + 2] = radius * Math.cos(phi);

      glowSizes[i] = 2 + Math.random() * 4;
      
      const colorMix = Math.random();
      const color1 = PRIMARY_COLOR.clone();
      const color2 = ACCENT_COLOR.clone();
      const mixColor = color1.clone().lerp(color2, colorMix);
      
      glowColors[i * 3] = mixColor.r;
      glowColors[i * 3 + 1] = mixColor.g;
      glowColors[i * 3 + 2] = mixColor.b;

      glowOpacities[i] = 0.1 + Math.random() * 0.15;
    }

    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
    glowGeometry.setAttribute('size', new THREE.BufferAttribute(glowSizes, 1));
    glowGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3));
    glowGeometry.setAttribute('opacity', new THREE.BufferAttribute(glowOpacities, 1));

    const glowTexture = createGlowTexture();

    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float opacity;
        
        varying vec3 vColor;
        varying float vOpacity;
        varying vec2 vUv;
        
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        uniform vec3 uMouse;
        
        void main() {
          vUv = uv;
          vColor = color;
          vOpacity = opacity;
          
          vec3 pos = position;
          
          // Slow orbital motion
          float orbitSpeed = 0.005 + length(position) * 0.0005;
          float orbitAngle = uTime * orbitSpeed;
          mat2 rot = mat2(cos(orbitAngle), -sin(orbitAngle), sin(orbitAngle), cos(orbitAngle));
          pos.xz = rot * pos.xz;
          
          // Gentle breathing
          float breathe = sin(uTime * 0.5 + length(position) * 0.1) * 0.5 + 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uSize * uPixelRatio * breathe * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        varying vec2 vUv;
        
        uniform sampler2D uGlowTexture;
        uniform float uTime;
        
        void main() {
          vec2 centeredUv = vUv - 0.5;
          float dist = length(centeredUv) * 2.0;
          
          vec4 textureColor = texture2D(uGlowTexture, vUv);
          
          float alpha = textureColor.a * vOpacity * (1.0 - dist);
          alpha = smoothstep(0.0, 0.1, alpha);
          
          if (alpha < 0.005) discard;
          
          // Pulsing glow
          float pulse = sin(uTime * 1.5) * 0.3 + 0.7;
          vec3 color = vColor * pulse;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 2.0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uGlowTexture: { value: glowTexture },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    glowMaterialRef.current = glowMaterial;

    const glowPoints = new THREE.Points(glowGeometry, glowMaterial);
    glowPointsRef.current = glowPoints;
    scene.add(glowPoints);

    // ============ CENTRAL CORE ============
    const coreGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    
    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          // Subtle vertex displacement
          float displacement = sin(vWorldPosition.x * 2.0 + uTime * 1.5) * 0.05;
          displacement += sin(vWorldPosition.y * 2.0 + uTime * 1.2) * 0.05;
          displacement += sin(vWorldPosition.z * 2.0 + uTime * 1.8) * 0.05;
          
          vec3 newPos = position + normal * displacement;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        void main() {
          vec3 viewDir = normalize(-vWorldPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
          
          // Animated color zones
          float angle = atan(vWorldPosition.z, vWorldPosition.x);
          float height = vWorldPosition.y * 0.5;
          
          float zone1 = sin(angle * 3.0 + uTime * 0.5) * 0.5 + 0.5;
          float zone2 = sin(height * 4.0 + uTime * 0.3) * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, zone1);
          color = mix(color, uColor3, zone2);
          
          // Core glow
          float core = 1.0 - length(vUv - 0.5) * 2.0;
          core = smoothstep(0.0, 1.0, core);
          
          vec3 finalColor = color * (0.5 + fresnel * 0.5 + core * 0.5);
          float alpha = 0.3 + fresnel * 0.5 + core * 0.4;
          
          // Pulsing
          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
          finalColor *= pulse;
          alpha *= pulse;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: PRIMARY_COLOR },
        uColor2: { value: ACCENT_COLOR },
        uColor3: { value: SECONDARY_COLOR },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    coreMaterialRef.current = coreMaterial;

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    coreRef.current = core;
    scene.add(core);

    // ============ ENERGY RING ============
    const ringGeometry = new THREE.RingGeometry(3.5, 4.5, 128);
    
    const ringMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        
        void main() {
          float ringWidth = length(vUv - 0.5) * 2.0;
          float ringMask = 1.0 - smoothstep(0.3, 1.0, ringWidth);
          
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          
          // Rotating segments
          float segments = sin(angle * 8.0 + uTime * 2.0) * 0.5 + 0.5;
          segments = pow(segments, 3.0);
          
          // Pulse wave
          float wave = sin(ringWidth * 20.0 - uTime * 4.0) * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, segments);
          
          float alpha = ringMask * segments * wave * 0.6;
          
          if (alpha < 0.02) discard;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: PRIMARY_COLOR },
        uColor2: { value: ACCENT_COLOR },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    ringMaterialRef.current = ringMaterial;

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ringRef.current = ring;
    scene.add(ring);

    // ============ LIGHTS ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(PRIMARY_COLOR, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(ACCENT_COLOR, 1.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(SECONDARY_COLOR, 1, 50);
    pointLight3.position.set(0, 15, -10);
    scene.add(pointLight3);

    // ============ MOUSE INTERACTION ============
    const onPointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // ============ RESIZE ============
    const resize = () => {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      if (materialRef.current) {
        materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
      if (glowMaterialRef.current) {
        glowMaterialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ============ VISIBILITY ============
    let isIntersecting = true;
    let isTabVisible = document.visibilityState === 'visible';
    
    const io = new IntersectionObserver(
      ([entry]) => { isIntersecting = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(container);
    
    const onVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // ============ ANIMATION LOOP ============
    let frameId = 0;
    const clock = new THREE.Clock();
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      if (disposed || !isIntersecting || !isTabVisible) return;
      
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      timeRef.current = elapsed;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Convert mouse to world space
      const mouseWorld = new THREE.Vector3();
      mouseWorld.setFromMatrixPosition(camera.matrixWorld);
      mouseWorld.x += mouseRef.current.x * 15;
      mouseWorld.y += mouseRef.current.y * 10;
      mouseWorld.z = 0;

      // Update uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsed;
        materialRef.current.uniforms.uMouse.value = mouseWorld;
      }
      if (glowMaterialRef.current) {
        glowMaterialRef.current.uniforms.uTime.value = elapsed;
      }
      if (coreMaterialRef.current) {
        coreMaterialRef.current.uniforms.uTime.value = elapsed;
      }
      if (ringMaterialRef.current) {
        ringMaterialRef.current.uniforms.uTime.value = elapsed;
      }

      // Animate core
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.1;
        coreRef.current.rotation.x += delta * 0.05;
        coreRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.5) * 0.05);
      }

      // Animate ring
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 0.15;
        ringRef.current.rotation.y += delta * 0.05;
        ringRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.7) * 0.1);
      }

      // Animate glow particles
      if (glowPointsRef.current) {
        glowPointsRef.current.rotation.y += delta * 0.02;
        glowPointsRef.current.rotation.x += delta * 0.01;
      }

      // Animate main particles
      if (pointsRef.current) {
        pointsRef.current.rotation.y += delta * 0.015;
        pointsRef.current.rotation.x += delta * 0.005;
      }

      // Animate lights
      pointLight1.position.x = Math.sin(elapsed * 0.3) * 15;
      pointLight1.position.z = Math.cos(elapsed * 0.3) * 15;
      pointLight2.position.x = Math.sin(elapsed * 0.2 + 2) * 12;
      pointLight2.position.y = Math.cos(elapsed * 0.2 + 2) * 12;
      pointLight3.position.y = 15 + Math.sin(elapsed * 0.5) * 5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      
      // Dispose Three.js objects
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      glowTexture.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      
      scene.remove(points);
      scene.remove(glowPoints);
      scene.remove(core);
      scene.remove(ring);
      scene.remove(ambientLight);
      scene.remove(pointLight1);
      scene.remove(pointLight2);
      scene.remove(pointLight3);
      
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scene, width, height, particleCount]);

  return <div ref={containerRef} className={className} aria-hidden="true" style={{ width: '100%', height: '100%' }} />;
};

function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.1, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.05)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default WorldClassHeroScene;