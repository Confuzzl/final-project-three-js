import {
    Scene,
    MeshStandardMaterial,
    AmbientLight,
    DirectionalLight,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { Camera2D } from "./camera2d.js";
import { collidableToMesh } from "../rendering.js";
import { Circle } from "../collision/circle.js";

export class Scene2D extends Scene {
    renderer = new WebGLRenderer();
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
        const circle = new Circle(5);
        const mesh = collidableToMesh(circle);
        super.add(mesh);

        this.camera.position.set(0, 3, 5);
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this, this.camera);
    }
}
