import {
    Scene,
    MeshStandardMaterial,
    AmbientLight,
    DirectionalLight,
    WebGLRenderer,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { Camera2D } from "./camera2d.js";
import { collidableToMesh } from "../rendering.js";
import { Circle } from "../collision/circle.js";
import { sat } from "../collision/sat.js";
import { Polygon } from "../collision/polygon.js";

export class Scene2D extends Scene {
    renderer = new WebGLRenderer({ antialias: true });
    camera;
    static defaultMaterial = new MeshStandardMaterial({
        color: 0xffffff,
    });

    ambient = new AmbientLight(0x777777);
    light = new DirectionalLight(0xffffff, 0.5);

    constructor(width, height) {
        super();

        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new Camera2D(width, height);

        super.add(this.ambient);
        this.light.position.set(3, 4, 5);
        super.add(this.light);

        this.#create();
    }

    #create() {
        // const geometry = new BoxGeometry(1, 1, 1);

        // for (let i = -3; i <= 3; i++) {
        //     const cube = new Mesh(geometry, this.defaultMaterial);
        //     cube.position.x = i * 2;
        //     super.add(cube);
        // }
        // const a = new Circle(0, 0, 5);
        // const b = new Circle(0, 8, 3);
        // super.add(collidableToMesh(a));
        // super.add(collidableToMesh(b));
        // console.log(sat(a, b));

        // const poly = new Polygon(0, 0, [
        //     [-1, 0],
        //     [1, 0],
        //     [0, 2],
        // ]);
        super.add(collidableToMesh(Polygon.ngon(0, 0, 5, 1)));

        this.camera.position.set(0, 0, 10);
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this, this.camera);
    }
}
