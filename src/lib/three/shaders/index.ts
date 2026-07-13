export const basicVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const basicFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform vec3 color;
  uniform float opacity;
  uniform float time;
  
  void main() {
    vec3 finalColor = color;
    float alpha = opacity;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const particleVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float customOpacity;
  attribute float rotation;
  attribute float velocity;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vRotation;
  varying vec2 vUv;
  
  uniform float time;
  uniform float pixelRatio;
  uniform vec3 gravity;
  uniform float lifeTime;
  
  void main() {
    vUv = uv;
    vColor = customColor;
    vOpacity = customOpacity;
    vRotation = rotation;
    
    vec3 pos = position;
    pos.y += velocity * time;
    pos += gravity * time * time * 0.5;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  varying float vRotation;
  varying vec2 vUv;
  
  uniform sampler2D pointTexture;
  uniform float time;
  
  void main() {
    vec2 rotatedUv = vUv - 0.5;
    float cosR = cos(vRotation + time * 0.5);
    float sinR = sin(vRotation + time * 0.5);
    rotatedUv = vec2(
      rotatedUv.x * cosR - rotatedUv.y * sinR,
      rotatedUv.x * sinR + rotatedUv.y * cosR
    ) + 0.5;
    
    vec4 textureColor = texture2D(pointTexture, rotatedUv);
    float alpha = textureColor.a * vOpacity;
    
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const meshVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  
  uniform float time;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vViewPosition = (viewMatrix * worldPosition).xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const meshFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  
  uniform vec3 baseColor;
  uniform float roughness;
  uniform float metalness;
  uniform float opacity;
  uniform float time;
  uniform vec3 cameraPosition;
  
  #define PI 3.14159265359
  
  vec3 getNormal() {
    return normalize(vNormal);
  }
  
  float distributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    float num = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    return num / denom;
  }
  
  float geometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;
    float denom = NdotV * (1.0 - k) + k;
    return 1.0 / denom;
  }
  
  float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = geometrySchlickGGX(NdotV, roughness);
    float ggx1 = geometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
  }
  
  vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
  }
  
  void main() {
    vec3 N = getNormal();
    vec3 V = normalize(cameraPosition - vWorldPosition);
    
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, baseColor, metalness);
    
    vec3 Lo = vec3(0.0);
    
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 lightColor = vec3(1.0);
    vec3 H = normalize(V + lightDir);
    float NdotL = max(dot(N, lightDir), 0.0);
    
    if (NdotL > 0.0) {
      float D = distributionGGX(N, H, roughness);
      float G = geometrySmith(N, V, lightDir, roughness);
      vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
      
      vec3 numerator = D * G * F;
      float denominator = 4.0 * max(dot(N, V), 0.0) * max(NdotL, 0.0) + 0.001;
      vec3 specular = numerator / denominator;
      
      vec3 kS = F;
      vec3 kD = vec3(1.0) - kS;
      kD *= 1.0 - metalness;
      
      Lo += (kD * baseColor / PI + specular) * lightColor * NdotL;
    }
    
    vec3 ambient = vec3(0.03) * baseColor * (1.0 - metalness);
    vec3 color = ambient + Lo;
    
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(color, opacity);
  }
`;

export const glowVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const glowFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform vec3 glowColor;
  uniform float glowIntensity;
  uniform float glowRadius;
  uniform float time;
  uniform vec3 cameraPosition;
  
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    float intensity = glowIntensity * (1.0 + pulse * 0.3);
    vec3 color = glowColor * fresnel * intensity;
    float alpha = fresnel * intensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export const hologramVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vScanline;
  
  uniform float time;
  uniform float scanlineSpeed;
  uniform float scanlineIntensity;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vScanline = sin(vWorldPosition.y * 50.0 + time * scanlineSpeed) * scanlineIntensity;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const hologramFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vScanline;
  
  uniform vec3 hologramColor;
  uniform float opacity;
  uniform float time;
  uniform float flickerSpeed;
  uniform float flickerIntensity;
  uniform vec3 cameraPosition;
  
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
    
    float flicker = sin(time * flickerSpeed * 10.0) * flickerIntensity + 1.0 - flickerIntensity;
    float scanline = vScanline * 0.5 + 0.5;
    
    float alpha = fresnel * opacity * flicker * scanline;
    vec3 color = hologramColor * (1.0 + fresnel * 0.5);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const waterVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  
  uniform float time;
  uniform float waveSpeed;
  uniform float waveHeight;
  uniform int waveCount;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    float wave = 0.0;
    for (int i = 1; i <= 5; i++) {
      float freq = float(i) * 2.0;
      float amp = waveHeight / float(i);
      wave += sin(vWorldPosition.x * freq + time * waveSpeed * float(i)) * amp;
      wave += sin(vWorldPosition.z * freq + time * waveSpeed * float(i)) * amp;
    }
    vWorldPosition.y += wave;
    
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
  }
`;

export const waterFragmentShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  
  uniform vec3 waterColor;
  uniform vec3 deepWaterColor;
  uniform float transparency;
  uniform float time;
  uniform float refractionStrength;
  uniform vec3 cameraPosition;
  uniform sampler2D noiseTexture;
  
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    
    vec2 noiseUv = vUv * 10.0 + time * 0.1;
    vec4 noise = texture2D(noiseTexture, noiseUv);
    float foam = smoothstep(0.7, 1.0, noise.r);
    
    float depth = 1.0 - exp(-vWorldPosition.y * 0.5);
    vec3 color = mix(waterColor, deepWaterColor, depth);
    color = mix(color, vec3(1.0), foam * 0.5);
    
    float alpha = transparency * (0.3 + fresnel * 0.7);
    alpha = mix(alpha, 1.0, foam * 0.3);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const fireVertexShader = `
  varying vec2 vUv;
  varying float vTime;
  
  uniform float time;
  uniform float scale;
  
  void main() {
    vUv = uv;
    vTime = time;
    vec3 pos = position * scale;
    pos.y += sin(pos.x * 5.0 + time * 3.0) * 0.1;
    pos.y += sin(pos.z * 5.0 + time * 2.0) * 0.1;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  }
`;

export const fireFragmentShader = `
  varying vec2 vUv;
  varying float vTime;
  
  uniform sampler2D fireTexture;
  uniform vec3 fireColor1;
  uniform vec3 fireColor2;
  uniform vec3 fireColor3;
  uniform float time;
  uniform float intensity;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    uv.y -= vTime * 0.5;
    
    float n = fbm(uv * 5.0 + vTime * 0.3);
    n = pow(n, 2.0);
    
    vec3 color = mix(fireColor3, fireColor2, n);
    color = mix(color, fireColor1, pow(n, 0.5));
    
    float alpha = n * intensity * (1.0 - uv.y);
    alpha = smoothstep(0.0, 0.1, alpha) * smoothstep(1.0, 0.9, uv.y);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform float time;
  uniform float rotationSpeed;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    float angle = time * rotationSpeed;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vUv = rot * (vUv - 0.5) + 0.5;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const portalFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float time;
  uniform float intensity;
  uniform float distortion;
  uniform sampler2D noiseTexture;
  
  void main() {
    vec2 uv = vUv;
    uv -= 0.5;
    
    float ring = length(uv);
    float angle = atan(uv.y, uv.x);
    
    vec4 noise = texture2D(noiseTexture, uv * 5.0 + time * 0.2);
    float n = noise.r;
    
    ring += distortion * n * 0.1;
    angle += time * 0.5;
    
    float pulse = sin(ring * 20.0 - time * 3.0) * 0.5 + 0.5;
    float wave = sin(angle * 6.0 + time * 2.0) * 0.5 + 0.5;
    
    float mask = smoothstep(0.4, 0.5, ring) * (1.0 - smoothstep(0.8, 0.9, ring));
    mask *= pulse * wave;
    
    vec3 color = mix(color1, color2, n);
    color = mix(color, color3, pulse);
    
    float alpha = mask * intensity;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const starfieldVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float brightness;
  
  varying vec3 vColor;
  varying float vBrightness;
  varying vec2 vUv;
  
  uniform float time;
  uniform float pixelRatio;
  uniform float twinkleSpeed;
  
  void main() {
    vUv = uv;
    vColor = customColor;
    vBrightness = brightness;
    
    float twinkle = sin(time * twinkleSpeed * brightness + position.x * 10.0) * 0.5 + 0.5;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * pixelRatio * twinkle * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starfieldFragmentShader = `
  varying vec3 vColor;
  varying float vBrightness;
  varying vec2 vUv;
  
  uniform sampler2D pointTexture;
  uniform float time;
  
  void main() {
    vec2 centeredUv = vUv - 0.5;
    float dist = length(centeredUv) * 2.0;
    float circle = 1.0 - smoothstep(0.0, 1.0, dist);
    
    vec4 textureColor = texture2D(pointTexture, vUv);
    float alpha = circle * textureColor.a * vBrightness;
    
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const gradientBackgroundVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const gradientBackgroundFragmentShader = `
  varying vec2 vUv;
  
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  uniform float time;
  uniform float speed;
  
  void main() {
    vec2 uv = vUv;
    uv.y += sin(uv.x * 10.0 + time * speed) * 0.02;
    
    vec3 color = mix(color1, color2, uv.y);
    color = mix(color, color3, uv.x * uv.y);
    color = mix(color, color4, length(uv - 0.5) * 2.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const gridVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  uniform float time;
  uniform float gridSize;
  uniform float lineWidth;
  
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const gridFragmentShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  uniform vec3 gridColor;
  uniform vec3 glowColor;
  uniform float gridSize;
  uniform float lineWidth;
  uniform float time;
  uniform float pulseSpeed;
  uniform float pulseIntensity;
  
  void main() {
    float grid = 0.0;
    float line = abs(fract(vWorldPosition.x / gridSize) - 0.5) * 2.0;
    line += abs(fract(vWorldPosition.z / gridSize) - 0.5) * 2.0;
    line = 1.0 - smoothstep(0.0, lineWidth, line);
    grid = line;
    
    float pulse = sin(vWorldPosition.x * 0.5 + time * pulseSpeed) * 0.5 + 0.5;
    pulse *= sin(vWorldPosition.z * 0.5 + time * pulseSpeed) * 0.5 + 0.5;
    
    vec3 color = mix(gridColor, glowColor, pulse * pulseIntensity);
    float alpha = grid * (0.3 + pulse * pulseIntensity * 0.7);
    
    gl_FragColor = vec4(color, alpha);
  }
`;