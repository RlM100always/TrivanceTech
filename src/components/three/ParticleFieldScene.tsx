import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '../../hooks/useThree';
import { particleVertexShader, particleFragmentShader } from '../../lib/three/shaders';

interface ParticleFieldSceneProps {
  particleCount?: number;
  color?: THREE.ColorRepresentation;
  secondaryColor?: THREE.ColorRepresentation;
  speed?: number;
  noiseScale?: number;
  noiseStrength?: number;
  size?: number;
  blending?: THREE.Blending;
}

export const ParticleFieldScene: React.FC<ParticleFieldSceneProps> = ({
  particleCount = 3000,
  color = 0x0ea5e9,
  secondaryColor = 0xd946ef,
  speed = 0.5,
  noiseScale = 0.5,
  noiseStrength = 2.0,
  size = 1.5,
  blending = THREE.AdditiveBlending,
}) => {
  const { scene, width, height } = useThree();
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const flowFieldRef = useRef<Float32Array | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!scene || !width || !height) return;

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    const ages = new Float32Array(count);
    const noiseOffsets = new Float32Array(count * 3);

    const color1 = new THREE.Color(color);
    const color2 = new THREE.Color(secondaryColor);

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      const colorMix = Math.random();
      colors[i * 3] = color1.r * (1 - colorMix) + color2.r * colorMix;
      colors[i * 3 + 1] = color1.g * (1 - colorMix) + color2.g * colorMix;
      colors[i * 3 + 2] = color1.b * (1 - colorMix) + color2.b * colorMix;

      sizes[i] = size * (0.5 + Math.random() * 1.5);
      lifetimes[i] = 5 + Math.random() * 10;
      ages[i] = Math.random() * lifetimes[i];

      noiseOffsets[i * 3] = Math.random() * 1000;
      noiseOffsets[i * 3 + 1] = Math.random() * 1000;
      noiseOffsets[i * 3 + 2] = Math.random() * 1000;
    }

    const flowFieldSize = 32;
    const flowField = new Float32Array(flowFieldSize * flowFieldSize * flowFieldSize * 3);
    
    for (let x = 0; x < flowFieldSize; x++) {
      for (let y = 0; y < flowFieldSize; y++) {
        for (let z = 0; z < flowFieldSize; z++) {
          const idx = (x * flowFieldSize * flowFieldSize + y * flowFieldSize + z) * 3;
          const nx = x / flowFieldSize;
          const ny = y / flowFieldSize;
          const nz = z / flowFieldSize;
          
          const angle1 = nx * Math.PI * 4;
          const angle2 = ny * Math.PI * 4;
          
          flowField[idx] = Math.sin(angle1) * Math.cos(angle2);
          flowField[idx + 1] = Math.cos(angle1) * Math.sin(angle2);
          flowField[idx + 2] = Math.sin(nz * Math.PI * 2);
        }
      }
    }
    flowFieldRef.current = flowField;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    geometry.setAttribute('age', new THREE.BufferAttribute(ages, 1));
    geometry.setAttribute('noiseOffset', new THREE.BufferAttribute(noiseOffsets, 3));
    geometryRef.current = geometry;

    const texture = createParticleTexture();

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uNoiseScale: { value: noiseScale },
        uNoiseStrength: { value: noiseStrength },
        uFlowField: { value: null },
        uFlowFieldSize: { value: flowFieldSize },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: size },
        uColor: { value: new THREE.Color(color) },
        uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        uPointTexture: { value: texture },
      },
      transparent: true,
      depthWrite: false,
      blending: blending,
      vertexColors: true,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [scene, width, height, particleCount, color, secondaryColor, speed, noiseScale, noiseStrength, size, blending]);

  useFrame((delta, elapsed) => {
    timeRef.current = elapsed;
    
    if (!pointsRef.current || !materialRef.current || !geometryRef.current || !flowFieldRef.current) return;

    materialRef.current.uniforms.uTime.value = elapsed;
    materialRef.current.uniforms.uFlowField.value = flowFieldRef.current;

    const positions = geometryRef.current.attributes.position.array as Float32Array;
    const velocities = geometryRef.current.attributes.velocity.array as Float32Array;
    const ages = geometryRef.current.attributes.age.array as Float32Array;
    const lifetimes = geometryRef.current.attributes.lifetime.array as Float32Array;
    const noiseOffsets = geometryRef.current.attributes.noiseOffset.array as Float32Array;
    const count = positions.length / 3;

    const flowFieldSize = 32;
    const fieldScale = 20 / flowFieldSize;

    for (let i = 0; i < count; i++) {
      ages[i] += delta;
      
      if (ages[i] >= lifetimes[i]) {
        ages[i] = 0;
        const radius = 5 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        
        lifetimes[i] = 5 + Math.random() * 10;
        continue;
      }

      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];

      const fx = ((px + 10) / 20) * flowFieldSize;
      const fy = ((py + 10) / 20) * flowFieldSize;
      const fz = ((pz + 10) / 20) * flowFieldSize;

      const fx0 = Math.floor(fx) % flowFieldSize;
      const fy0 = Math.floor(fy) % flowFieldSize;
      const fz0 = Math.floor(fz) % flowFieldSize;
      const fx1 = (fx0 + 1) % flowFieldSize;
      const fy1 = (fy0 + 1) % flowFieldSize;
      const fz1 = (fz0 + 1) % flowFieldSize;

      const getField = (x: number, y: number, z: number) => {
        const idx = (x * flowFieldSize * flowFieldSize + y * flowFieldSize + z) * 3;
        return new THREE.Vector3(
          flowFieldRef.current![idx],
          flowFieldRef.current![idx + 1],
          flowFieldRef.current![idx + 2]
        );
      };

      const field000 = getField(fx0, fy0, fz0);
      const field100 = getField(fx1, fy0, fz0);
      const field010 = getField(fx0, fy1, fz0);
      const field110 = getField(fx1, fy1, fz0);
      const field001 = getField(fx0, fy0, fz1);
      const field101 = getField(fx1, fy0, fz1);
      const field011 = getField(fx0, fy1, fz1);
      const field111 = getField(fx1, fy1, fz1);

      const dx = fx - fx0;
      const dy = fy - fy0;
      const dz = fz - fz0;

      const lerp = (a: THREE.Vector3, b: THREE.Vector3, t: number) => 
        new THREE.Vector3().lerpVectors(a, b, t);

      const fieldX0 = lerp(field000, field100, dx);
      const fieldX1 = lerp(field010, field110, dx);
      const fieldY0 = lerp(fieldX0, fieldX1, dy);

      const fieldX2 = lerp(field001, field101, dx);
      const fieldX3 = lerp(field011, field111, dx);
      const fieldY1 = lerp(fieldX2, fieldX3, dy);

      const flowForce = lerp(fieldY0, fieldY1, dz);

      const noiseTime = elapsed * 0.1;
      const nx = (noiseOffsets[i * 3] + noiseTime) * noiseScale;
      const ny = (noiseOffsets[i * 3 + 1] + noiseTime * 1.3) * noiseScale;
      const nz = (noiseOffsets[i * 3 + 2] + noiseTime * 0.7) * noiseScale;

      const noiseForce = new THREE.Vector3(
        (simplexNoise(nx, ny, nz) - 0.5) * 2,
        (simplexNoise(ny, nz, nx) - 0.5) * 2,
        (simplexNoise(nz, nx, ny) - 0.5) * 2
      );

      velocities[i * 3] += (flowForce.x + noiseForce.x * noiseStrength) * delta * 0.01;
      velocities[i * 3 + 1] += (flowForce.y + noiseForce.y * noiseStrength) * delta * 0.01;
      velocities[i * 3 + 2] += (flowForce.z + noiseForce.z * noiseStrength) * delta * 0.01;

      const drag = 0.98;
      velocities[i * 3] *= drag;
      velocities[i * 3 + 1] *= drag;
      velocities[i * 3 + 2] *= drag;

      positions[i * 3] += velocities[i * 3] * delta * 60;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.age.needsUpdate = true;
  });

  return null;
};

function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function simplexNoise(x: number, y: number, z: number): number {
  const p = new Array(512);
  const perm = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  for (let i = 0; i < 256; i++) { p[256 + i] = p[i] = perm[i]; }
  
  function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
  function grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  
  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;
  
  return lerp(
    lerp(
      lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
      lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  ) * 0.5 + 0.5;
}

export default ParticleFieldScene;