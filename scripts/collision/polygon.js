import { Vector2 } from "three";
import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";

export class Edge {
    /**@type {Vector2} */
    tail;
    /**@type {Vector2} */
    head;

    /**
     * @param {Vector2} tail
     * @param {Vector2} head
     */
    constructor(tail, head) {
        this.tail = tail;
        this.head = head;
    }

    asVector() {
        return this.head.clone().sub(this.tail);
    }

    length() {
        return this.asVector().length();
    }

    /**@param {Vector2} point*/
    containsPoint(point) {
        //x bound
        if (
            point.x < Math.min(this.tail.x, this.head.x) ||
            point.x > Math.max(this.tail.x, this.head.x)
        )
            return false;
        //y bound
        if (
            point.y < Math.min(this.tail.y, this.head.y) ||
            point.y > Math.max(this.tail.y, this.head.y)
        )
            return false;

        const tailToPointSlope =
            (point.y - this.tail.y) / (point.x - this.tail.x);
        const slope = (this.head.y - this.tail.y) / (this.head.x - this.tail.x);
        return tailToPointSlope === slope;
    }
}

export class Polygon extends Collidable {
    /**@type {Vector2[]} */
    localVertices = [];

    /**@type {Edge[]}*/
    edges = null;

    /**@param {number[][]} vertices*/
    constructor(vertices) {
        super();
        if (vertices.length < 3) throw new Error("Vertices must be >=3");
        this.localVertices = vertices.map(
            (pair) => new Vector2(pair[0], pair[1])
        );
        this.edges = this.localVertices.map(
            (v, i, arr) => new Edge(v, arr[(i + 1) % arr.length])
        );
    }

    globalVertices() {
        return this.localVertices.map((v) => {
            const x = v.x,
                y = v.y;
            const newX =
                x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
            const newY =
                y * Math.cos(this.rotation) + x * Math.sin(this.rotation);
            const rotated = new Vector2(newX, newY);
            return rotated.add(this.centroid);
        });
    }

    /**@override*/
    updateAABB() {
        this.aabb = AABB.expandingBase();
        this.globalVertices().forEach((v) => {
            this.aabb.expand(v);
        });
    }

    /**
     * @param {number}
     * @override
     */
    rotate(theta) {
        this.rotation += theta;
        this.updateAABB();
    }

    /**
     * @param {number} sides
     * @param {number} radius
     */
    static ngon(sides, radius = 1) {
        if (sides < 3) throw new Error("Must have at least 3 sides");
        const vertices = [...Array(sides)].map((_, i) => [
            radius * Math.cos((2 * Math.PI * i) / sides),
            radius * Math.sin((2 * Math.PI * i) / sides),
        ]);
        return new Polygon(vertices);
    }
}
