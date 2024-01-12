import {
    Scene,
    MeshStandardMaterial,
    AmbientLight,
    DirectionalLight,
    WebGLRenderer,
    GridHelper,
    Clock,
    LineSegments,
    BufferGeometry,
    Vector2,
    MeshBasicMaterial,
    Points,
    PointsMaterial,
    LineBasicMaterial,
} from "three";
import { Camera2D } from "./camera2d.js";
import { collidableToMesh, aabbToMesh } from "../rendering.js";
import { Circle } from "../collision/circle.js";
import { isColliding } from "../collision/sat.js";
import { Edge, Polygon } from "../collision/polygon.js";
import { Collidable } from "../collision/collidable.js";

export function material(color, wireframe = false) {
    return new MeshBasicMaterial({ color: color, wireframe: wireframe });
}

export function randomMaterial() {
    return material(Math.floor(Math.random() * (1 << 24)));
}

export class Scene2D extends Scene {
    renderer = new WebGLRenderer({ antialias: true });
    camera = null;

    ambient = new AmbientLight(0x777777);
    light = new DirectionalLight(0xffffff, 0.5);

    gridSize = 20;

    constructor(width, height) {
        super();

        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xdddddd);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new Camera2D(width, height);

        // super.add(this.ambient);
        // this.light.position.set(3, 4, 5);
        // super.add(this.light);

        this.#create();
    }

    /**
     * @param {Collidable} collidable
     * @param {boolean} showAABB
     */
    #addCollidable(collidable, showAABB = false) {
        const mesh = collidableToMesh(collidable);
        super.add(mesh);
        if (showAABB)
            super.add(aabbToMesh(collidable.aabb, mesh.material.color));
    }

    /**
     * @param {Vector2} a
     * @param {Vector2} b
     * @param {number} color
     */
    #addLineSegment(a, b, color = 0xff0000) {
        super.add(
            new LineSegments(
                new BufferGeometry().setFromPoints([a, b]),
                new LineBasicMaterial({ color: color })
            )
        );
    }

    /**
     * @param {Vector2} point
     * @param {number} color
     */
    #addPoint(point, color = 0x00ff00) {
        super.add(
            new Points(
                new BufferGeometry().setFromPoints([point]),
                new PointsMaterial({
                    size: 10,
                    color: color,
                    sizeAttenuation: false,
                })
            )
        );
    }

    #create() {
        this.camera.position.set(0, 0, 10);

        this.#addCollidable(new Circle(3, 0, 1), true);
        this.#addCollidable(new Circle(3, 2, 2), true);
        this.#addCollidable(Polygon.ngon(0, 0, 4, 1), true);
        this.#addCollidable(Polygon.ngon(0, 2, 3, 1), true);

        // const dir = new Vector3(0.5, -0.86602540378, 0);
        // const dir = new Vector3(-0.70710678118, 0.70710678118, 0);
        // const dir2 = dir.clone().negate();
        // super.add(new ArrowHelper(dir, new Vector3(), 5, 0xff0000));
        // super.add(new ArrowHelper(dir2, new Vector3(), 5, 0x00ffff));

        const circle = new Circle(4, -5, 2);
        this.#addCollidable(circle, true);
        const p = Polygon.ngon(2, -3, 5, 1.5);
        this.#addCollidable(p, true);

        console.log(isColliding(circle, p));

        const grid = new GridHelper(
            this.gridSize,
            this.gridSize,
            0x000000,
            0x888888
        );
        grid.position.z = -1;
        grid.rotation.x = Math.PI / 2;
        super.add(grid);
    }

    clock = new Clock();
    dt = 0;
    fps = 1 / 30;
    ups = 1 / 60;

    render() {
        requestAnimationFrame(this.render.bind(this));

        // this.dt += this.clock.getDelta();

        // if (this.dt >= this.fps) {
        this.renderer.render(this, this.camera);
        // }
        // if (this.dt >= this.ups) {
        // }
    }
}
