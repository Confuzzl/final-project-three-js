import { Vector2, Quaternion } from "three";
import { AABB } from "./aabb.js";
import { Simulation } from "../simulation.js";
import { MAIN_SCENE, MAIN_SIMULATION } from "../script.js";

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

    /**@param {number} dt*/
    update(dt) {
        this.velocity.add(MAIN_SIMULATION.getGravity().multiplyScalar(dt));
        this.translate(this.velocity);
    }
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
