import * as THREE from 'three';
import { Renderer } from './Renderer';

export interface SceneManagerOptions {
  renderer?: Renderer;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  onBeforeRender?: (renderer: Renderer, scene: THREE.Scene, camera: THREE.Camera, delta: number, elapsed: number) => void;
  onAfterRender?: (renderer: Renderer, scene: THREE.Scene, camera: THREE.Camera, delta: number, elapsed: number) => void;
  autoResize?: boolean;
}

export class SceneManager {
  private renderer: Renderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private onBeforeRender: SceneManagerOptions['onBeforeRender'];
  private onAfterRender: SceneManagerOptions['onAfterRender'];
  private autoResize: boolean;
  private resizeObserver: ResizeObserver | null = null;
  private container: HTMLElement | null = null;
  private animationId: number | null = null;
  private isPlaying = false;
  private clock = new THREE.Clock();
  private timeScale = 1;
  private resizeCallbacks: Array<(width: number, height: number) => void> = [];
  private disposeCallbacks: Array<() => void> = [];

  constructor(options: SceneManagerOptions = {}) {
    this.renderer = options.renderer || createRenderer();
    this.scene = options.scene || new THREE.Scene();
    this.camera = options.camera || new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.onBeforeRender = options.onBeforeRender;
    this.onAfterRender = options.onAfterRender;
    this.autoResize = options.autoResize ?? true;
  }

  public initialize(container: HTMLElement): void {
    this.container = container;
    container.appendChild(this.renderer.getCanvas());

    if (this.autoResize) {
      this.setupResizeObserver();
    }

    this.resize();
  }

  private setupResizeObserver(): void {
    if (!this.container || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  public resize(): void {
    if (!this.container) return;

    const { width, height } = this.container.getBoundingClientRect();
    this.renderer.setSize(width, height);

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.resizeCallbacks.forEach((callback) => callback(width, height));
  }

  public play(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.clock.start();
    this.animate();
  }

  public pause(): void {
    this.isPlaying = false;
    this.clock.stop();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public stop(): void {
    this.pause();
    this.clock.stop();
    this.clock = new THREE.Clock();
  }

  public setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  public getTimeScale(): number {
    return this.timeScale;
  }

  public getDelta(): number {
    return this.clock.getDelta() * this.timeScale;
  }

  public getElapsedTime(): number {
    return this.clock.getElapsedTime() * this.timeScale;
  }

  private animate = (): void => {
    if (!this.isPlaying) return;

    this.animationId = requestAnimationFrame(this.animate);

    const delta = this.getDelta();
    const elapsed = this.getElapsedTime();

    if (this.onBeforeRender) {
      this.onBeforeRender(this.renderer, this.scene, this.camera, delta, elapsed);
    }

    this.renderer.render(this.scene, this.camera);

    if (this.onAfterRender) {
      this.onAfterRender(this.renderer, this.scene, this.camera, delta, elapsed);
    }
  };

  public onResize(callback: (width: number, height: number) => void): () => void {
    this.resizeCallbacks.push(callback);
    return () => {
      const index = this.resizeCallbacks.indexOf(callback);
      if (index > -1) this.resizeCallbacks.splice(index, 1);
    };
  }

  public onDispose(callback: () => void): () => void {
    this.disposeCallbacks.push(callback);
    return () => {
      const index = this.disposeCallbacks.indexOf(callback);
      if (index > -1) this.disposeCallbacks.splice(index, 1);
    };
  }

  public dispose(): void {
    this.pause();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.resizeCallbacks = [];
    this.disposeCallbacks.forEach((callback) => callback());
    this.disposeCallbacks = [];

    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();

    if (this.container && this.container.contains(this.renderer.getCanvas())) {
      this.container.removeChild(this.renderer.getCanvas());
    }
  }

  public getRenderer(): Renderer {
    return this.renderer;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.Camera {
    return this.camera;
  }

  public setCamera(camera: THREE.Camera): void {
    this.camera = camera;
  }

  public setScene(scene: THREE.Scene): void {
    this.scene = scene;
  }

  public isActive(): boolean {
    return this.isPlaying;
  }

  public add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public remove(object: THREE.Object3D): void {
    this.scene.remove(object);
  }

  public clear(): void {
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      this.scene.remove(child);
      this.disposeObject(child);
    }
  }

  private disposeObject(object: THREE.Object3D): void {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }
    object.children.forEach((child) => this.disposeObject(child));
  }
}

export function createSceneManager(options?: SceneManagerOptions): SceneManager {
  return new SceneManager(options);
}