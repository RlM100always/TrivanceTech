import * as THREE from 'three';

export interface GeometryParams {
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  radius?: number;
  segments?: number;
  thetaStart?: number;
  thetaLength?: number;
  phiStart?: number;
  phiLength?: number;
  radiusTop?: number;
  radiusBottom?: number;
  radialSegments?: number;
  tubularSegments?: number;
  arc?: number;
  p?: number;
  q?: number;
  detail?: number;
  vertices?: number[];
  indices?: number[];
  points?: THREE.Vector3[];
  path?: THREE.Curve<THREE.Vector3>;
  shapes?: THREE.Shape[];
  options?: THREE.ExtrudeGeometryOptions;
  [key: string]: unknown;
}

export function createGeometry(type: string, params: GeometryParams = {}): THREE.BufferGeometry {
  switch (type) {
    case 'box':
      return new THREE.BoxGeometry(params.width, params.height, params.depth, params.widthSegments, params.heightSegments, params.depthSegments);
    case 'sphere':
      return new THREE.SphereGeometry(params.radius, params.widthSegments, params.heightSegments, params.phiStart, params.phiLength, params.thetaStart, params.thetaLength);
    case 'plane':
      return new THREE.PlaneGeometry(params.width, params.height, params.widthSegments, params.heightSegments);
    case 'circle':
      return new THREE.CircleGeometry(params.radius, params.segments, params.thetaStart, params.thetaLength);
    case 'cylinder':
      return new THREE.CylinderGeometry(params.radiusTop, params.radiusBottom, params.height, params.radialSegments, params.heightSegments, params.openEnded, params.thetaStart, params.thetaLength);
    case 'cone':
      return new THREE.ConeGeometry(params.radius, params.height, params.radialSegments, params.heightSegments, params.openEnded, params.thetaStart, params.thetaLength);
    case 'torus':
      return new THREE.TorusGeometry(params.radius, params.tube, params.radialSegments, params.tubularSegments, params.arc);
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(params.radius, params.tube, params.tubularSegments, params.radialSegments, params.p, params.q);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(params.radius, params.detail);
    case 'octahedron':
      return new THREE.OctahedronGeometry(params.radius, params.detail);
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(params.radius, params.detail);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(params.radius, params.detail);
    case 'ring':
      return new THREE.RingGeometry(params.innerRadius, params.outerRadius, params.thetaSegments, params.phiSegments, params.thetaStart, params.thetaLength);
    case 'shape':
      return new THREE.ShapeGeometry(params.shape, params.curveSegments);
    case 'extrude':
      return new THREE.ExtrudeGeometry(params.shapes, params.options);
    case 'lathe':
      return new THREE.LatheGeometry(params.points, params.segments, params.phiStart, params.phiLength);
    case 'tube':
      return new THREE.TubeGeometry(params.path, params.tubularSegments, params.radius, params.radialSegments, params.closed);
    case 'polyhedron':
      return new THREE.PolyhedronGeometry(params.vertices, params.indices, params.radius, params.detail);
    case 'text':
      return new THREE.TextGeometry(params.text, params.options);
    default:
      return new THREE.BufferGeometry();
  }
}

export interface MaterialParams {
  color?: THREE.ColorRepresentation;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  depthWrite?: boolean;
  depthTest?: boolean;
  blending?: THREE.Blending;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  shininess?: number;
  specular?: THREE.ColorRepresentation;
  size?: number;
  sizeAttenuation?: boolean;
  map?: THREE.Texture;
  alphaMap?: THREE.Texture;
  vertexColors?: boolean;
  rotation?: number;
  dashSize?: number;
  gapSize?: number;
  [key: string]: unknown;
}

export function createMaterial(type: string, params: MaterialParams = {}): THREE.Material {
  const commonParams = {
    color: params.color || 0xffffff,
    transparent: params.transparent || false,
    opacity: params.opacity !== undefined ? params.opacity : 1,
    side: params.side || THREE.FrontSide,
    depthWrite: params.depthWrite !== false,
    depthTest: params.depthTest !== false,
    blending: params.blending || THREE.NormalBlending,
    ...params,
  };

  switch (type) {
    case 'basic':
      return new THREE.MeshBasicMaterial(commonParams);
    case 'standard':
      return new THREE.MeshStandardMaterial({
        ...commonParams,
        roughness: params.roughness !== undefined ? params.roughness : 0.5,
        metalness: params.metalness !== undefined ? params.metalness : 0.5,
        envMapIntensity: params.envMapIntensity || 1,
      });
    case 'physical':
      return new THREE.MeshPhysicalMaterial({
        ...commonParams,
        roughness: params.roughness !== undefined ? params.roughness : 0.5,
        metalness: params.metalness !== undefined ? params.metalness : 0.5,
        clearcoat: params.clearcoat || 0,
        clearcoatRoughness: params.clearcoatRoughness || 0,
        transmission: params.transmission || 0,
        thickness: params.thickness || 0,
        ior: params.ior || 1.5,
        envMapIntensity: params.envMapIntensity || 1,
      });
    case 'phong':
      return new THREE.MeshPhongMaterial({
        ...commonParams,
        shininess: params.shininess || 30,
        specular: params.specular || 0x111111,
      });
    case 'lambert':
      return new THREE.MeshLambertMaterial(commonParams);
    case 'toon':
      return new THREE.MeshToonMaterial(commonParams);
    case 'normal':
      return new THREE.MeshNormalMaterial(commonParams);
    case 'depth':
      return new THREE.MeshDepthMaterial(commonParams);
    case 'shader':
      return new THREE.ShaderMaterial({
        ...commonParams,
        vertexShader: params.vertexShader,
        fragmentShader: params.fragmentShader,
        uniforms: params.uniforms || {},
        defines: params.defines || {},
      });
    case 'rawShader':
      return new THREE.RawShaderMaterial({
        ...commonParams,
        vertexShader: params.vertexShader,
        fragmentShader: params.fragmentShader,
        uniforms: params.uniforms || {},
        defines: params.defines || {},
      });
    case 'points':
      return new THREE.PointsMaterial({
        ...commonParams,
        size: params.size || 1,
        sizeAttenuation: params.sizeAttenuation !== false,
        map: params.map,
        alphaMap: params.alphaMap,
        vertexColors: params.vertexColors || false,
      });
    case 'sprite':
      return new THREE.SpriteMaterial({
        ...commonParams,
        map: params.map,
        alphaMap: params.alphaMap,
        rotation: params.rotation || 0,
      });
    case 'line':
      return new THREE.LineBasicMaterial(commonParams);
    case 'lineDashed':
      return new THREE.LineDashedMaterial({
        ...commonParams,
        dashSize: params.dashSize || 3,
        gapSize: params.gapSize || 1,
      });
    default:
      return new THREE.MeshBasicMaterial(commonParams);
  }
}

export function createMesh(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]): THREE.Mesh {
  return new THREE.Mesh(geometry, material);
}

export function createPoints(geometry: THREE.BufferGeometry, material: THREE.PointsMaterial): THREE.Points {
  return new THREE.Points(geometry, material);
}

export function createLine(geometry: THREE.BufferGeometry, material: THREE.LineBasicMaterial): THREE.Line {
  return new THREE.Line(geometry, material);
}

export function createLineLoop(geometry: THREE.BufferGeometry, material: THREE.LineBasicMaterial): THREE.LineLoop {
  return new THREE.LineLoop(geometry, material);
}

export function createLineSegments(geometry: THREE.BufferGeometry, material: THREE.LineBasicMaterial): THREE.LineSegments {
  return new THREE.LineSegments(geometry, material);
}

export function createSprite(material: THREE.SpriteMaterial): THREE.Sprite {
  return new THREE.Sprite(material);
}

export function createGroup(): THREE.Group {
  return new THREE.Group();
}

export function createScene(): THREE.Scene {
  return new THREE.Scene();
}

export function createPerspectiveCamera(fov = 75, aspect = 1, near = 0.1, far = 1000): THREE.PerspectiveCamera {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

export function createOrthographicCamera(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 1000): THREE.OrthographicCamera {
  return new THREE.OrthographicCamera(left, right, top, bottom, near, far);
}

export function createDirectionalLight(color = 0xffffff, intensity = 1): THREE.DirectionalLight {
  return new THREE.DirectionalLight(color, intensity);
}

export function createPointLight(color = 0xffffff, intensity = 1, distance = 0, decay = 2): THREE.PointLight {
  return new THREE.PointLight(color, intensity, distance, decay);
}

export function createSpotLight(color = 0xffffff, intensity = 1, distance = 0, angle = Math.PI / 3, penumbra = 0, decay = 2): THREE.SpotLight {
  return new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
}

export function createAmbientLight(color = 0xffffff, intensity = 1): THREE.AmbientLight {
  return new THREE.AmbientLight(color, intensity);
}

export function createHemisphereLight(skyColor = 0xffffff, groundColor = 0xffffff, intensity = 1): THREE.HemisphereLight {
  return new THREE.HemisphereLight(skyColor, groundColor, intensity);
}

export function createRectAreaLight(color = 0xffffff, intensity = 1, width = 10, height = 10): THREE.RectAreaLight {
  return new THREE.RectAreaLight(color, intensity, width, height);
}

export function createTextureLoader(): THREE.TextureLoader {
  return new THREE.TextureLoader();
}

export function createCubeTextureLoader(): THREE.CubeTextureLoader {
  return new THREE.CubeTextureLoader();
}

export function createLoadingManager(): THREE.LoadingManager {
  return new THREE.LoadingManager();
}

export function cloneObject3D(object: THREE.Object3D): THREE.Object3D {
  return object.clone(true);
}

export function disposeObject3D(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}

export function getBoundingBox(object: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  box.setFromObject(object);
  return box;
}

export function getBoundingSphere(object: THREE.Object3D): THREE.Sphere {
  const sphere = new THREE.Sphere();
  const box = getBoundingBox(object);
  box.getBoundingSphere(sphere);
  return sphere;
}

export function centerObject(object: THREE.Object3D): void {
  const box = getBoundingBox(object);
  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.sub(center);
}

export function fitCameraToObject(camera: THREE.Camera, object: THREE.Object3D, offset = 1.25): void {
  const box = getBoundingBox(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 75;
  let distance = (maxDim / 2) / Math.tan((fov * Math.PI) / 360);
  distance *= offset;
  const center = new THREE.Vector3();
  box.getCenter(center);
  camera.position.copy(center);
  camera.position.z += distance;
  camera.lookAt(center);
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.updateProjectionMatrix();
  }
}

export function createRaycaster(origin: THREE.Vector3, direction: THREE.Vector3, near = 0, far = Infinity): THREE.Raycaster {
  return new THREE.Raycaster(origin, direction.normalize(), near, far);
}

export function intersectObjects(raycaster: THREE.Raycaster, objects: THREE.Object3D[], recursive = true): THREE.Intersection[] {
  return raycaster.intersectObjects(objects, recursive);
}

export function getMouseNDC(event: MouseEvent, canvas: HTMLCanvasElement): THREE.Vector2 {
  const rect = canvas.getBoundingClientRect();
  return new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
}

export function getTouchNDC(touch: Touch, canvas: HTMLCanvasElement): THREE.Vector2 {
  const rect = canvas.getBoundingClientRect();
  return new THREE.Vector2(
    ((touch.clientX - rect.left) / rect.width) * 2 - 1,
    -((touch.clientY - rect.top) / rect.height) * 2 + 1
  );
}

export function generateUUID(): string {
  return THREE.MathUtils.generateUUID();
}

export function lerp(start: number, end: number, t: number): number {
  return THREE.MathUtils.lerp(start, end, t);
}

export function clamp(value: number, min: number, max: number): number {
  return THREE.MathUtils.clamp(value, min, max);
}

export function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number {
  return THREE.MathUtils.mapLinear(x, a1, a2, b1, b2);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  return THREE.MathUtils.smoothstep(edge0, edge1, x);
}

export function smootherstep(edge0: number, edge1: number, x: number): number {
  return THREE.MathUtils.smootherstep(edge0, edge1, x);
}

export function randomInRange(min: number, max: number): number {
  return THREE.MathUtils.randFloat(min, max);
}

export function randomInt(min: number, max: number): number {
  return THREE.MathUtils.randInt(min, max);
}

export function randomVector3(min: THREE.Vector3, max: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    randomInRange(min.x, max.x),
    randomInRange(min.y, max.y),
    randomInRange(min.z, max.z)
  );
}

export function randomColor(): THREE.Color {
  return new THREE.Color().setHSL(Math.random(), 0.5, 0.5);
}

export function randomSpherePoint(radius: number): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

export function randomDiskPoint(radius: number): THREE.Vector3 {
  const r = radius * Math.sqrt(Math.random());
  const theta = 2 * Math.PI * Math.random();
  return new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta));
}

export function randomBoxPoint(size: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    (Math.random() - 0.5) * size.x,
    (Math.random() - 0.5) * size.y,
    (Math.random() - 0.5) * size.z
  );
}