import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";
import { Vector2 } from "three";
import { Edge } from "./polygon.js";

export class Circle extends Collidable {
    /**@type {number}*/
    radius = 0;

    /**@param {number} radius*/
    constructor(radius) {
        super();
        this.radius = radius;

        this.aabb = new AABB(
            new Vector2().subScalar(radius),
            new Vector2().addScalar(radius)
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
        // https://www.jeffreythompson.org/collision-detection/line-circle.php
        if (this.pointInside(edge.tail()) || this.pointInside(edge.head()))
            return false;

        const dot =
            this.centroid.clone().sub(edge.tail()).dot(edge.asVector()) /
            edge.asVector().lengthSq();
        const point = edge.at(dot);
        const distance = this.centroid.distanceTo(point);
        if (!edge.containsPoint(point)) return false;

        return distance < this.radius;
    }

    /**@override*/
    updateAABB() {
        this.aabb.min.add(this.centroid);
        this.aabb.max.add(this.centroid);
    }
    /**@override*/
    rotate(theta) {
        // noop
    }
}
