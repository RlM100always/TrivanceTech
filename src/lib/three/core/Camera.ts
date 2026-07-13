import * as THREE from 'three';

export interface CameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  position?: THREE.Vector3 | [number, number, number];
  target?: THREE.Vector3 | [number, number, number];
  up?: THREE.Vector3 | [number, number, number];
}

export function createPerspectiveCamera(options: CameraOptions = {}): THREE.PerspectiveCamera {
  const {
    fov = 75,
    aspect = 1,
    near = 0.1,
    far = 1000,
    position = [0, 0, 5],
    target = [0, 0, 0],
    up = [0, 1, 0],
  } = options;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  if (Array.isArray(position)) {
    camera.position.set(...position);
  } else {
    camera.position.copy(position);
  }

  if (Array.isArray(target)) {
    camera.lookAt(...target);
  } else {
    camera.lookAt(target);
  }

  if (Array.isArray(up)) {
    camera.up.set(...up);
  } else {
    camera.up.copy(up);
  }

  return camera;
}

export function createOrthographicCamera(
  left: number,
  right: number,
  top: number,
  bottom: number,
  near = 0.1,
  far = 1000
): THREE.OrthographicCamera {
  const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  return camera;
}

export function updateCameraAspect(camera: THREE.PerspectiveCamera, aspect: number): void {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

export function setCameraPosition(
  camera: THREE.Camera,
  position: THREE.Vector3 | [number, number, number]
): void {
  if (Array.isArray(position)) {
    camera.position.set(...position);
  } else {
    camera.position.copy(position);
  }
}

export function setCameraTarget(
  camera: THREE.Camera,
  target: THREE.Vector3 | [number, number, number]
): void {
  if (Array.isArray(target)) {
    camera.lookAt(...target);
  } else {
    camera.lookAt(target);
  }
}

export function lerpCameraPosition(
  camera: THREE.Camera,
  targetPosition: THREE.Vector3,
  factor: number
): void {
  camera.position.lerp(targetPosition, factor);
}

export function lerpCameraTarget(
  camera: THREE.Camera,
  target: THREE.Vector3,
  factor: number
): void {
  const currentTarget = new THREE.Vector3();
  camera.getWorldDirection(currentTarget);
  currentTarget.add(camera.position);

  const newTarget = currentTarget.lerp(target, factor);
  camera.lookAt(newTarget);
}

export function getCameraViewMatrix(camera: THREE.Camera): THREE.Matrix4 {
  camera.updateMatrixWorld(true);
  const matrix = new THREE.Matrix4();
  matrix.copy(camera.matrixWorldInverse);
  return matrix;
}

export function getCameraProjectionMatrix(camera: THREE.Camera): THREE.Matrix4 {
  camera.updateMatrixWorld(true);
  return camera.projectionMatrix.clone();
}

export function getCameraWorldDirection(camera: THREE.Camera): THREE.Vector3 {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  return direction;
}

export function getCameraFrustum(camera: THREE.Camera): THREE.Frustum {
  const frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  );
  return frustum;
}

export function isObjectInFrustum(
  object: THREE.Object3D,
  camera: THREE.Camera
): boolean {
  const frustum = getCameraFrustum(camera);
  return frustum.intersectsObject(object);
}

export function createCameraController(
  camera: THREE.PerspectiveCamera,
  domElement: HTMLElement
): {
  enable: () => void;
  disable: () => void;
  dispose: () => void;
  update: () => void;
} {
  let isEnabled = true;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  const target = new THREE.Vector3();
  let distance = camera.position.distanceTo(target);
  let phi = Math.acos((camera.position.y - target.y) / distance);
  let theta = Math.atan2(camera.position.x - target.x, camera.position.z - target.z);

  const minDistance = 1;
  const maxDistance = 100;
  const minPolarAngle = 0;
  const maxPolarAngle = Math.PI;

  function onMouseDown(event: MouseEvent): void {
    if (!isEnabled) return;
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
    domElement.style.cursor = 'grabbing';
  }

  function onMouseMove(event: MouseEvent): void {
    if (!isEnabled || !isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    theta -= deltaX * 0.01;
    phi += deltaY * 0.01;

    phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, phi));

    updateCameraPosition();

    previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  function onMouseUp(): void {
    isDragging = false;
    domElement.style.cursor = 'grab';
  }

  function onWheel(event: WheelEvent): void {
    if (!isEnabled) return;
    event.preventDefault();

    distance *= event.deltaY > 0 ? 1.1 : 0.9;
    distance = Math.max(minDistance, Math.min(maxDistance, distance));

    updateCameraPosition();
  }

  function updateCameraPosition(): void {
    camera.position.x = target.x + distance * Math.sin(phi) * Math.sin(theta);
    camera.position.y = target.y + distance * Math.cos(phi);
    camera.position.z = target.z + distance * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(target);
  }

  function enable(): void {
    isEnabled = true;
    domElement.style.cursor = 'grab';
    domElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });
  }

  function disable(): void {
    isEnabled = false;
    domElement.style.cursor = '';
    domElement.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    domElement.removeEventListener('wheel', onWheel);
  }

  function dispose(): void {
    disable();
  }

  return { enable, disable, dispose, update: updateCameraPosition };
}