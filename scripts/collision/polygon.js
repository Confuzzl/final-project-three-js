import { Vector2 } from "three";
import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";

export class Edge {
    /**@type {Polygon}*/
    #parent = null;
    /**@type {Vector2}*/
    #tail = null;
    /**@type {Vector2}*/
    #head = null;

    /**
     * @param {Polygon} parent
     * @param {Vector2} tail
     * @param {Vector2} head
     */
    constructor(parent, tail, head) {
        this.#parent = parent;
        this.#tail = tail;
        this.#head = head;
    }

    tail() {
        return this.#tail.clone().add(this.#parent.centroid);
    }

    head() {
        return this.#head.clone().add(this.#parent.centroid);
    }

    asVector() {
        return this.#head.clone().sub(this.#tail);
    }

    /**
     * @param {number} t
     * @returns {Vector2}
     */
    at(t) {
        return this.tail().add(this.asVector().multiplyScalar(t));
    }

    /**@param {Vector2} point*/
    containsPoint(point) {
        return (
            this.tail().distanceTo(point) + this.head().distanceTo(point) ===
            this.asVector().length()
        );
        // //x bound
        // if (
        //     point.x < Math.min(this.#tail.x, this.#head.x) ||
        //     point.x > Math.max(this.#tail.x, this.#head.x)
        // )
        //     return false;
        // //y bound
        // if (
        //     point.y < Math.min(this.#tail.y, this.#head.y) ||
        //     point.y > Math.max(this.#tail.y, this.#head.y)
        // )
        //     return false;
        // const tailToPointSlope =
        //     (point.y - this.#tail.y) / (point.x - this.#tail.x);
        // const slope =
        //     (this.#head.y - this.#tail.y) / (this.#head.x - this.#tail.x);
        // return tailToPointSlope === slope;
    }
}

export class Polygon extends Collidable {
    /**@type {Vector2[]} */
    localVertices = null;

    /**@type {Edge[]}*/
    edges = null;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number[][]} vertices
     */
    constructor(x, y, vertices) {
        super(x, y);
        if (vertices.length < 3) throw new Error("Vertices must be >=3");
        this.localVertices = vertices.map(
            (pair) => new Vector2(pair[0], pair[1])
        );
        this.edges = this.localVertices.map(
            (v, i, arr) => new Edge(this, v, arr[(i + 1) % arr.length])
        );

        this.aabb = AABB.expandingBase();
        this.localVertices.forEach((v) => {
            const point = v.clone().add(this.centroid);
            this.aabb.expand(point);
        });
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} sides
     * @param {number} radius
     */
    static ngon(x, y, sides, radius = 1) {
        if (sides < 3) throw new Error("Must have at least 3 sides");
        // const vertices = [];
        // for (let i = 0; i < sides; i++) {
        //     vertices.push([
        //         radius * Math.cos((2 * Math.PI * i) / sides),
        //         radius * Math.sin((2 * Math.PI * i) / sides),
        //     ]);
        // }
        const vertices = [...Array(sides)].map((_, i) => [
            radius * Math.cos((2 * Math.PI * i) / sides),
            radius * Math.sin((2 * Math.PI * i) / sides),
        ]);
        return new Polygon(x, y, vertices);
    }
}
