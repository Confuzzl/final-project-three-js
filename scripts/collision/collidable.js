import { Vector2, Quaternion } from "three";
import { AABB } from "./aabb.js";

export class Collidable {
    /**@type {AABB}*/
    aabb = AABB.expandingBase();

    centroid = new Vector2();
    rotation = 0;
    velocity = new Vector2();
    mass = 1;

    constructor() {}

    centroidArray() {
        return [this.centroid.x, this.centroid.y, 0];
    }

    update() {}
    /**@param {Vector2} v */
    translate(v) {
        this.centroid.add(v);
        this.updateAABB();
    }
    /**@abstract*/
    updateAABB() {}
    /**@abstract*/
    rotate(theta) {}
}
