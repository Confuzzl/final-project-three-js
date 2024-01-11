import { Vector2 } from "three.js";
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
}

export class Polygon extends Collidable {
    /**@type {Vector2[]} */
    localVertices;

    /**@type {Edge[]}*/
    edges;

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
            (v, i, arr) => new Edge(v, arr[(i + 1) % arr.length])
        );

        // const min = new Vector2(
        //     Number.POSITIVE_INFINITY,
        //     Number.POSITIVE_INFINITY
        // );
        // const max = new Vector2(
        //     Number.NEGATIVE_INFINITY,
        //     Number.NEGATIVE_INFINITY
        // );
        // for (const v of this.localVertices) {
        //     const vertex = v.clone().add(this.centroid);
        //     min.x = Math.min(min.x, vertex.x);
        //     max.x = Math.max(max.x, vertex.x);
        //     min.y = Math.min(min.y, vertex.y);
        //     max.y = Math.max(max.y, vertex.y);
        // }
        // this.aabb = new AABB(min, max);
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
    static ngon(x, y, sides, radius) {
        if (sides < 3) throw new Error("Must have at least 3 sides");
        const vertices = [];
        for (let i = 0; i < sides; i++) {
            vertices.push([
                radius * Math.cos((2 * Math.PI * i) / sides),
                radius * Math.sin((2 * Math.PI * i) / sides),
            ]);
        }
        return new Polygon(x, y, vertices);
    }
}
