import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Renderer, SceneManager, checkWebGLSupport, checkReducedMotion, getDevicePixelRatio } from '../core';

export interface UseThreeOptions {
  containerRef?: React.RefObject<HTMLElement>;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  rendererOptions?: ConstructorParameters<typeof Renderer>[0];
  sceneConfig?: ConstructorParameters<typeof SceneManager>[0]['config'];
  onInit?: (manager: SceneManager) => void;
  onRender?: (manager: SceneManager, delta: number, elapsed: number) => void;
  onResize?: (width: number, height: number) => void;
  autoPlay?: boolean;
  enableReducedMotion?: boolean;
}

export interface UseThreeReturn {
  manager: SceneManager | null;
  renderer: Renderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  canvas: HTMLCanvasElement | null;
  width: number;
  height: number;
  isPlaying: boolean;
  isSupported: boolean;
  prefersReducedMotion: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSize: (width: number, height: number) => void;
  setTimeScale: (scale: number) => void;
  getDelta: () => number;
  getElapsedTime: () => number;
}

export function useThree(options: UseThreeOptions = {}): UseThreeReturn {
  const {
    containerRef,
    camera: customCamera,
    scene: customScene,
    rendererOptions,
    sceneConfig,
    onInit,
    onRender,
    onResize,
    autoPlay = true,
    enableReducedMotion = true,
  } = options;

  const [manager, setManager] = useState<SceneManager | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRefInternal = useRef<HTMLElement>(null);

  const container = containerRef || containerRefInternal;

  useEffect(() => {
    const support = checkWebGLSupport();
    setIsSupported(support.supported);

    if (enableReducedMotion) {
      setPrefersReducedMotion(checkReducedMotion());
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [enableReducedMotion]);

  useEffect(() => {
    if (!isSupported || !container.current) return;

    const renderer = new Renderer({
      ...rendererOptions,
      pixelRatio: getDevicePixelRatio(),
    });

    const managerInstance = new SceneManager({
      renderer,
      config: sceneConfig,
      onBeforeRender: onRender
        ? () => onRender(managerInstance, managerInstance.getDelta(), managerInstance.getElapsedTime())
        : undefined,
    });

    if (customCamera) {
      managerInstance.setCamera(customCamera);
    }
    if (customScene) {
      managerInstance.getScene().clear();
      customScene.children.forEach((child) => managerInstance.add(child));
    }

    managerInstance.initialize(container.current!);

    const canvas = renderer.getCanvas();
    const { width: initialWidth, height: initialHeight } = canvas.parentElement!.getBoundingClientRect();
    setWidth(initialWidth);
    setHeight(initialHeight);

    const unsubscribeResize = managerInstance.onResize(() => {
      const { width: w, height: h } = canvas.parentElement!.getBoundingClientRect();
      setWidth(w);
      setHeight(h);
      onResize?.(w, h);
    });

    setManager(managerInstance);
    onInit?.(managerInstance);

    if (autoPlay && !prefersReducedMotion) {
      managerInstance.play();
    }

    return () => {
      unsubscribeResize();
      managerInstance.dispose();
      setManager(null);
    };
  }, [isSupported, container, rendererOptions, sceneConfig, customCamera, customScene, onInit, onRender, onResize, autoPlay, prefersReducedMotion]);

  const play = useCallback(() => manager?.play(), [manager]);
  const pause = useCallback(() => manager?.pause(), [manager]);
  const stop = useCallback(() => manager?.stop(), [manager]);
  const setSize = useCallback((w: number, h: number) => manager?.setSize(w, h), [manager]);
  const setTimeScale = useCallback((scale: number) => manager?.setTimeScale(scale), [manager]);
  const getDelta = useCallback(() => manager?.getDelta() || 0, [manager]);
  const getElapsedTime = useCallback(() => manager?.getElapsedTime() || 0, [manager]);

  return useMemo(
    () => ({
      manager,
      renderer: manager?.getRenderer() || null,
      scene: manager?.getScene() || null,
      camera: manager?.getCamera() || null,
      canvas: manager?.getRenderer().getCanvas() || null,
      width,
      height,
      isPlaying: manager?.isActive() || false,
      isSupported,
      prefersReducedMotion,
      play,
      pause,
      stop,
      setSize,
      setTimeScale,
      getDelta,
      getElapsedTime,
    }),
    [
      manager,
      width,
      height,
      isSupported,
      prefersReducedMotion,
      play,
      pause,
      stop,
      setSize,
      setTimeScale,
      getDelta,
      getElapsedTime,
    ]
  );
}

export interface UseFrameOptions {
  enabled?: boolean;
  priority?: number;
}

export function useFrame(
  callback: (delta: number, elapsed: number, manager: SceneManager) => void,
  options: UseFrameOptions = {}
): void {
  const { enabled = true } = options;
  const { manager } = useThree();

  useEffect(() => {
    if (!enabled || !manager) return;

    const animate = () => {
      if (!manager.isActive()) return;
      callback(manager.getDelta(), manager.getElapsedTime(), manager);
    };

    manager.onBeforeRender = animate;
    manager.play();

    return () => {
      manager.onBeforeRender = undefined;
      manager.pause();
    };
  }, [callback, enabled, manager]);
}

export function useRenderLoop(
  callback: (delta: number, elapsed: number) => void,
  enabled = true
): void {
  const { manager, isPlaying } = useThree();

  useEffect(() => {
    if (!enabled || !manager || !isPlaying) return;

    const animate = () => {
      if (!manager.isActive()) return;
      callback(manager.getDelta(), manager.getElapsedTime());
    };

    manager.onBeforeRender = animate;
    manager.play();

    return () => {
      manager.onBeforeRender = undefined;
      manager.pause();
    };
  }, [manager, isPlaying, enabled, callback]);
}

export function useLoader<T>(
  loader: THREE.Loader,
  url: string | string[],
  onProgress?: (event: ProgressEvent) => void
): T | null {
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    if (!url) return;

    const loadUrl = Array.isArray(url) ? url[0] : url;

    loader.load(
      loadUrl,
      (data) => {
        setResult(data as T);
      },
      onProgress,
      (err) => {
        console.error('Loader error:', err);
      }
    );
  }, [url, loader, onProgress]);

  return result;
}

export function useTexture(
  url: string | string[],
  options: {
    mapping?: THREE.Mapping;
    wrapS?: THREE.Wrapping;
    wrapT?: THREE.Wrapping;
    minFilter?: THREE.TextureFilter;
    magFilter?: THREE.TextureFilter;
    format?: THREE.PixelFormat;
    type?: THREE.TextureDataType;
    anisotropy?: number;
    colorSpace?: THREE.ColorSpace;
  } = {}
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const loader = useMemo(() => new THREE.TextureLoader(), []);

  useEffect(() => {
    if (!url) return;

    const loadUrl = Array.isArray(url) ? url[0] : url;

    loader.load(loadUrl, (tex) => {
      Object.assign(tex, options);
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, [url, loader, options]);

  return texture;
}

export function useCubeTexture(
  urls: string[],
  options: {
    mapping?: THREE.Mapping;
    wrapS?: THREE.Wrapping;
    wrapT?: THREE.Wrapping;
    minFilter?: THREE.TextureFilter;
    magFilter?: THREE.TextureFilter;
    format?: THREE.PixelFormat;
    type?: THREE.TextureDataType;
    anisotropy?: number;
    colorSpace?: THREE.ColorSpace;
  } = {}
): THREE.CubeTexture | null {
  const [texture, setTexture] = useState<THREE.CubeTexture | null>(null);
  const loader = useMemo(() => new THREE.CubeTextureLoader(), []);

  useEffect(() => {
    if (!urls || urls.length !== 6) return;

    loader.load(urls, (tex) => {
      Object.assign(tex, options);
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, [urls, loader, options]);

  return texture;
}

export function useMaterial<T extends THREE.Material>(
  material: T,
  properties: Partial<T> = {}
): T {
  useEffect(() => {
    Object.assign(material, properties);
    material.needsUpdate = true;
  }, [material, properties]);

  return material;
}

export function useGeometry<T extends THREE.BufferGeometry>(
  geometry: T,
  attributes: Record<string, THREE.BufferAttribute | THREE.InterleavedBufferAttribute> = {}
): T {
  useEffect(() => {
    Object.entries(attributes).forEach(([name, attribute]) => {
      geometry.setAttribute(name, attribute);
    });
    geometry.attributes.position?.needsUpdate = true;
  }, [geometry, attributes]);

  return geometry;
}

export function useAnimation(
  mixer: THREE.AnimationMixer,
  clips: THREE.AnimationClip[],
  actionName: string,
  options: {
    loop?: THREE.LoopMode;
    clampWhenFinished?: boolean;
    timeScale?: number;
    weight?: number;
  } = {}
): THREE.AnimationAction | null {
  const [action, setAction] = useState<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (!mixer || !clips.length) return;

    const clip = clips.find((c) => c.name === actionName);
    if (!clip) return;

    const newAction = mixer.clipAction(clip);
    newAction.loop = options.loop ?? THREE.LoopRepeat;
    newAction.clampWhenFinished = options.clampWhenFinished ?? false;
    newAction.timeScale = options.timeScale ?? 1;
    newAction.setEffectiveWeight(options.weight ?? 1);
    newAction.play();

    setAction(newAction);

    return () => {
      newAction.stop();
      newAction.weight = 0;
    };
  }, [mixer, clips, actionName, options]);

  return action;
}

export function useControls(
  controls: THREE.OrbitControls | THREE.PointerLockControls | Record<string, unknown>,
  enabled = true
): void {
  useEffect(() => {
    if (!controls) return;

    controls.enabled = enabled;

    return () => {
      controls.enabled = false;
    };
  }, [controls, enabled]);
}

export function useRaycaster(
  camera: THREE.Camera,
  objects: THREE.Object3D[],
  onIntersect?: (intersects: THREE.Intersection[]) => void,
  onClear?: () => void
): { raycast: (mouse: THREE.Vector2) => THREE.Intersection[] } {
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const raycast = useCallback(
    (mouse: THREE.Vector2) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objects, true);

      if (intersects.length > 0) {
        onIntersect?.(intersects);
      } else {
        onClear?.();
      }

      return intersects;
    },
    [raycaster, camera, objects, onIntersect, onClear]
  );

  return { raycast };
}

export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): React.RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}