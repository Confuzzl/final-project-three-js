import {
    Scene,
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
    PlaneGeometry,
    Material,
    LineLoop,
} from "three";
import { Camera2D } from "./camera2d.js";
import { collidableToMesh, aabbToMesh } from "../rendering.js";
import { Circle } from "../collision/circle.js";
import { isColliding } from "../collision/sat.js";
import { Polygon } from "../collision/polygon.js";
import { Collidable } from "../collision/collidable.js";
import { GameObject } from "../gameobject.js";
import { Simulation } from "../simulation.js";

export class Scene2D extends Scene {
    renderer = new WebGLRenderer({ antialias: true });
    camera = null;

    ambient = new AmbientLight(0x777777);
    light = new DirectionalLight(0xffffff, 0.5);

    gridSize = 20;

    simulation = new Simulation();

    constructor(width, height) {
        super();
        this.name = "SCENE";

        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xdddddd);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new Camera2D(width, height);

        // super.add(this.ambient);
        // this.light.position.set(3, 4, 5);
        // super.add(this.light);
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
                new LineBasicMaterial({ color: color, linewidth: 5 })
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

    init() {
        this.camera.position.set(0, 0, 10);

        const a = new GameObject(2, 2, new Circle(3), true);
        const b = new GameObject(-1, 0, Polygon.ngon(3, 1), true);
        // this.a.rotate(0.5);
        // console.log(this.a.collidable.centroid);
        // console.log(this.a.collidable.localVertices);
        // console.log(this.a.collidable.globalVertices());
        // console.log(this.a.collidable.aabb);

        // this.a.translate(new Vector2(2, 2));
        // this.a.rotate(1);

        // const dir = new Vector3(0.5, -0.86602540378, 0);
        // const dir = new Vector3(-0.70710678118, 0.70710678118, 0);
        // const dir2 = dir.clone().negate();
        // super.add(new ArrowHelper(dir, new Vector3(), 5, 0xff0000));
        // super.add(new ArrowHelper(dir2, new Vector3(), 5, 0x00ffff));

        const grid = new GridHelper(
            this.gridSize,
            this.gridSize,
            0x000000,
            0xcccccc
        );
        grid.position.z = -1;
        grid.rotation.x = Math.PI / 2;
        this.add(grid);
    }

    clock = new Clock();
    dt = 0;
    fps = 1 / 30;

    render() {
        requestAnimationFrame(this.render.bind(this));

        this.dt += this.clock.getDelta();

        if (this.dt >= this.fps) {
            this.renderer.render(this, this.camera);
            this.objectSet.forEach((object) => {
                object.update(this.dt);
            });

            this.dt = 0;
        }
    }
}
