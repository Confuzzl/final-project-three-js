import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";
import { Vector2 } from "three";
import { Edge } from "./edge.js";

export class Circle extends Collidable {
    /**@type {number}*/
    radius = 0;

    /**@param {number} radius*/
    constructor(radius) {
        super();
        this.radius = radius;
    }

    clone() {
        return new Circle(this.radius);
    }

    /**@param {Vector2} point*/
    contains(point) {
        const distance2 = this.centroid.distanceToSquared(point);
        const minDistance2 = this.radius * this.radius;
        return distance2 < minDistance2;
    }

    /**@override*/
    updateAABB() {
        this.aabb = new AABB(
            this.centroid.clone().subScalar(this.radius),
            this.centroid.clone().addScalar(this.radius)
        );
    }
    /**@override*/
    rotate(theta) {
        // noop
    }
}
