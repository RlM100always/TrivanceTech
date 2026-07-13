import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface PostProcessingOptions {
  enableBloom?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  enableFXAA?: boolean;
  enableSMAA?: boolean;
  enableOutputPass?: boolean;
  renderTargetOptions?: THREE.WebGLRenderTargetOptions;
}

export interface ComposerPasses {
  composer: EffectComposer;
  renderPass: RenderPass;
  bloomPass?: UnrealBloomPass;
  fxaaPass?: FXAAPass;
  smaaPass?: SMAAPass;
  outputPass?: OutputPass;
}

export function createEffectComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  options: PostProcessingOptions = {}
): ComposerPasses {
  const {
    enableBloom = false,
    bloomStrength = 1.5,
    bloomRadius = 0.4,
    bloomThreshold = 0.85,
    enableFXAA = false,
    enableSMAA = false,
    enableOutputPass = true,
    renderTargetOptions = {},
  } = options;

  const renderTarget = new THREE.WebGLRenderTarget(
    renderer.domElement.width,
    renderer.domElement.height,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      encoding: THREE.sRGBEncoding,
      ...renderTargetOptions,
    }
  );

  const composer = new EffectComposer(renderer, renderTarget);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  let bloomPass: UnrealBloomPass | undefined;
  if (enableBloom) {
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(renderer.domElement.width, renderer.domElement.height),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );
    composer.addPass(bloomPass);
  }

  let fxaaPass: FXAAPass | undefined;
  if (enableFXAA) {
    fxaaPass = new FXAAPass(
      renderer.domElement.clientWidth,
      renderer.domElement.clientHeight
    );
    composer.addPass(fxaaPass);
  }

  let smaaPass: SMAAPass | undefined;
  if (enableSMAA) {
    smaaPass = new SMAAPass(
      renderer.domElement.clientWidth * renderer.getPixelRatio(),
      renderer.domElement.clientHeight * renderer.getPixelRatio()
    );
    composer.addPass(smaaPass);
  }

  let outputPass: OutputPass | undefined;
  if (enableOutputPass) {
    outputPass = new OutputPass();
    composer.addPass(outputPass);
  }

  return { composer, renderPass, bloomPass, fxaaPass, smaaPass, outputPass };
}

export function resizeComposer(composer: EffectComposer, width: number, height: number): void {
  composer.setSize(width, height);
  composer.passes.forEach((pass) => {
    if (pass.setSize) {
      pass.setSize(width, height);
    }
  });
}

export function updateBloomPass(bloomPass: UnrealBloomPass, options: {
  strength?: number;
  radius?: number;
  threshold?: number;
}): void {
  if (options.strength !== undefined) bloomPass.strength = options.strength;
  if (options.radius !== undefined) bloomPass.radius = options.radius;
  if (options.threshold !== undefined) bloomPass.threshold = options.threshold;
}

export const vignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.5 },
    darkness: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float dist = distance(vUv, vec2(0.5));
      color.rgb *= smoothstep(offset, offset + darkness, dist);
      gl_FragColor = color;
    }
  `,
};

export const filmShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    nIntensity: { value: 0.5 },
    sIntensity: { value: 0.05 },
    sCount: { value: 4096 },
    grayscale: { value: false },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float nIntensity;
    uniform float sIntensity;
    uniform float sCount;
    uniform bool grayscale;
    varying vec2 vUv;
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      if (grayscale) {
        color.rgb = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
      }
      vec2 noiseCoord = vUv * sCount;
      float noise = rand(noiseCoord + time) * nIntensity;
      color.rgb += noise;
      vec2 scanlines = vUv * sCount;
      float scanline = sin(scanlines.y + time * 10.0) * sIntensity;
      color.rgb += scanline;
      gl_FragColor = color;
    }
  `,
};

export const chromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: new THREE.Vector2(0.001, 0.001) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 offset;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec3 color = vec4 r = texture2D(tDiffuse, uv + offset);
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, uv - offset);
      gl_FragColor = vec4(r.r, g.g, b.b, g.a);
    }
  `,
};

export const radialBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    strength: { value: 0.02 },
    radius: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 center;
    uniform float strength;
    uniform float radius;
    varying vec2 vUv;
    void main() {
      vec2 direction = vUv - center;
      float dist = length(direction);
      if (dist > radius) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }
      vec4 color = vec4(0.0);
      float samples = 10.0;
      for (int i = 0; i < 10; i++) {
        float t = float(i) / samples;
        vec2 offset = direction * strength * t;
        color += texture2D(tDiffuse, vUv + offset);
      }
      color /= samples;
      gl_FragColor = color;
    }
  `,
};

export const depthOfFieldShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    focus: { value: 1.0 },
    aperture: { value: 0.025 },
    maxBlur: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float focus;
    uniform float aperture;
    uniform float maxBlur;
    varying vec2 vUv;
    float getDepth(vec2 uv) {
      return texture2D(tDepth, uv).r;
    }
    void main() {
      float depth = getDepth(vUv);
      float coc = abs(depth - focus) * aperture;
      coc = clamp(coc, 0.0, maxBlur);
      vec4 color = vec4(0.0);
      float totalWeight = 0.0;
      for (int x = -3; x <= 3; x++) {
        for (int y = -3; y <= 3; y++) {
          vec2 offset = vec2(float(x), float(y)) * coc * 0.01;
          float sampleDepth = getDepth(vUv + offset);
          float weight = abs(sampleDepth - focus) < aperture ? 1.0 : 0.5;
          color += texture2D(tDiffuse, vUv + offset) * weight;
          totalWeight += weight;
        }
      }
      gl_FragColor = color / totalWeight;
    }
  `,
};

export interface ShaderDefinition {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;
}

export function createShaderPass(shader: ShaderDefinition, uniforms: Record<string, unknown> = {}): ShaderPass {
  const pass = new ShaderPass(shader as { uniforms: Record<string, { value: unknown }>; vertexShader: string; fragmentShader: string });
  Object.keys(uniforms).forEach((key) => {
    pass.uniforms[key].value = uniforms[key];
  });
  return pass;
}