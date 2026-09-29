import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.IcosahedronGeometry(2.2, 1);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x52b788,
  emissive: 0x1b4332,
  roughness: 0.25,
  metalness: 0.5,
  transmission: 0.15,
  transparent: true,
  opacity: 0.9,
  wireframe: true,
});
const core = new THREE.Mesh(geometry, material);
group.add(core);

const innerGeometry = new THREE.SphereGeometry(1.2, 40, 40);
const innerMaterial = new THREE.MeshStandardMaterial({
  color: 0xddb892,
  emissive: 0x583101,
  roughness: 0.4,
  metalness: 0.2,
});
const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
group.add(innerSphere);

const particlesCount = 1400;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i += 3) {
  const radius = 12 + Math.random() * 12;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  positions[i] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i + 2] = radius * Math.cos(phi);
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xe6ccb2,
  size: 0.035,
  transparent: true,
  opacity: 0.85,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const ambientLight = new THREE.AmbientLight(0xf5f2eb, 0.9);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x52b788, 4.5, 50);
pointLight.position.set(5, 5, 8);
scene.add(pointLight);

const backLight = new THREE.PointLight(0xddb892, 3.5, 40);
backLight.position.set(-6, -3, -2);
scene.add(backLight);

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  group.rotation.x = elapsed * 0.18 + pointer.y * 0.18;
  group.rotation.y = elapsed * 0.32 + pointer.x * 0.22;
  innerSphere.rotation.y = -elapsed * 0.5;
  innerSphere.position.y = Math.sin(elapsed * 1.5) * 0.15;

  particles.rotation.y = elapsed * 0.035;
  particles.rotation.x = elapsed * 0.02;

  camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.03;
  camera.position.y += (pointer.y * 0.45 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
