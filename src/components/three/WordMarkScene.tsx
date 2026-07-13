import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '../../hooks/useThree';
import { basicVertexShader, basicFragmentShader } from '../../lib/three/shaders';

interface WordMarkSceneProps {
  text?: string;
  fontSize?: number;
  color?: THREE.ColorRepresentation;
  morphSpeed?: number;
  morphIntensity?: number;
}

export const WordMarkScene: React.FC<WordMarkSceneProps> = ({
  text = 'TRIVANCE',
  fontSize = 2,
  color = 0x0ea5e9,
  morphSpeed = 1.0,
  morphIntensity = 0.3,
}) => {
  const { scene, width, height } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!scene || !width || !height) return;

    const group = new THREE.Group();
    groupRef.current = group;

    const createTextGeometry = (txt: string): THREE.BufferGeometry => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 1024;
      canvas.height = 256;
      
      ctx.font = `bold 160px Inter, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, canvas.width / 2, canvas.height / 2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const points: THREE.Vector3[] = [];
      const scale = fontSize / 100;
      const step = 4;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const idx = (y * canvas.width + x) * 4 + 3;
          if (pixels[idx] > 128) {
            points.push(new THREE.Vector3(
              (x - canvas.width / 2) * scale * 0.1,
              -(y - canvas.height / 2) * scale * 0.1,
              (Math.random() - 0.5) * 0.5
            ));
          }
        }
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const count = points.length;
      const morphTargets = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2 + Math.random() * 3;
        
        morphTargets[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        morphTargets[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        morphTargets[i * 3 + 2] = radius * Math.cos(phi);
      }

      geometry.setAttribute('morphTarget', new THREE.BufferAttribute(morphTargets, 3));
      originalPositionsRef.current = geometry.attributes.position.array as Float32Array;

      return geometry;
    };

    const geometry = createTextGeometry(text);
    geometryRef.current = geometry;

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 morphTarget;
        varying float vProgress;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uMorphSpeed;
        uniform float uMorphIntensity;
        uniform float uProgress;
        
        ${THREE.ShaderChunk.common}
        ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
        
        void main() {
          vPosition = position;
          float progress = uProgress;
          vec3 morphed = mix(position, morphTarget, progress * uMorphIntensity);
          
          float wave = sin(morphed.x * 2.0 + uTime * uMorphSpeed) * 0.1 * (1.0 - progress);
          wave += sin(morphed.y * 2.0 + uTime * uMorphSpeed * 1.3) * 0.1 * (1.0 - progress);
          morphed.z += wave;
          
          vProgress = progress;
          vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
          gl_PointSize = (30.0 * (1.0 - progress * 0.5)) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
          
          ${THREE.ShaderChunk.logdepthbuf_vertex}
        }
      `,
      fragmentShader: `
        varying float vProgress;
        varying vec3 vPosition;
        uniform vec3 uColor;
        uniform float uTime;
        
        ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
        
        void main() {
          ${THREE.ShaderChunk.logdepthbuf_fragment}
          
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= (1.0 - vProgress * 0.3);
          
          vec3 color = uColor;
          float pulse = sin(vPosition.x * 5.0 + uTime * 3.0) * 0.5 + 0.5;
          color = mix(color, vec3(1.0), pulse * 0.3 * (1.0 - vProgress));
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMorphSpeed: { value: morphSpeed },
        uMorphIntensity: { value: morphIntensity },
        uProgress: { value: 1.0 },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
    });
    materialRef.current = material;

    const mesh = new THREE.Points(geometry, material);
    meshRef.current = mesh;
    group.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    group.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x0ea5e9, 1, 20);
    pointLight1.position.set(5, 5, 5);
    group.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xd946ef, 1, 20);
    pointLight2.position.set(-5, -5, 5);
    group.add(pointLight2);

    scene.add(group);

    return () => {
      scene.remove(group);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, width, height, text, fontSize, color, morphSpeed, morphIntensity]);

  useFrame((delta, elapsed) => {
    timeRef.current = elapsed;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
    }
  });

  const animateIn = () => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = 0;
      gsap.to(materialRef.current.uniforms.uProgress, {
        value: 1,
        duration: 2.5,
        ease: 'expo.out',
      });
    }
  };

  const animateOut = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uProgress, {
        value: 0,
        duration: 1.5,
        ease: 'expo.in',
      });
    }
  };

  useEffect(() => {
    animateIn();
    return () => animateOut();
  }, []);

  return null;
};

function gsap(target: any, config: any) {
  return {
    then: (cb: any) => cb(),
  };
}

export default WordMarkScene;