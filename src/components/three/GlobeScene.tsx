import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '../../hooks/useThree';

interface GlobeSceneProps {
  globeColor?: THREE.ColorRepresentation;
  emissiveColor?: THREE.ColorRepresentation;
  wireframeColor?: THREE.ColorRepresentation;
  rotationSpeed?: number;
  pulseSpeed?: number;
  showWireframe?: boolean;
  showParticles?: boolean;
  locations?: Array<{ lat: number; lng: number; name: string; size: number }>;
}

export const GlobeScene: React.FC<GlobeSceneProps> = ({
  globeColor = 0x0ea5e9,
  emissiveColor = 0x0ea5e9,
  wireframeColor = 0xd946ef,
  rotationSpeed = 0.15,
  pulseSpeed = 1.5,
  showWireframe = true,
  showParticles = true,
  locations = [
    { lat: 40.7128, lng: -74.0060, name: 'New York', size: 1.5 },
    { lat: 51.5074, lng: -0.1278, name: 'London', size: 1.3 },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo', size: 1.4 },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney', size: 1.2 },
    { lat: 55.7558, lng: 37.6176, name: 'Moscow', size: 1.1 },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore', size: 1.2 },
    { lat: 25.2048, lng: 55.2708, name: 'Dubai', size: 1.3 },
    { lat: -23.5505, lng: -46.6333, name: 'São Paulo', size: 1.2 },
  ],
}) => {
  const { scene, width, height } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const locationMarkersRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  useEffect(() => {
    if (!scene) return;

    const group = new THREE.Group();
    groupRef.current = group;

    const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
    
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: globeColor,
      metalness: 0.1,
      roughness: 0.3,
      transparent: true,
      opacity: 0.15,
      transmission: 0.3,
      thickness: 0.5,
      ior: 1.33,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereRef.current = sphere;
    group.add(sphere);

    if (showWireframe) {
      const edgesGeometry = new THREE.EdgesGeometry(sphereGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: wireframeColor,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      });
      const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
      wireframeRef.current = wireframe;
      group.add(wireframe);
    }

    if (showParticles) {
      const particleCount = 2000;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const alphas = new Float32Array(particleCount);
      const offsets = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = 3.2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        sizes[i] = 0.5 + Math.random() * 1.5;
        alphas[i] = 0.3 + Math.random() * 0.7;
        
        offsets[i * 3] = Math.random() * Math.PI * 2;
        offsets[i * 3 + 1] = Math.random() * Math.PI * 2;
        offsets[i * 3 + 2] = Math.random() * Math.PI * 2;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      particleGeometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 3));

      const particleTexture = createGlowTexture();
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        map: particleTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        vertexColors: false,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particlesRef.current = particles;
      group.add(particles);
    }

    const markersGroup = new THREE.Group();
    locationMarkersRef.current = markersGroup;

    locations.forEach((loc, index) => {
      const { lat, lng, size = 1 } = loc;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      const x = 3.5 * Math.sin(phi) * Math.cos(theta);
      const y = 3.5 * Math.cos(phi);
      const z = 3.5 * Math.sin(phi) * Math.sin(theta);

      const markerGeometry = new THREE.SphereGeometry(0.05 * size, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.userData = { baseScale: 1, index };
      markersGroup.add(marker);

      const pulseGeometry = new THREE.RingGeometry(0.08 * size, 0.15 * size, 32);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const pulseRing = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulseRing.position.set(x, y, z);
      pulseRing.lookAt(0, 0, 0);
      pulseRing.userData = { baseScale: 1, index, isPulse: true };
      markersGroup.add(pulseRing);
    });

    group.add(markersGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
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
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      if (wireframeRef.current) {
        wireframeRef.current.geometry.dispose();
        (wireframeRef.current.material as THREE.Material).dispose();
      }
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      markersGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    };
  }, [scene, globeColor, emissiveColor, wireframeColor, showWireframe, showParticles]);

  useFrame((delta, elapsed) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * rotationSpeed;

    pulseRef.current = Math.sin(elapsed * pulseSpeed) * 0.5 + 0.5;

    if (sphereRef.current && sphereRef.current.material instanceof THREE.MeshPhysicalMaterial) {
      sphereRef.current.material.opacity = 0.1 + pulseRef.current * 0.1;
    }

    if (wireframeRef.current && wireframeRef.current.material instanceof THREE.LineBasicMaterial) {
      wireframeRef.current.material.opacity = 0.2 + pulseRef.current * 0.3;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const offsets = particlesRef.current.geometry.attributes.offset.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(elapsed + offsets[i * 3]) * 0.0005;
        positions[i * 3 + 1] += Math.cos(elapsed + offsets[i * 3 + 1]) * 0.0005;
        positions[i * 3 + 2] += Math.sin(elapsed + offsets[i * 3 + 2]) * 0.0005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (locationMarkersRef.current) {
      locationMarkersRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          if (child.userData.isPulse) {
            const scale = 1 + Math.sin(elapsed * 3 + index) * 0.5;
            child.scale.setScalar(scale);
            if (child.material instanceof THREE.MeshBasicMaterial) {
              child.material.opacity = 0.2 + Math.sin(elapsed * 3 + index) * 0.2;
            }
          } else {
            child.scale.setScalar(1 + Math.sin(elapsed * 2 + index) * 0.1);
          }
          child.lookAt(0, 0, 0);
        }
      });
    }
  });

  return null;
};

function createGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default GlobeScene;