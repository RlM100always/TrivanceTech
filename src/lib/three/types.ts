import * as THREE from 'three';

export type ThreeVector2 = THREE.Vector2;
export type ThreeVector3 = THREE.Vector3;
export type ThreeVector4 = THREE.Vector4;
export type ThreeColor = THREE.Color;
export type ThreeQuaternion = THREE.Quaternion;
export type ThreeEuler = THREE.Euler;
export type ThreeMatrix3 = THREE.Matrix3;
export type ThreeMatrix4 = THREE.Matrix4;
export type ThreeBox3 = THREE.Box3;
export type ThreeSphere = THREE.Sphere;
export type ThreePlane = THREE.Plane;
export type ThreeRaycaster = THREE.Raycaster;
export type ThreeRay = THREE.Ray;
export type ThreeIntersection = THREE.Intersection;
export type ThreeIntersectionObject = THREE.IntersectionObject;
export type ThreeFrustum = THREE.Frustum;
export type ThreeTriangle = THREE.Triangle;
export type ThreeClock = THREE.Clock;

export type ThreeScene = THREE.Scene;
export type ThreeCamera = THREE.Camera;
export type ThreePerspectiveCamera = THREE.PerspectiveCamera;
export type ThreeOrthographicCamera = THREE.OrthographicCamera;
export type ThreeRenderer = THREE.WebGLRenderer;
export type ThreeRenderTarget = THREE.WebGLRenderTarget;
export type ThreeTexture = THREE.Texture;
export type ThreeCubeTexture = THREE.CubeTexture;
export type ThreeMaterial = THREE.Material;
export type ThreeMeshBasicMaterial = THREE.MeshBasicMaterial;
export type ThreeMeshStandardMaterial = THREE.MeshStandardMaterial;
export type ThreeMeshPhysicalMaterial = THREE.MeshPhysicalMaterial;
export type ThreeMeshPhongMaterial = THREE.MeshPhongMaterial;
export type ThreeMeshLambertMaterial = THREE.MeshLambertMaterial;
export type ThreeMeshToonMaterial = THREE.MeshToonMaterial;
export type ThreeMeshNormalMaterial = THREE.MeshNormalMaterial;
export type ThreeMeshDepthMaterial = THREE.MeshDepthMaterial;
export type ThreeShaderMaterial = THREE.ShaderMaterial;
export type ThreeRawShaderMaterial = THREE.RawShaderMaterial;
export type ThreePointsMaterial = THREE.PointsMaterial;
export type ThreeSpriteMaterial = THREE.SpriteMaterial;
export type ThreeLineBasicMaterial = THREE.LineBasicMaterial;
export type ThreeLineDashedMaterial = THREE.LineDashedMaterial;
export type ThreeGeometry = THREE.BufferGeometry;
export type ThreeBufferGeometry = THREE.BufferGeometry;
export type ThreeObject3D = THREE.Object3D;
export type ThreeMesh = THREE.Mesh;
export type ThreePoints = THREE.Points;
export type ThreeLine = THREE.Line;
export type ThreeLineLoop = THREE.LineLoop;
export type ThreeLineSegments = THREE.LineSegments;
export type ThreeSprite = THREE.Sprite;
export type ThreeGroup = THREE.Group;
export type ThreeLight = THREE.Light;
export type ThreeDirectionalLight = THREE.DirectionalLight;
export type ThreePointLight = THREE.PointLight;
export type ThreeSpotLight = THREE.SpotLight;
export type ThreeAmbientLight = THREE.AmbientLight;
export type ThreeHemisphereLight = THREE.HemisphereLight;
export type ThreeRectAreaLight = THREE.RectAreaLight;
export type ThreeLightShadow = THREE.LightShadow;
export type ThreeAnimationMixer = THREE.AnimationMixer;
export type ThreeAnimationAction = THREE.AnimationAction;
export type ThreeAnimationClip = THREE.AnimationClip;
export type ThreeKeyframeTrack = THREE.KeyframeTrack;
export type ThreePropertyBinding = THREE.PropertyBinding;
export type ThreeOrbitControls = unknown;
export type ThreePointerLockControls = unknown;
export type ThreeTransformControls = unknown;
export type ThreeDragControls = unknown;
export type ThreeEffectComposer = unknown;
export type ThreeRenderPass = unknown;
export type ThreeUnrealBloomPass = unknown;
export type ThreeFXAAPass = unknown;
export type ThreeSMAAPass = unknown;
export type ThreeOutputPass = unknown;
export type ThreeShaderPass = unknown;
export type ThreePostProcessingPass = unknown;

export interface ThreeInitOptions {
  container: HTMLElement;
  width?: number;
  height?: number;
  pixelRatio?: number;
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
}

export interface ThreeSceneOptions {
  background?: THREE.ColorRepresentation;
  fog?: THREE.Fog | THREE.FogExp2;
  autoUpdate?: boolean;
}

export interface ThreeCameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  position?: THREE.Vector3 | [number, number, number];
  target?: THREE.Vector3 | [number, number, number];
  up?: THREE.Vector3 | [number, number, number];
}

export interface ThreeRendererOptions {
  canvas?: HTMLCanvasElement;
  context?: WebGL2RenderingContext | WebGLRenderingContext | null;
  antialias?: boolean;
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  logarithmicDepthBuffer?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
  pixelRatio?: number;
}

export interface ThreeComposerOptions {
  width: number;
  height: number;
  renderTargetOptions?: THREE.WebGLRenderTargetOptions;
}

export interface ThreeBloomOptions {
  strength: number;
  radius: number;
  threshold: number;
}

export interface ThreeFXAAOptions {
  width: number;
  height: number;
}

export interface ThreeSMAAOptions {
  width: number;
  height: number;
}

export interface ThreeControlsOptions {
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  minZoom?: number;
  maxZoom?: number;
  enablePan?: boolean;
  panSpeed?: number;
  enableRotate?: boolean;
  rotateSpeed?: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  target?: THREE.Vector3;
}

export interface ThreePostProcessingOptions {
  enableBloom?: boolean;
  bloomOptions?: ThreeBloomOptions;
  enableFXAA?: boolean;
  fxaaOptions?: ThreeFXAAOptions;
  enableSMAA?: boolean;
  smaaOptions?: ThreeSMAAOptions;
  enableOutputPass?: boolean;
}

export interface ThreeLoaderOptions {
  manager?: THREE.LoadingManager;
  path?: string;
  resourcePath?: string;
  crossOrigin?: string;
  withCredentials?: string;
  requestHeader?: Record<string, string>;
}

export interface ThreeTextureOptions {
  mapping?: THREE.Mapping;
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  magFilter?: THREE.TextureFilter;
  minFilter?: THREE.TextureFilter;
  anisotropy?: number;
  format?: THREE.PixelFormat;
  type?: THREE.TextureDataType;
  encoding?: THREE.TextureEncoding;
  colorSpace?: THREE.ColorSpace;
  offset?: THREE.Vector2;
  repeat?: THREE.Vector2;
  center?: THREE.Vector2;
  rotation?: number;
  generateMipmaps?: boolean;
  premultiplyAlpha?: boolean;
  flipY?: boolean;
  unpackAlignment?: number;
}

export interface ThreeMaterialOptions {
  color?: THREE.ColorRepresentation;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  depthWrite?: boolean;
  depthTest?: boolean;
  blending?: THREE.Blending;
  blendingSrcFactor?: THREE.BlendingDstFactor;
  blendingDstFactor?: THREE.BlendingSrcFactor;
  blendingEquation?: THREE.BlendingEquation;
  stencilWrite?: boolean;
  stencilRef?: number;
  stencilFunc?: THREE.StencilFunc;
  stencilFail?: THREE.StencilOp;
  stencilZFail?: THREE.StencilOp;
  stencilZPass?: THREE.StencilOp;
  clipShadows?: boolean;
  clipIntersection?: boolean;
  clipShadows?: boolean;
  shadowSide?: THREE.ShadowSide;
  wireframe?: boolean;
  wireframeLinewidth?: number;
  wireframeLinecap?: string;
  wireframeLinejoin?: string;
  flatShading?: boolean;
  vertexColors?: boolean;
  vertexTangents?: boolean;
  alphaTest?: number;
  visible?: boolean;
  toneMapped?: boolean;
  userData?: Record<string, unknown>;
}

export interface ThreeGeometryOptions {
  attributes?: Record<string, THREE.BufferAttribute | THREE.InterleavedBufferAttribute>;
  index?: THREE.BufferAttribute;
  groups?: THREE.Group[];
  boundingBox?: THREE.Box3;
  boundingSphere?: THREE.Sphere;
  drawRange?: { start: number; count: number };
  userData?: Record<string, unknown>;
}

export interface ThreeAnimationOptions {
  loop?: THREE.LoopMode;
  clampWhenFinished?: boolean;
  timeScale?: number;
  weight?: number;
  repetitions?: number;
  zeroSlopeAtEnd?: boolean;
  zeroSlopeAtStart?: boolean;
}

export interface ThreeRaycasterOptions {
  near?: number;
  far?: number;
  layers?: THREE.Layers;
  linePrecision?: number;
  pointPrecision?: number;
}

export interface ThreeIntersectionOptions {
  object?: THREE.Object3D;
  distance?: number;
  point?: THREE.Vector3;
  index?: number;
  face?: THREE.Face3;
  faceIndex?: number;
  uv?: THREE.Vector2;
  normal?: THREE.Vector3;
  instanceId?: number;
}

export interface ThreeEventMap {
  click: THREE.Event & { object: THREE.Object3D };
  dblclick: THREE.Event & { object: THREE.Object3D };
  mousedown: THREE.Event & { object: THREE.Object3D };
  mouseup: THREE.Event & { object: THREE.Object3D };
  mouseover: THREE.Event & { object: THREE.Object3D };
  mouseout: THREE.Event & { object: THREE.Object3D };
  mousemove: THREE.Event & { object: THREE.Object3D };
  wheel: THREE.Event & { object: THREE.Object3D };
  contextmenu: THREE.Event & { object: THREE.Object3D };
  touchstart: THREE.Event & { object: THREE.Object3D };
  touchend: THREE.Event & { object: THREE.Object3D };
  touchmove: THREE.Event & { object: THREE.Object3D };
  pointerdown: THREE.Event & { object: THREE.Object3D };
  pointerup: THREE.Event & { object: THREE.Object3D };
  pointermove: THREE.Event & { object: THREE.Object3D };
  pointerover: THREE.Event & { object: THREE.Object3D };
  pointerout: THREE.Event & { object: THREE.Object3D };
  pointerenter: THREE.Event & { object: THREE.Object3D };
  pointerleave: THREE.Event & { object: THREE.Object3D };
  lostpointercapture: THREE.Event & { object: THREE.Object3D };
  gotpointercapture: THREE.Event & { object: THREE.Object3D };
}

export type ThreeEventType = keyof ThreeEventMap;

export interface ThreeEventListenerOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

export interface ThreeRendererCapabilities {
  maxAnisotropy: number;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  maxVaryings: number;
  maxTextureImageUnits: number;
  maxVertexTextureImageUnits: number;
  maxCombinedTextureImageUnits: number;
  maxCubeTextureSize: number;
  maxRenderBufferSize: number;
  vertexTextures: boolean;
  floatFragmentTextures: boolean;
  floatVertexTextures: boolean;
  standardDerivatives: boolean;
  vertexArrayObject: boolean;
  instancedArrays: boolean;
  drawBuffers: boolean;
  depthTexture: boolean;
  floatTextures: boolean;
  halfFloatTextures: boolean;
  s3tc: boolean;
  etc1: boolean;
  etc2: boolean;
  astc: boolean;
  bppt: boolean;
  gpuDetected: boolean;
  gpuRenderer: string;
  gpuVendor: string;
  gpuVersion: string;
  gpuShadingLanguageVersion: string;
  mobileGPU: boolean;
}

export interface ThreePerformanceMetrics {
  fps: number;
  ms: number;
  triangles: number;
  points: number;
  lines: number;
  drawCalls: number;
  textures: number;
  frameTime: number;
  memory: {
    geometries: number;
    textures: number;
  };
}

export interface ThreeViewportOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ThreeScissorOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ThreeClearOptions {
  color?: boolean;
  depth?: boolean;
  stencil?: boolean;
}

export interface ThreeRenderOptions {
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  renderTarget?: THREE.WebGLRenderTarget | null;
  forceClear?: boolean;
}

export interface ThreeAnimationLoopOptions {
  onStart?: () => void;
  onStop?: () => void;
  onError?: (error: Error) => void;
}

export interface ThreeAssetLoadOptions {
  onProgress?: (url: string, loaded: number, total: number) => void;
  onError?: (url: string, error: Error) => void;
  onLoad?: (assets: Map<string, unknown>) => void;
}

export interface ThreeDisposeOptions {
  disposeGeometries?: boolean;
  disposeMaterials?: boolean;
  disposeTextures?: boolean;
  disposeRenderTargets?: boolean;
  forceContextLoss?: boolean;
}

export type ThreeColorRepresentation = THREE.ColorRepresentation;
export type ThreeTextureEncoding = THREE.TextureEncoding;
export type ThreeTextureDataType = THREE.TextureDataType;
export type ThreePixelFormat = THREE.PixelFormat;
export type ThreeWrappingMode = THREE.Wrapping;
export type ThreeTextureFilter = THREE.TextureFilter;
export type ThreeBlending = THREE.Blending;
export type ThreeBlendingFactor = THREE.BlendingDstFactor | THREE.BlendingSrcFactor;
export type ThreeBlendingEquation = THREE.BlendingEquation;
export type ThreeDepthMode = THREE.DepthMode;
export type ThreeStencilFunc = THREE.StencilFunc;
export type ThreeStencilOp = THREE.StencilOp;
export type ThreeSide = THREE.Side;
export type ThreeShadowSide = THREE.ShadowSide;
export type ThreeCullFace = THREE.CullFace;
export type ThreeFrontFaceDirection = THREE.FrontFaceDirection;
export type ThreeColorSpace = THREE.ColorSpace;
export type ThreeToneMapping = THREE.ToneMapping;
export type ThreeLoopMode = THREE.LoopMode;
export type ThreeInterpolationMode = THREE.InterpolationMode;

export const ThreeConstants = {
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  DoubleSide: THREE.DoubleSide,
  NoBlending: THREE.NoBlending,
  NormalBlending: THREE.NormalBlending,
  AdditiveBlending: THREE.AdditiveBlending,
  SubtractiveBlending: THREE.SubtractiveBlending,
  MultiplyBlending: THREE.MultiplyBlending,
  CustomBlending: THREE.CustomBlending,
  ZeroFactor: THREE.ZeroFactor,
  OneFactor: THREE.OneFactor,
  SrcColorFactor: THREE.SrcColorFactor,
  OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
  SrcAlphaFactor: THREE.SrcAlphaFactor,
  OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
  DstAlphaFactor: THREE.DstAlphaFactor,
  OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
  DstColorFactor: THREE.DstColorFactor,
  OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
  SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
  AddEquation: THREE.AddEquation,
  SubtractEquation: THREE.SubtractEquation,
  ReverseSubtractEquation: THREE.ReverseSubtractEquation,
  MinEquation: THREE.MinEquation,
  MaxEquation: THREE.MaxEquation,
  NeverDepth: THREE.NeverDepth,
  AlwaysDepth: THREE.AlwaysDepth,
  LessDepth: THREE.LessDepth,
  LessEqualDepth: THREE.LessEqualDepth,
  GreaterEqualDepth: THREE.GreaterEqualDepth,
  GreaterDepth: THREE.GreaterDepth,
  NotEqualDepth: THREE.NotEqualDepth,
  KeepStencilOp: THREE.KeepStencilOp,
  ZeroStencilOp: THREE.ZeroStencilOp,
  ReplaceStencilOp: THREE.ReplaceStencilOp,
  IncrementStencilOp: THREE.IncrementStencilOp,
  DecrementStencilOp: THREE.DecrementStencilOp,
  IncrementWrapStencilOp: THREE.IncrementWrapStencilOp,
  DecrementWrapStencilOp: THREE.DecrementWrapStencilOp,
  InvertStencilOp: THREE.InvertStencilOp,
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  DoubleSide: THREE.DoubleSide,
  FlatShading: THREE.FlatShading,
  SmoothShading: THREE.SmoothShading,
  NoColors: THREE.NoColors,
  FaceColors: THREE.FaceColors,
  VertexColors: THREE.VertexColors,
  UVMapping: THREE.UVMapping,
  CubeReflectionMapping: THREE.CubeReflectionMapping,
  CubeRefractionMapping: THREE.CubeRefractionMapping,
  EquirectangularReflectionMapping: THREE.EquirectangularReflectionMapping,
  EquirectangularRefractionMapping: THREE.EquirectangularRefractionMapping,
  CubeUVReflectionMapping: THREE.CubeUVReflectionMapping,
  RepeatWrapping: THREE.RepeatWrapping,
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
  NearestFilter: THREE.NearestFilter,
  NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
  NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
  LinearFilter: THREE.LinearFilter,
  LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
  LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
  UnsignedByteType: THREE.UnsignedByteType,
  ByteType: THREE.ByteType,
  ShortType: THREE.ShortType,
  UnsignedShortType: THREE.UnsignedShortType,
  IntType: THREE.IntType,
  UnsignedIntType: THREE.UnsignedIntType,
  FloatType: THREE.FloatType,
  HalfFloatType: THREE.HalfFloatType,
  UnsignedShort4444Type: THREE.UnsignedShort4444Type,
  UnsignedShort5551Type: THREE.UnsignedShort5551Type,
  UnsignedShort565Type: THREE.UnsignedShort565Type,
  UnsignedInt248Type: THREE.UnsignedInt248Type,
  AlphaFormat: THREE.AlphaFormat,
  RGBFormat: THREE.RGBFormat,
  RGBAFormat: THREE.RGBAFormat,
  LuminanceFormat: THREE.LuminanceFormat,
  LuminanceAlphaFormat: THREE.LuminanceAlphaFormat,
  RGBEFormat: THREE.RGBEFormat,
  RGBMFormat: THREE.RGBMFormat,
  RGBA_ASTC_4x4_Format: THREE.RGBA_ASTC_4x4_Format,
  RGBA_ASTC_5x4_Format: THREE.RGBA_ASTC_5x4_Format,
  RGBA_ASTC_5x5_Format: THREE.RGBA_ASTC_5x5_Format,
  RGBA_ASTC_6x5_Format: THREE.RGBA_ASTC_6x5_Format,
  RGBA_ASTC_6x6_Format: THREE.RGBA_ASTC_6x6_Format,
  RGBA_ASTC_8x5_Format: THREE.RGBA_ASTC_8x5_Format,
  RGBA_ASTC_8x6_Format: THREE.RGBA_ASTC_8x6_Format,
  RGBA_ASTC_8x8_Format: THREE.RGBA_ASTC_8x8_Format,
  RGBA_ASTC_10x5_Format: THREE.RGBA_ASTC_10x5_Format,
  RGBA_ASTC_10x6_Format: THREE.RGBA_ASTC_10x6_Format,
  RGBA_ASTC_10x8_Format: THREE.RGBA_ASTC_10x8_Format,
  RGBA_ASTC_10x10_Format: THREE.RGBA_ASTC_10x10_Format,
  RGBA_ASTC_12x10_Format: THREE.RGBA_ASTC_12x10_Format,
  RGBA_ASTC_12x12_Format: THREE.RGBA_ASTC_12x12_Format,
  SRGBColorSpace: THREE.SRGBColorSpace,
  LinearSRGBColorSpace: THREE.LinearSRGBColorSpace,
  NoToneMapping: THREE.NoToneMapping,
  LinearToneMapping: THREE.LinearToneMapping,
  ReinhardToneMapping: THREE.ReinhardToneMapping,
  CineonToneMapping: THREE.CineonToneMapping,
  ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
  CustomToneMapping: THREE.CustomToneMapping,
  LoopOnce: THREE.LoopOnce,
  LoopRepeat: THREE.LoopRepeat,
  LoopPingPong: THREE.LoopPingPong,
  InterpolateDiscrete: THREE.InterpolateDiscrete,
  InterpolateLinear: THREE.InterpolateLinear,
  InterpolateSmooth: THREE.InterpolateSmooth,
} as const;