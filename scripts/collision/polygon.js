import { Vector2, Vector3 } from "three";
import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";
import { Edge } from "./edge.js";

export class Polygon extends Collidable {
    /**@type {Vector2[]} */
    localVertices = [];

    /**@type {Edge[]}*/
    edges = [];

    /**@param {number[][]} vertices*/
    constructor(vertices) {
        super();
        if (vertices.length < 3) throw new Error("Vertices must be >=3");
        this.localVertices = vertices.map(
            (pair) => new Vector2(pair[0], pair[1])
        );
        this.edges = this.localVertices.map(
            (v, i, arr) => new Edge(this, v, arr[(i + 1) % arr.length])
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
    static ngon(sides, radius = 1, offset = 0) {
        if (sides < 3) throw new Error("Must have at least 3 sides");
        const vertices = [...Array(sides)].map((_, i) => [
            radius * Math.cos((2 * Math.PI * i) / sides + offset),
            radius * Math.sin((2 * Math.PI * i) / sides + offset),
        ]);
        return new Polygon(vertices);
    }
}
