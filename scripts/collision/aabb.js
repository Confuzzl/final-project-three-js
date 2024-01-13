import { Vector2 } from "three";

export class AABB {
    /**@type {Vector2}*/
    min = null;
    /**@type {Vector2}*/
    max = null;

    /**
     * @param {Vector2} min
     * @param {Vector2} max
     */
    constructor(min = new Vector2(), max = new Vector2()) {
        this.min = min;
        this.max = max;
    }

    static expandingBase() {
        return new AABB(
            new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
            new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
        );
    }

    clone() {
        return new AABB(this.min, this.max);
    }

    /**@param {Vector2} point*/
    expand(point) {
        this.min.x = Math.min(this.min.x, point.x);
        this.max.x = Math.max(this.max.x, point.x);
        this.min.y = Math.min(this.min.y, point.y);
        this.max.y = Math.max(this.max.y, point.y);
    }

    /**@param {AABB} other*/
    union(other) {
        const out = AABB.expandingBase();
        out.expand(this.min);
        out.expand(this.max);
        out.expand(other.min);
        out.expand(other.max);
        return out;
    }

    size() {
        return this.max.clone().sub(this.min);
    }

    midpoint() {
        return this.min.clone().add(this.max).divideScalar(2);
    }

    getVertices() {
        return [
            this.min,
            new Vector2(this.max.x, this.min.y),
            this.max,
            new Vector2(this.min.x, this.max.y),
        ];
    }

    /**@param {Vector2} point*/
    contains(point) {
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
        return (
            this.min.x < point.x &&
            point.x < this.max.x &&
            this.min.y < point.y &&
            point.y < this.max.y
        );
    }

    /**@param {AABB} other*/
    intersects(other) {
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
        return (
            this.min.x < other.max.x &&
            this.max.x > other.min.x &&
            this.min.y < other.max.y &&
            this.max.y > other.min.y
        );
    }
}
