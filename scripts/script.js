import { Scene2D } from "./scene/scene2d.js";

const scene = new Scene2D(window.innerWidth, window.innerHeight);
scene.render();

// import { sat } from "./collision/sat.js";
// import { Circle } from "./collision/circle.js";
// import { Vector3 } from "https://unpkg.com/three@0.126.1/build/three.module.js";

// const a = new Circle(new Vector3(0, 4, 0), 5);
// const b = new Circle(new Vector3(0, 0, 0), 3);

// console.log(sat(a, b));
