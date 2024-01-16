import { Vector2 } from "three";

export class Axis {
    /**@type {Vector2}*/
    direction = null;

    minA = Number.POSITIVE_INFINITY;
    maxA = Number.NEGATIVE_INFINITY;
    minB = Number.POSITIVE_INFINITY;
    maxB = Number.NEGATIVE_INFINITY;

    /**@param {Vector2} direction*/
    constructor(direction) {
        this.direction = direction.clone();
        this.direction.normalize();
    }

    /**@param {Vector2} point*/
    projectToA(point) {
        const dot = this.direction.dot(point);
        this.minA = Math.min(this.minA, dot);
        this.maxA = Math.max(this.maxA, dot);
    }
    /**@param {Vector2} point*/
    projectToB(point) {
        const dot = this.direction.dot(point);
        this.minB = Math.min(this.minB, dot);
        this.maxB = Math.max(this.maxB, dot);
    }

    depth() {
        return Math.max(this.minA, this.minB) - Math.min(this.maxA, this.maxB);
    }

    isIntersecting() {
        return this.depth() < 0;
    }
}
