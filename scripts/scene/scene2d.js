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
    Line,
    ArrowHelper,
    Vector3,
} from "three";
import { Camera2D } from "./camera2d.js";
import { collidableToMesh, aabbToMesh, randomColor } from "../rendering.js";
import { Circle } from "../collision/circle.js";
import { isColliding } from "../collision/algorithms/sat.js";
import { Polygon } from "../collision/polygon.js";
import { Collidable } from "../collision/collidable.js";
import { GameObject } from "../gameobject.js";
import { Simulation } from "../simulation.js";
import { edgeCircleQuery, sat2 } from "../collision/algorithms/sat2.js";
import { Edge } from "../collision/edge.js";

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
        this.add(
            new Line(
                new BufferGeometry().setFromPoints([a, b]),
                new LineBasicMaterial({ color: color })
            )
        );
    }

    /**
     * @param {Vector2} tail
     * @param {Vector2} direction
     * @param {number} color
     */
    #addArrow(tail, direction, color) {
        const length = direction.length();
        const dirNorm = direction.clone().divideScalar(length);
        const dir3 = new Vector3(dirNorm.x, dirNorm.y, 0);
        const origin = new Vector3(tail.x, tail.y, 0);
        this.add(
            new ArrowHelper(
                dir3,
                origin,
                length,
                color,
                0.2 * length,
                0.2 * length
            )
        );
    }

    /**
     * @param {Vector2} point
     * @param {number} color
     */
    #addPoint(point, color = 0x00ff00) {
        this.add(
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

        // const a = new GameObject(1, 2, new Circle(1), true);

        const a = new GameObject(-3, 2, new Circle(2), true);
        const b = new GameObject(
            -1,
            4,
            Polygon.ngon(4, 1 * Math.SQRT2, Math.PI / 4),
            // Polygon.ngon(3, 1),
            true
        );
        const c = new GameObject(-3, 2, new Circle(2), true);
        // console.log(sat2(a.collidable, b.collidable));
        const info = sat2(a.collidable, b.collidable);
        c.translate(info.normalA.clone().multiplyScalar(info.depth));
        // const c = new GameObject(4, 2, new Circle(2.5), true);
        // console.log(sat2(a.collidable, b.collidable));
        // console.log(sat2(b.collidable, c.collidable));

        for (const edge of b.collidable.edges) {
            const info = edgeCircleQuery(edge, a.collidable);
            const color = randomColor();
            // console.log(info);
            this.#addArrow(edge.tail(), edge.asVector(), color);
            this.#addArrow(edge.at(0.5), edge.normal(), color);
            this.#addPoint(info.edgePoint, color);
            this.#addPoint(info.circlePoint, color);
        }
        // const foo = new GameObject(0, 0, new Circle(1), true);
        // const bar = new GameObject(1.5, 0, new Circle(1), true);
        // console.log(sat2(foo.collidable, bar.collidable));

        // console.log(sat2(a.collidable, b.collidable));
        // const b = new GameObject(-1, 0, Polygon.ngon(4, 1), true);
        // this.a.rotate(0.5);
        // console.log(this.a.collidable.centroid);
        // console.log(this.a.collidable.localVertices);
        // console.log(this.a.collidable.globalVertices());
        // console.log(this.a.collidable.aabb);

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
            this.simulation.update(this.dt);
            this.dt = 0;
        }
    }
}
