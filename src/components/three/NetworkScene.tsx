import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '../../hooks/useThree';

interface NetworkSceneProps {
  nodeCount?: number;
  connectionDistance?: number;
  nodeColor?: THREE.ColorRepresentation;
  edgeColor?: THREE.ColorRepresentation;
  glowColor?: THREE.ColorRepresentation;
  animationSpeed?: number;
  nodeSize?: number;
  lineWidth?: number;
  showLabels?: boolean;
  services?: Array<{ name: string; connections: string[]; color: number }>;
}

export const NetworkScene: React.FC<NetworkSceneProps> = ({
  nodeCount = 50,
  connectionDistance = 4,
  nodeColor = 0x0ea5e9,
  edgeColor = 0x0ea5e9,
  glowColor = 0xd946ef,
  animationSpeed = 1.0,
  nodeSize = 0.08,
  lineWidth = 1,
  showLabels = false,
  services = [
    { name: 'AI/ML', connections: ['Data', 'Cloud', 'API'], color: 0x0ea5e9 },
    { name: 'Cloud', connections: ['DevOps', 'API', 'Security'], color: 0xd946ef },
    { name: 'Data', connections: ['AI/ML', 'Analytics', 'API'], color: 0xf97316 },
    { name: 'DevOps', connections: ['Cloud', 'Security', 'CI/CD'], color: 0x10b981 },
    { name: 'API', connections: ['AI/ML', 'Cloud', 'Mobile', 'Web'], color: 0x8b5cf6 },
    { name: 'Security', connections: ['Cloud', 'DevOps', 'Compliance'], color: 0xef4444 },
    { name: 'Mobile', connections: ['API', 'Web', 'Backend'], color: 0x06b6d4 },
    { name: 'Web', connections: ['API', 'Mobile', 'Frontend'], color: 0x84cc16 },
    { name: 'Analytics', connections: ['Data', 'AI/ML', 'BI'], color: 0xf59e0b },
    { name: 'Backend', connections: ['API', 'Database', 'Cloud'], color: 0xec4899 },
    { name: 'Database', connections: ['Backend', 'Data', 'Cloud'], color: 0x6366f1 },
    { name: 'CI/CD', connections: ['DevOps', 'Cloud', 'Security'], color: 0x14b8a6 },
  ],
}) => {
  const { scene, width, height } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const glowRef = useRef<THREE.Mesh[]>([]);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const connectionDataRef = useRef<Array<{ from: number; to: number; progress: number }>>([]);

  useEffect(() => {
    if (!scene) return;

    const group = new THREE.Group();
    groupRef.current = group;

    const count = services.length > 0 ? services.length : nodeCount;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);

    const nodeGeometry = new THREE.SphereGeometry(nodeSize, 16, 16);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const edgeGeometry = new THREE.BufferGeometry();
    const edgePositions: number[] = [];
    const edgeColors: number[] = [];
    const edgeAlphas: number[] = [];

    const connectionData: Array<{ from: number; to: number; progress: number }> = [];

    if (services.length > 0) {
      services.forEach((service, i) => {
        const angle = (i / services.length) * Math.PI * 2;
        const radius = 3 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 4;
        const z = Math.sin(angle) * radius;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;

        const material = new THREE.MeshBasicMaterial({
          color: service.color,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });

        const node = new THREE.Mesh(nodeGeometry, material);
        node.position.set(x, y, z);
        node.userData = { index: i, name: service.name, baseSize: nodeSize };
        group.add(node);
        nodesRef.current.push(node);

        const glowGeometry = new THREE.SphereGeometry(nodeSize * 2.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: service.color,
          transparent: true,
          opacity: 0.1,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, y, z);
        group.add(glow);
        glowRef.current.push(glow);
      });

      const serviceMap = new Map(services.map((s, i) => [s.name, i]));
      
      services.forEach((service, i) => {
        service.connections.forEach(connName => {
          const j = serviceMap.get(connName);
          if (j !== undefined && i < j) {
            const dist = Math.sqrt(
              Math.pow(positions[i * 3] - positions[j * 3], 2) +
              Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2) +
              Math.pow(positions[i * 3 + 2] - positions[j * 3 + 2], 2)
            );
            
            if (dist < connectionDistance) {
              connectionData.push({ from: i, to: j, progress: 0 });
            }
          }
        });
      });
    } else {
      for (let i = 0; i < count; i++) {
        const radius = 2 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        targetPositions[i * 3] = positions[i * 3];
        targetPositions[i * 3 + 1] = positions[i * 3 + 1];
        targetPositions[i * 3 + 2] = positions[i * 3 + 2];

        const material = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });

        const node = new THREE.Mesh(nodeGeometry, material);
        node.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        node.userData = { index: i, baseSize: nodeSize };
        group.add(node);
        nodesRef.current.push(node);

        const glowGeometry = new THREE.SphereGeometry(nodeSize * 2.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(node.position);
        group.add(glow);
        glowRef.current.push(glow);
      }

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDistance) {
            connectionData.push({ from: i, to: j, progress: 0 });
          }
        }
      }
    }

    connectionDataRef.current = connectionData;

    const maxEdges = connectionData.length * 2;
    const edgePosArray = new Float32Array(maxEdges * 3);
    const edgeColorArray = new Float32Array(maxEdges * 3);
    const edgeAlphaArray = new Float32Array(maxEdges);

    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePosArray, 3));
    edgeGeometry.setAttribute('color', new THREE.BufferAttribute(edgeColorArray, 3));
    edgeGeometry.setAttribute('alpha', new THREE.BufferAttribute(edgeAlphaArray, 1));

    const edgeMesh = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edgesRef.current = edgeMesh;
    group.add(edgeMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    group.add(ambientLight);

    const pointLight1 = new THREE.PointLight(nodeColor, 1, 20);
    pointLight1.position.set(5, 5, 5);
    group.add(pointLight1);

    const pointLight2 = new THREE.PointLight(glowColor, 1, 20);
    pointLight2.position.set(-5, -5, 5);
    group.add(pointLight2);

    positionsRef.current = positions;
    velocitiesRef.current = velocities;
    targetPositionsRef.current = targetPositions;

    scene.add(group);

    return () => {
      scene.remove(group);
      nodeGeometry.dispose();
      edgeMaterial.dispose();
      edgeGeometry.dispose();
      nodesRef.current.forEach(node => {
        (node.material as THREE.Material).dispose();
      });
      glowRef.current.forEach(glow => {
        (glow.material as THREE.Material).dispose();
        glow.geometry.dispose();
      });
    };
  }, [scene, nodeCount, connectionDistance, nodeColor, edgeColor, glowColor, nodeSize, services]);

  useFrame((delta, elapsed) => {
    if (!groupRef.current || !positionsRef.current || !velocitiesRef.current || !targetPositionsRef.current) return;

    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const targets = targetPositionsRef.current;
    const count = positions.length / 3;

    const time = elapsed * animationSpeed;

    for (let i = 0; i < count; i++) {
      const noiseX = Math.sin(time * 0.5 + i * 0.7) * 0.02;
      const noiseY = Math.cos(time * 0.3 + i * 1.1) * 0.02;
      const noiseZ = Math.sin(time * 0.7 + i * 0.3) * 0.02;

      targets[i * 3] += noiseX;
      targets[i * 3 + 1] += noiseY;
      targets[i * 3 + 2] += noiseZ;

      const dx = targets[i * 3] - positions[i * 3];
      const dy = targets[i * 3 + 1] - positions[i * 3 + 1];
      const dz = targets[i * 3 + 2] - positions[i * 3 + 2];

      velocities[i * 3] += dx * 0.01;
      velocities[i * 3 + 1] += dy * 0.01;
      velocities[i * 3 + 2] += dz * 0.01;

      velocities[i * 3] *= 0.9;
      velocities[i * 3 + 1] *= 0.9;
      velocities[i * 3 + 2] *= 0.9;

      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (nodesRef.current[i]) {
        nodesRef.current[i].position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );

        const pulse = Math.sin(elapsed * 2 + i) * 0.5 + 0.5;
        const scale = nodesRef.current[i].userData.baseSize * (1 + pulse * 0.2);
        nodesRef.current[i].scale.setScalar(scale);
      }

      if (glowRef.current[i]) {
        glowRef.current[i].position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        glowRef.current[i].scale.setScalar(1 + Math.sin(elapsed + i) * 0.1);
      }
    }

    if (edgesRef.current && edgesRef.current.geometry) {
      const edgePositions = edgesRef.current.geometry.attributes.position.array as Float32Array;
      const edgeAlphas = edgesRef.current.geometry.attributes.alpha.array as Float32Array;
      const edgeColors = edgesRef.current.geometry.attributes.color.array as Float32Array;
      
      const edgeColor = new THREE.Color(edgeColor);
      const glowCol = new THREE.Color(glowColor);
      
      let edgeIndex = 0;

      connectionDataRef.current.forEach((conn, connIdx) => {
        const from = conn.from;
        const to = conn.to;

        const x1 = positions[from * 3];
        const y1 = positions[from * 3 + 1];
        const z1 = positions[from * 3 + 2];
        const x2 = positions[to * 3];
        const y2 = positions[to * 3 + 1];
        const z2 = positions[to * 3 + 2];

        const pulse = Math.sin(elapsed * 3 + connIdx) * 0.5 + 0.5;
        conn.progress += delta * 2;
        if (conn.progress > 1) conn.progress = 0;

        const drawProgress = Math.sin(elapsed * 2 + connIdx * 0.5) * 0.5 + 0.5;
        const alpha = 0.15 + drawProgress * 0.35;

        for (let step = 0; step < 2; step++) {
          const t = step === 0 ? 0 : 1;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;
          const z = z1 + (z2 - z1) * t;

          if (edgeIndex < edgePositions.length / 3) {
            edgePositions[edgeIndex * 3] = x;
            edgePositions[edgeIndex * 3 + 1] = y;
            edgePositions[edgeIndex * 3 + 2] = z;
            
            const color = edgeColor.clone().lerp(glowCol, pulse * 0.5);
            edgeColors[edgeIndex * 3] = color.r;
            edgeColors[edgeIndex * 3 + 1] = color.g;
            edgeColors[edgeIndex * 3 + 2] = color.b;
            
            edgeAlphas[edgeIndex] = alpha;
            edgeIndex++;
          }
        }
      });

      edgesRef.current.geometry.attributes.position.needsUpdate = true;
      edgesRef.current.geometry.attributes.color.needsUpdate = true;
      edgesRef.current.geometry.attributes.alpha.needsUpdate = true;
      edgesRef.current.geometry.setDrawRange(0, edgeIndex * 2);
    }

    groupRef.current.rotation.y += delta * 0.02 * animationSpeed;
    groupRef.current.rotation.x += delta * 0.01 * animationSpeed;
  });

  return null;
};

export default NetworkScene;