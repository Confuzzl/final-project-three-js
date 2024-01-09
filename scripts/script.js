import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";

// import { foo } from "./scene/scene.js";

import { Camera2D } from "./scene/camera.js";

const scene = new THREE.Scene();
const ambient = new THREE.AmbientLight(0x777777);
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(3, 4, 5);
scene.add(ambient);
scene.add(light);

const WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
// const camera = new THREE.OrthographicCamera(
//     -WIDTH / 2,
//     WIDTH / 2,
//     HEIGHT / 2,
//     -HEIGHT / 2,
//     1,
//     1000
// );
// camera.lookAt(0, 0, -1);
// camera.zoom = 50;
// camera.updateProjectionMatrix();
const camera = new Camera2D(WIDTH, HEIGHT);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
// new THREE.MeshBasicMaterial({ color: 0xffffff });

for (let i = -3; i <= 3; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * 2;
    scene.add(cube);
}

camera.position.set(0, 3, 5);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
