import { Vector2, Quaternion } from "three.js";
import { AABB } from "./aabb.js";

export class Collidable {
    /**@type {AABB}*/
    aabb = AABB.expandingBase();

    /**@type {Vector2}*/
    centroid;
    /**@type {Quaternion}*/
    rotation = new Quaternion();

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.centroid = new Vector2(x, y);
    }

    /**@returns {number[]}*/
    centroidArray() {
        return [this.centroid.x, this.centroid.y, 0];
    }

    update() {}
}
