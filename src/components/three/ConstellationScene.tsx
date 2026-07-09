import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ConstellationSceneProps {
  className?: string;
}

const DESKTOP_POINT_COUNT = 900;
const MOBILE_POINT_COUNT = 400;
const MOBILE_BREAKPOINT = 640;
const LINK_DISTANCE = 2.1;
const MAX_LINKS_PER_FRAME = 1400;

const PRIMARY_COLOR = new THREE.Color('#6366f1'); // primary-500
const ACCENT_COLOR = new THREE.Color('#f97316'); // accent-500

const ConstellationScene: React.FC<ConstellationSceneProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const pointCount = isMobile ? MOBILE_POINT_COUNT : DESKTOP_POINT_COUNT;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Particle field ---
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const spread = 9;
    for (let i = 0; i < pointCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      const mixed = PRIMARY_COLOR.clone().lerp(ACCENT_COLOR, Math.random() * 0.4);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    // --- Connecting lines (rebuilt each frame from a capped proximity check) ---
    const maxLinkVerts = MAX_LINKS_PER_FRAME * 2;
    const linePositions = new Float32Array(maxLinkVerts * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: PRIMARY_COLOR,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

    const group = new THREE.Group();
    group.add(points);
    group.add(lines);
    scene.add(group);

    const updateLinks = () => {
      const pos = pointsGeometry.attributes.position.array as Float32Array;
      let vertIndex = 0;
      const linkDistSq = LINK_DISTANCE * LINK_DISTANCE;
      // Sample a subset of pairs each frame to bound cost on large point counts.
      const step = pointCount > 700 ? 2 : 1;
      outer: for (let i = 0; i < pointCount; i += step) {
        const ix = i * 3;
        for (let j = i + 1; j < pointCount; j += step) {
          const jx = j * 3;
          const dx = pos[ix] - pos[jx];
          const dy = pos[ix + 1] - pos[jx + 1];
          const dz = pos[ix + 2] - pos[jx + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < linkDistSq) {
            if (vertIndex >= maxLinkVerts) break outer;
            linePositions[vertIndex * 3] = pos[ix];
            linePositions[vertIndex * 3 + 1] = pos[ix + 1];
            linePositions[vertIndex * 3 + 2] = pos[ix + 2];
            linePositions[(vertIndex + 1) * 3] = pos[jx];
            linePositions[(vertIndex + 1) * 3 + 1] = pos[jx + 1];
            linePositions[(vertIndex + 1) * 3 + 2] = pos[jx + 2];
            vertIndex += 2;
          }
        }
      }
      lineGeometry.setDrawRange(0, vertIndex);
      lineGeometry.attributes.position.needsUpdate = true;
    };
    updateLinks();

    // --- Resize handling ---
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // --- Mouse parallax ---
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // --- Pause when off-screen or tab hidden ---
    let isIntersecting = true;
    let isTabVisible = document.visibilityState === 'visible';
    const getRunning = () => isIntersecting && isTabVisible;

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);
    const onVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let frameId = 0;
    let linkFrameCounter = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (disposed || !getRunning()) return;

      group.rotation.y += 0.0006;
      group.rotation.x += 0.0002;
      group.rotation.y += (pointer.x * 0.15 - group.rotation.y * 0.02) * 0.02;
      group.rotation.x += (-pointer.y * 0.1 - group.rotation.x * 0.02) * 0.02;

      // Recompute links only every few frames — link geometry doesn't need per-frame precision.
      linkFrameCounter++;
      if (linkFrameCounter % 6 === 0) updateLinks();

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
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
};

export default ConstellationScene;
