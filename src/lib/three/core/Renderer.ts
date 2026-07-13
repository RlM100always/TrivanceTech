import * as THREE from 'three';

export interface RendererOptions {
  antialias?: boolean;
  alpha?: boolean;
  pixelRatio?: number;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
  canvas?: HTMLCanvasElement;
  context?: WebGL2RenderingContext | WebGLRenderingContext | null;
  logarithmicDepthBuffer?: boolean;
  stencil?: boolean;
  depth?: boolean;
}

export interface Renderer extends THREE.WebGLRenderer {
  getCanvas(): HTMLCanvasElement;
  getContext(): WebGL2RenderingContext | WebGLRenderingContext;
  getSize(): { width: number; height: number };
  getPixelRatio(): number;
}

export function createRenderer(options: RendererOptions = {}): Renderer {
  const {
    antialias = true,
    alpha = true,
    pixelRatio = getDevicePixelRatio(),
    preserveDrawingBuffer = false,
    powerPreference = 'high-performance',
    failIfMajorPerformanceCaveat = false,
    canvas,
    context,
    logarithmicDepthBuffer = false,
    stencil = false,
    depth = true,
  } = options;

  const renderer = new THREE.WebGLRenderer({
    antialias,
    alpha,
    preserveDrawingBuffer,
    powerPreference,
    failIfMajorPerformanceCaveat,
    canvas,
    context,
    logarithmicDepthBuffer,
    stencil,
    depth,
  }) as Renderer;

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.autoClear = true;

  return renderer;
}

export function checkWebGLSupport(): { supported: boolean; reason?: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      return { supported: false, reason: 'WebGL not supported' };
    }
    return { supported: true };
  } catch {
    return { supported: false, reason: 'WebGL context creation failed' };
  }
}

export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio, 2);
}

export function getMaxTextureSize(): number {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 2048;
  return gl.getParameter(gl.MAX_TEXTURE_SIZE);
}

export function getMaxAnisotropy(): number {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 1;
  const ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  if (!ext) return 1;
  return gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function getGPUInfo(): { vendor: string; renderer: string } | null {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return null;
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return null;
  return {
    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown',
    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown',
  };
}