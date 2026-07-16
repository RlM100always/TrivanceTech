import React, { forwardRef, useEffect, useRef, useImperativeHandle, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '../../hooks/useThree';
import { Renderer, SceneManager, PostProcessingOptions } from '../../lib/three/core';

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  rendererOptions?: ConstructorParameters<typeof Renderer>[0];
  sceneConfig?: ConstructorParameters<typeof SceneManager>[0]['config'];
  postProcessing?: PostProcessingOptions;
  onInit?: (manager: SceneManager) => void;
  onRender?: (manager: SceneManager, delta: number, elapsed: number) => void;
  onResize?: (width: number, height: number) => void;
  autoPlay?: boolean;
  enableReducedMotion?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export interface CanvasRef {
  manager: SceneManager | null;
  renderer: Renderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSize: (width: number, height: number) => void;
  setTimeScale: (scale: number) => void;
  getDelta: () => number;
  getElapsedTime: () => number;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  (
    {
      children,
      camera,
      scene,
      rendererOptions,
      sceneConfig,
      onInit,
      onRender,
      onResize,
      autoPlay = true,
      enableReducedMotion = true,
      style,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

const {
      manager,
      renderer,
      scene: threeScene,
      camera: threeCamera,
      canvas,
      isSupported,
      play,
      pause,
      stop,
      setSize,
      setTimeScale,
      getDelta,
      getElapsedTime,
    } = useThree({
      containerRef,
      camera,
      scene,
      rendererOptions,
      sceneConfig,
      postProcessing,
      onInit,
      onRender,
      onResize,
      autoPlay,
      enableReducedMotion,
    });

    useImperativeHandle(ref, () => ({
      manager,
      renderer,
      scene: threeScene,
      camera: threeCamera,
      play,
      pause,
      stop,
      setSize,
      setTimeScale,
      getDelta,
      getElapsedTime,
    }), [manager, renderer, threeScene, threeCamera, play, pause, stop, setSize, setTimeScale, getDelta, getElapsedTime]);

    const content = useMemo(() => {
      if (!isSupported) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#666' }}>
            WebGL is not supported in this browser
          </div>
        );
      }

      return (
        <>
          {containerRef.current && canvas && !containerRef.current.contains(canvas) && (
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
          )}
          {children}
        </>
      );
    }, [isSupported, canvas, children]);

    return (
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        className={className}
        {...props}
      >
        {content}
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';

export { Canvas };

export interface OffscreenCanvasProps extends Omit<CanvasProps, 'style' | 'className'> {
  width: number;
  height: number;
  onFrame?: (blob: Blob) => void;
}

export const OffscreenCanvas = forwardRef<HTMLDivElement, OffscreenCanvasProps>(
  ({ onFrame, ...props }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { manager, renderer, scene, camera } = useThree({
      containerRef,
      ...props,
      rendererOptions: {
        ...props.rendererOptions,
        canvas: undefined,
      },
    });

    useEffect(() => {
      if (!manager || !renderer) return;

      const canvas = renderer.getCanvas();

      const renderFrame = async () => {
        manager.play();
        manager.getRenderer().render(scene, camera);

        canvas.toBlob((blob) => {
          if (blob && onFrame) {
            onFrame(blob);
          }
        }, 'image/png');
      };

      renderFrame();

      return () => manager.pause();
    }, [manager, renderer, scene, camera, onFrame]);

    return (
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      />
    );
  }
);

OffscreenCanvas.displayName = 'OffscreenCanvas';