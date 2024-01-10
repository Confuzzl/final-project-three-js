import { Vector2 } from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { Collidable } from "./collidable.js";

export class Polygon extends Collidable {
    /**@type {Vector2[]} */
    vertices;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number[][]} vertices
     */
    constructor(x, y, vertices) {
        super(x, y);
        if (vertices.length < 3) throw new Error("Vertices must be >=3");
        this.vertices = vertices.map((pair) => new Vector2(pair[0], pair[1]));
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
