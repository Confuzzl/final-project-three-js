import {
    Scene,
    MeshStandardMaterial,
    AmbientLight,
    DirectionalLight,
    WebGLRenderer,
    ArrowHelper,
    Vector3,
    GridHelper,
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
        this.camera.position.set(0, 0, 10);
        {
            const a = new Circle(3, 0, 1);
            const b = new Circle(3, 2, 2);

            console.log(sat(a, b));

            super.add(collidableToMesh(a));
            super.add(collidableToMesh(b));
        }
        {
            const a = Polygon.ngon(0, 0, 4, 1);
            const b = Polygon.ngon(0, 2, 3, 1);

            console.log(sat(a, b));

            super.add(collidableToMesh(a));
            super.add(collidableToMesh(b));

            // const dir = new Vector3(0.5, -0.86602540378, 0);
            const dir = new Vector3(Math.sqrt(2) / -2, Math.sqrt(2) / 2, 0);
            const dir2 = dir.clone().negate();
            super.add(new ArrowHelper(dir, new Vector3(), 5, 0xffff00));
            super.add(new ArrowHelper(dir2, new Vector3(), 5, 0xff0000));
            const grid = new GridHelper(10, 10, 0x888888, 0x444444);
            grid.position.z = -1;
            grid.rotation.x = Math.PI / 2;
            super.add(grid);
        }
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this, this.camera);
    }
}
