import { Vector2 } from "three";

export class CollisionInfo {
    isColliding = false;
    /**@type {Vector2}*/
    pointA;
    /**@type {Vector2}*/
    pointB;
    /**@type {Vector2}*/
    normalA;
    /**@type {number}*/
    depth;

    calculateNormal() {
        this.normalA = this.pointA.clone().sub(this.pointB).normalize();
    }

    getPush() {
        if (!this.normalA) return new Vector2();
        return this.normalA.clone().multiplyScalar(this.depth);
    }
}

/**
 * @param {number} value
 * @param {number} old
 */
const minDepthHeuristic = (value, old) => {
    if (old === undefined) return true;
    return value > old;
};
/**
 * @param {number} value
 * @param {number} old
 */
const maxDepthHeuristic = (value, old) => {
    if (old === undefined) return true;
    return value < old;
};
export const depthHeuristic = minDepthHeuristic;
