import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export interface MapObjectInfo {
  id: number;
  position: THREE.Vector3;
}

@Component({
  selector: 'app-map3d',
  templateUrl: './map3d.component.html',
  styleUrls: ['./map3d.component.scss'],
})
export class Map3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true }) container!: ElementRef;

  @Output() objectClicked = new EventEmitter<MapObjectInfo>();

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private objectCounter = 0;
  private objects: THREE.Mesh[] = []; // 🔹 только кликабельные объекты
  private ground!: THREE.Mesh; // 🔹 земля сохраняется отдельно

  async ngAfterViewInit(): Promise<void> {
    this.initScene();

    await this.addGround(); // ждём загрузку земли
    await this.addObjects(); // ждём загрузку зданий или моделей

    this.animate();
    this.renderer.domElement.addEventListener('click', this.onClick, false);
  }

  private initScene(): void {
    const width = this.container.nativeElement.clientWidth;
    const height = this.container.nativeElement.clientHeight;
    const aspect = width / height;
    const frustumSize = 100;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);

    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );
    this.camera.position.set(100, 200, 100);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.nativeElement.appendChild(this.renderer.domElement);

    // 🔹 Ambient light (фон)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // 🔹 Directional light (солнце)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(70, 100, 120);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;

    const d = 200; // размер области для теней
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    this.scene.add(directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = true;
    this.controls.enablePan = true;
    this.controls.zoomSpeed = 1.5;
  }

  /** 🔹 Асинхронная загрузка земли (с текстурой) */
  private addGround(): Promise<void> {
    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        './city.jpg',
        (texture) => {
          const planeGeometry = new THREE.PlaneGeometry(200, 200);
          const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });

          this.ground = new THREE.Mesh(planeGeometry, planeMaterial);
          this.ground.rotation.x = -Math.PI / 2;
          this.ground.name = 'ground';
          this.ground.receiveShadow = true; // 🔹 земля принимает тени

          this.scene.add(this.ground);
          resolve();
        },
        undefined,
        (err) => {
          console.error('Ошибка загрузки текстуры земли', err);
          // создаём серую землю по умолчанию
          const planeGeometry = new THREE.PlaneGeometry(200, 200);
          const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
          this.ground = new THREE.Mesh(planeGeometry, planeMaterial);
          this.ground.rotation.x = -Math.PI / 2;
          this.ground.name = 'ground';
          this.ground.receiveShadow = true;
          this.scene.add(this.ground);
          resolve();
        }
      );
    });
  }

  /** 🔹 Асинхронная загрузка объектов (можно заменить на модели) */
  private addObjects(): Promise<void> {
    return new Promise((resolve) => {
      const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

      for (let i = -50; i <= 50; i += 20) {
        for (let j = -50; j <= 50; j += 20) {
          const boxGeometry = new THREE.BoxGeometry(5, Math.random() * 20 + 5, 5);
          const box = new THREE.Mesh(boxGeometry, boxMaterial);
          box.position.set(i, box.geometry.parameters.height / 2, j);

          box.castShadow = true; // 🔹 объекты отбрасывают тени
          box.receiveShadow = true; // 🔹 и принимают

          this.scene.add(box);
          this.objects.push(box); // делаем кликабельным
        }
      }

      resolve();
    });
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private onClick = (event: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1) Проверяем клик по объектам
    const intersectsObjects = this.raycaster.intersectObjects(this.objects);
    if (intersectsObjects.length > 0) {
      const mesh = intersectsObjects[0].object as THREE.Mesh;
      const index = this.objects.indexOf(mesh);
      if (index !== -1) {
        this.objectClicked.emit({
          id: index,
          position: mesh.position.clone(),
        });
      }
      return;
    }

    // 2) Проверяем клик по земле
    if (!this.ground) return;
    const intersects = this.raycaster.intersectObject(this.ground);
    if (intersects.length > 0) {
      const point = intersects[0].point;

      const sphereGeometry = new THREE.SphereGeometry(2, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphere.position.set(point.x, 2, point.z);
      sphere.castShadow = true;
      sphere.receiveShadow = true;

      this.scene.add(sphere);
      this.objects.push(sphere); // делаем кликабельным
      this.objectCounter++;
    }
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.controls.dispose();
    this.renderer.domElement.removeEventListener('click', this.onClick);
  }
}
