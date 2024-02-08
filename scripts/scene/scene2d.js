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
import { Polygon } from "../collision/polygon.js";
import { Collidable } from "../collision/collidable.js";
import { GameObject } from "../gameobject.js";
import { Simulation } from "../simulation.js";
import { queryCollision } from "../collision/algorithms/sat/sat2.js";
import { Edge } from "../collision/edge.js";
import { Force } from "../collision/force.js";

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

        const a = new GameObject(
            { x: 0, y: 0 },
            Polygon.new(4, {
                radius: Math.SQRT2,
                offset: Math.PI / 4,
            }),
            true
        );
        // a.applyForce(Force.new({ x: -1, y: 1 }, 0.001), { x: 0.5, y: -1 });

        // const b = new GameObject(
        //     { x: 2, y: 2 },
        //     Polygon.new(3, { offset: Math.PI }),
        //     true
        // );

        // b.applyForce({ x: 1, y: 0 }, { x: 1, y: 2 });

        // b.rotate(1);

        // const info = queryCollision(a.collidable, b.collidable);
        // console.log(info);
        // a.translate(info.getPush());
        // const info = queryCollision(b.collidable, a.collidable);
        // console.log(info);
        // b.translate(info.getPush());

        // for (const edge of a.collidable.edges) {
        //     this.#addArrow(edge.tail(), edge.asVector(), randomColor());
        // }
        // for (const edge of b.collidable.edges) {
        //     this.#addArrow(edge.tail(), edge.asVector(), randomColor());
        // }

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
