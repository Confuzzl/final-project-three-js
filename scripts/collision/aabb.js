import { Vector2 } from "three.js";

export class AABB {
    /**@type {Vector2}*/
    min;
    /**@type {Vector2}*/
    max;

    /**
     * @param {Vector2} min
     * @param {Vector2} max
     */
    constructor(min = new Vector2(), max = new Vector2()) {
        this.min = min;
        this.max = max;
    }

    /**@returns {AABB}*/
    static expandingBase() {
        return new AABB(
            new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
            new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
        );
    }

    /**@param {Vector2} point*/
    expand(point) {
        this.min.x = Math.min(this.min.x, point.x);
        this.max.x = Math.max(this.max.x, point.x);
        this.min.y = Math.min(this.min.y, point.y);
        this.max.y = Math.max(this.max.y, point.y);
    }

    /**@returns {Vector2}*/
    size() {
        return this.max.clone().sub(this.min);
    }

    /**@returns {Vector2}*/
    midpoint() {
        return this.min.clone().add(this.max).divideScalar(2);
    }

    /**@returns {Vector2[]}*/
    getVertices() {
        return [
            this.min,
            new Vector2(this.max.x, this.min.y),
            this.max,
            new Vector2(this.min.x, this.max.y),
        ];
    }

    /**
     * @param {Vector2} point
     * @returns {boolean}
     */
    pointIntersecting(point) {
        return (
            this.min.x < point.x &&
            point.x < this.max.x &&
            this.min.y < point.y &&
            point.y < this.max.y &&
            this.min.z < point.z &&
            point.z < this.max.z
        );
    }

    /**
     * @param {AABB} other
     * @returns {boolean}
     */
    aabbIntersecting(other) {
        return (
            this.min.x < other.max.x &&
            this.max.x > other.min.x &&
            this.min.y < other.max.y &&
            this.max.y > other.max.y &&
            this.min.z < other.max.z &&
            this.max.z > other.min.z
        );
    }
}
