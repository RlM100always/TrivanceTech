import * as THREE from 'three';

export interface OrbitControlsOptions {
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
  target?: THREE.Vector3;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export function createOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
  options: OrbitControlsOptions = {}
): {
  update: () => void;
  dispose: () => void;
  target: THREE.Vector3;
  enableDamping: boolean;
  dampingFactor: number;
  enableZoom: boolean;
  zoomSpeed: number;
  minZoom: number;
  maxZoom: number;
  enablePan: boolean;
  panSpeed: number;
  enableRotate: boolean;
  rotateSpeed: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
} {
  const {
    enableDamping = true,
    dampingFactor = 0.05,
    enableZoom = true,
    zoomSpeed = 1.0,
    minZoom = 0.1,
    maxZoom = Infinity,
    enablePan = true,
    panSpeed = 1.0,
    enableRotate = true,
    rotateSpeed = 1.0,
    minAzimuthAngle = -Infinity,
    maxAzimuthAngle = Infinity,
    minPolarAngle = 0,
    maxPolarAngle = Math.PI,
    target = new THREE.Vector3(),
    autoRotate = false,
    autoRotateSpeed = 2.0,
  } = options;

  const mouseButtons = { LEFT: 0, MIDDLE: 1, RIGHT: 2 } as const;
  const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 } as const;

  let state = STATE.NONE;
  let zoomScale = 1;

  const sphericalDelta = new THREE.Spherical();
  const panOffset = new THREE.Vector3();
  const previousMousePosition = new THREE.Vector2();

  function getZoomScale(): number {
    return Math.pow(0.95, zoomSpeed);
  }

  function rotateLeft(angle: number): void {
    sphericalDelta.theta -= angle;
  }

  function rotateUp(angle: number): void {
    sphericalDelta.phi -= angle;
  }

  function panLeft(distance: number, objectMatrix: THREE.Matrix4): void {
    const v = new THREE.Vector3();
    v.setFromMatrixColumn(objectMatrix, 0);
    v.multiplyScalar(-distance);
    panOffset.add(v);
  }

  function panUp(distance: number, objectMatrix: THREE.Matrix4): void {
    const v = new THREE.Vector3();
    v.setFromMatrixColumn(objectMatrix, 1);
    v.multiplyScalar(distance);
    panOffset.add(v);
  }

  function pan(deltaX: number, deltaY: number): void {
    const element = domElement === document ? document.body : domElement;
    if (camera.isPerspectiveCamera) {
      const position = camera.position.clone();
      position.sub(target);
      let targetDistance = position.length();
      targetDistance *= Math.tan((camera.fov / 2) * (Math.PI / 180));
      panLeft((2 * deltaX * targetDistance) / element.clientHeight, camera.matrix);
      panUp((2 * deltaY * targetDistance) / element.clientHeight, camera.matrix);
    } else if (camera.isOrthographicCamera) {
      panLeft((deltaX * (camera.right - camera.left)) / element.clientWidth, camera.matrix);
      panUp((deltaY * (camera.top - camera.bottom)) / element.clientHeight, camera.matrix);
    } else {
      panLeft(deltaX, camera.matrix);
      panUp(deltaY, camera.matrix);
    }
  }

  function dollyIn(dollyScale: number): void {
    if (camera.isPerspectiveCamera) {
      zoomScale /= dollyScale;
    } else if (camera.isOrthographicCamera) {
      camera.zoom = Math.max(minZoom, Math.min(maxZoom, camera.zoom * dollyScale));
      camera.updateProjectionMatrix();
    }
  }

  function dollyOut(dollyScale: number): void {
    if (camera.isPerspectiveCamera) {
      zoomScale *= dollyScale;
    } else if (camera.isOrthographicCamera) {
      camera.zoom = Math.max(minZoom, Math.min(maxZoom, camera.zoom / dollyScale));
      camera.updateProjectionMatrix();
    }
  }

  function handleMouseDownRotate(event: MouseEvent): void {
    previousMousePosition.set(event.clientX, event.clientY);
    state = STATE.ROTATE;
  }

  function handleMouseDownDolly(event: MouseEvent): void {
    previousMousePosition.set(event.clientX, event.clientY);
    state = STATE.DOLLY;
  }

  function handleMouseDownPan(event: MouseEvent): void {
    previousMousePosition.set(event.clientX, event.clientY);
    state = STATE.PAN;
  }

  function handleMouseMoveRotate(event: MouseEvent): void {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    previousMousePosition.set(event.clientX, event.clientY);
    rotateLeft((2 * Math.PI * deltaX) / domElement.clientHeight * rotateSpeed);
    rotateUp((2 * Math.PI * deltaY) / domElement.clientHeight * rotateSpeed);
  }

  function handleMouseMoveDolly(event: MouseEvent): void {
    const deltaY = event.clientY - previousMousePosition.y;
    previousMousePosition.set(event.clientX, event.clientY);
    if (deltaY > 0) {
      dollyIn(getZoomScale());
    } else if (deltaY < 0) {
      dollyOut(getZoomScale());
    }
  }

  function handleMouseMovePan(event: MouseEvent): void {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    previousMousePosition.set(event.clientX, event.clientY);
    pan(deltaX, deltaY);
  }

  function handleMouseUp(): void {
    state = STATE.NONE;
  }

  function handleMouseWheel(event: WheelEvent): void {
    if (!enableZoom) return;
    event.preventDefault();
    if (event.deltaY < 0) {
      dollyOut(getZoomScale());
    } else if (event.deltaY > 0) {
      dollyIn(getZoomScale());
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!enablePan) return;
    switch (event.code) {
      case 'ArrowUp':
        pan(0, -panSpeed);
        break;
      case 'ArrowDown':
        pan(0, panSpeed);
        break;
      case 'ArrowLeft':
        pan(-panSpeed, 0);
        break;
      case 'ArrowRight':
        pan(panSpeed, 0);
        break;
    }
  }

  function onMouseDown(event: MouseEvent): void {
    if (!enableRotate && !enableZoom && !enablePan) return;
    event.preventDefault();
    switch (event.button) {
      case mouseButtons.LEFT:
        if (enableRotate) handleMouseDownRotate(event);
        break;
      case mouseButtons.MIDDLE:
        if (enableZoom) handleMouseDownDolly(event);
        break;
      case mouseButtons.RIGHT:
        if (enablePan) handleMouseDownPan(event);
        break;
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    switch (state) {
      case STATE.ROTATE:
        if (enableRotate) handleMouseMoveRotate(event);
        break;
      case STATE.DOLLY:
        if (enableZoom) handleMouseMoveDolly(event);
        break;
      case STATE.PAN:
        if (enablePan) handleMouseMovePan(event);
        break;
    }
  }

  function onMouseUp(): void {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    handleMouseUp();
  }

  function onTouchStart(event: TouchEvent): void {
    if (!enableRotate && !enableZoom && !enablePan) return;
    event.preventDefault();
    switch (event.touches.length) {
      case 1:
        if (enableRotate) handleTouchStartRotate(event);
        break;
      case 2:
        if (enableZoom && enablePan) handleTouchStartDollyPan(event);
        break;
    }
  }

  function handleTouchStartRotate(event: TouchEvent): void {
    previousMousePosition.set(event.touches[0].clientX, event.touches[0].clientY);
    state = STATE.TOUCH_ROTATE;
  }

  function handleTouchStartDollyPan(event: TouchEvent): void {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    Math.sqrt(dx * dx + dy * dy);
    previousMousePosition.set((event.touches[0].clientX + event.touches[1].clientX) / 2, (event.touches[0].clientY + event.touches[1].clientY) / 2);
    state = STATE.TOUCH_DOLLY_PAN;
  }

  function onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    switch (event.touches.length) {
      case 1:
        if (enableRotate) handleTouchMoveRotate(event);
        break;
      case 2:
        if (enableZoom && enablePan) handleTouchMoveDollyPan(event);
        break;
    }
  }

  function handleTouchMoveRotate(event: TouchEvent): void {
    const deltaX = event.touches[0].clientX - previousMousePosition.x;
    const deltaY = event.touches[0].clientY - previousMousePosition.y;
    previousMousePosition.set(event.touches[0].clientX, event.touches[0].clientY);
    rotateLeft((2 * Math.PI * deltaX) / domElement.clientHeight * rotateSpeed);
    rotateUp((2 * Math.PI * deltaY) / domElement.clientHeight * rotateSpeed);
  }

  function handleTouchMoveDollyPan(event: TouchEvent): void {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const prevDistance = Math.sqrt(
      Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) +
      Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2)
    );
    if (distance > prevDistance) {
      dollyOut(getZoomScale());
    } else if (distance < prevDistance) {
      dollyIn(getZoomScale());
    }
    const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    pan(centerX - previousMousePosition.x, centerY - previousMousePosition.y);
    previousMousePosition.set(centerX, centerY);
  }

  function onTouchEnd(): void {
    state = STATE.NONE;
  }

  function onContextMenu(event: Event): void {
    event.preventDefault();
  }

  function update(): void {
    const offset = new THREE.Vector3().subVectors(camera.position, target);

    offset.applyQuaternion(sphericalDelta.setFromEuler(new THREE.Euler(0, 0, 0)));

    offset.multiplyScalar(zoomScale);

    const newPosition = target.clone().add(offset);
    camera.position.lerp(newPosition, enableDamping ? dampingFactor : 1);
    camera.lookAt(target);

    if (enableDamping) {
      sphericalDelta.theta *= 1 - dampingFactor;
      sphericalDelta.phi *= 1 - dampingFactor;
      panOffset.multiplyScalar(1 - dampingFactor);
      zoomScale += (1 - zoomScale) * dampingFactor;
    }

    if (autoRotate && state === STATE.NONE) {
      rotateLeft((2 * Math.PI * autoRotateSpeed) / 60 / 60);
    }

    zoomScale = 1;
    sphericalDelta.set(0, 0, 0);
    panOffset.set(0, 0, 0);
  }

  function dispose(): void {
    domElement.removeEventListener('mousedown', onMouseDown);
    domElement.removeEventListener('wheel', handleMouseWheel);
    domElement.removeEventListener('touchstart', onTouchStart);
    domElement.removeEventListener('touchmove', onTouchMove);
    domElement.removeEventListener('touchend', onTouchEnd);
    domElement.removeEventListener('contextmenu', onContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
  }

  domElement.addEventListener('mousedown', onMouseDown);
  domElement.addEventListener('wheel', handleMouseWheel, { passive: false });
  domElement.addEventListener('touchstart', onTouchStart, { passive: false });
  domElement.addEventListener('touchmove', onTouchMove, { passive: false });
  domElement.addEventListener('touchend', onTouchEnd);
  domElement.addEventListener('contextmenu', onContextMenu);
  document.addEventListener('keydown', handleKeyDown);

  return {
    update,
    dispose,
    target,
    enableDamping,
    dampingFactor,
    enableZoom,
    zoomSpeed,
    minZoom,
    maxZoom,
    enablePan,
    panSpeed,
    enableRotate,
    rotateSpeed,
    minAzimuthAngle,
    maxAzimuthAngle,
    minPolarAngle,
    maxPolarAngle,
    autoRotate,
    autoRotateSpeed,
  };
}

export function createPointerLockControls(
  camera: THREE.Camera,
  domElement: HTMLElement
): {
  lock: () => void;
  unlock: () => void;
  dispose: () => void;
  isLocked: boolean;
} {
  let isLocked = false;

  function onMouseMove(event: MouseEvent): void {
    if (!isLocked) return;
    void event.movementX;
    void event.movementY;
  }

  function onPointerLockChange(): void {
    isLocked = document.pointerLockElement === domElement;
  }

  function onPointerLockError(): void {
    console.warn('Pointer lock error');
  }

  function lock(): void {
    domElement.requestPointerLock();
  }

  function unlock(): void {
    document.exitPointerLock();
  }

  function dispose(): void {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    document.removeEventListener('pointerlockerror', onPointerLockError);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('pointerlockerror', onPointerLockError);

  return { lock, unlock, dispose, get isLocked() { return isLocked; } };
}