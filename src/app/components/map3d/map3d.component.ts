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

interface MapObjectInfo {
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

  @Output() objectClicked = new EventEmitter<MapObjectInfo>(); // 🔴 NEW

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private objectCounter = 0; // для уникальных ID шаров
  private objects: THREE.Mesh[] = []; // 🔴 NEW: массив всех шаров

  ngAfterViewInit(): void {
    this.initScene();
    this.addGround();
    this.addObjects();
    this.animate();
    this.renderer.domElement.addEventListener('click', this.onClick, false);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.controls.dispose();
    this.renderer.domElement.removeEventListener('click', this.onClick);
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
    this.container.nativeElement.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(50, 100, 50);
    this.scene.add(directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.zoomSpeed = 1.5;
  }

  private addGround(): void {
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.name = 'ground';
    this.scene.add(plane);
  }

  private addObjects(): void {
    // Несколько кубов (как здания)
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    for (let i = -50; i <= 50; i += 20) {
      for (let j = -50; j <= 50; j += 20) {
        const boxGeometry = new THREE.BoxGeometry(5, Math.random() * 20 + 5, 5);
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(i, box.geometry.parameters.height / 2, j);
        this.scene.add(box);
      }
    }
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

    // Сначала проверяем, есть ли клик по существующему шару
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
      return; // 🔴 не создаём новый шар
    }

    // Ищем пересечение с землей
    const ground = this.scene.getObjectByName('ground');
    if (!ground) return;

    const intersects = this.raycaster.intersectObject(ground);
    if (intersects.length > 0) {
      const point = intersects[0].point;

      const sphereGeometry = new THREE.SphereGeometry(2, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphere.position.set(point.x, 2, point.z); // уровень земли
      this.scene.add(sphere);

      // 🔴 сохраняем шар в массив
      this.objects.push(sphere);
      this.objectCounter++;
    }
  };
}
