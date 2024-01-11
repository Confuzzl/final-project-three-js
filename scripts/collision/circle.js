import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";

export class Circle extends Collidable {
    /**@type {number}*/
    radius;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     */
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;

        this.aabb = new AABB(
            this.centroid.clone().subScalar(radius),
            this.centroid.clone().addScalar(radius)
        );
    }
}
