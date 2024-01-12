import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";
import { Vector2 } from "three";
import { Edge } from "./polygon.js";

export class Circle extends Collidable {
    /**@type {number}*/
    radius = 0;

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

    /**@param {Vector2} point*/
    pointInside(point) {
        const distance2 = this.centroid.distanceToSquared(point);
        const minDistance2 = this.radius ** 2;
        return distance2 < minDistance2;
    }

    /**@param {Edge} edge*/
    edgeInside(edge) {
        if (this.pointInside(edge.tail) || this.pointInside(edge.head))
            return true;
        const dot = edge
            .asVector()
            .normalize()
            .dot(this.centroid.clone().sub(edge.tail));
        const point = edge.tail.clone().add(
            edge
                .asVector()
                .clone()
                .multiplyScalar(dot / edge.length())
        );
        // console.log(dot, point);
        // console.log(this.centroid.clone().sub(point));
        const distance2 = this.centroid.distanceToSquared(point);
        // console.log(distance2, this.radius ** 2);
        return distance2 < this.radius ** 2;
    }
}
