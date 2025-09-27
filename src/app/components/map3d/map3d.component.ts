import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from 'three-stdlib';

@Component({
  selector: 'app-map3d',
  templateUrl: './map3d.component.html',
  styleUrls: ['./map3d.component.scss'],
})
export class Map3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true }) container!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;

  private moveSpeed = 2;

  ngAfterViewInit(): void {
    this.initScene();
    this.addObjects();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.controls.dispose();
  }

  private initScene(): void {
    const width = this.container.nativeElement.clientWidth;
    const height = this.container.nativeElement.clientHeight;
    const aspect = width / height;
    const frustumSize = 100;

    // Сцена
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);

    // Камера сверху
    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );
    this.camera.position.set(0, 50, 0);
    this.camera.lookAt(0, 0, 0);

    // Рендерер
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.container.nativeElement.appendChild(this.renderer.domElement);

    // Свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(50, 100, 50);
    this.scene.add(directionalLight);

    // Контролы (вид сверху)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = true; // отключаем наклон камеры
    this.controls.enablePan = true;
    this.controls.zoomSpeed = 1.5;
    this.controls.minPolarAngle = 0; // минимальный угол
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  private addObjects(): void {
    // Плоскость (земля)
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);

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

  // Управление WASD для перемещения камеры
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case 'w':
        this.camera.position.y += this.moveSpeed; // вверх по Y (камера смотрит вниз)
        break;
      case 's':
        this.camera.position.y -= this.moveSpeed;
        break;
      case 'a':
        this.camera.position.x -= this.moveSpeed;
        break;
      case 'd':
        this.camera.position.x += this.moveSpeed;
        break;
    }
    this.camera.updateProjectionMatrix();
  }
}
