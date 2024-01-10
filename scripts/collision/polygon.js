import { Vector3 } from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { Collidable } from "./collidable.js";

export class Polygon extends Collidable {
    /**@type {Vector3[]} */
    vertices;

    /**@param {Vector3[]} vertices*/
    constructor(vertices) {
        super();
        if (vertices.length < 3) throw new Error("Vertices must be >=3");
        this.vertices = vertices;
    }
}
