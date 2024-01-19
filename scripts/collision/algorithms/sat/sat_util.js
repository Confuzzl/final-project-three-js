import { Vector2 } from "three";
import { Edge } from "../../edge.js";
import { Circle } from "../../circle.js";
import { Polygon } from "../../polygon.js";

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
 * @param {number | undefined} old
 */
const minDepthHeuristic = (value, old) => {
    if (old === undefined) return true;
    return value > old;
};
/**
 * @param {number} value
 * @param {number | undefined} old
 */
const maxDepthHeuristic = (value, old) => {
    if (old === undefined) return true;
    return value < old;
};
export const depthHeuristic = minDepthHeuristic;

/**
 * @param {Polygon} a
 * @param {Polygon} b
 * @param {Axis} axis
 */
export function projectToAxis(a, b, axis) {
    a.globalVertices().forEach((v) => {
        axis.projectToA(v);
    });
    b.globalVertices().forEach((v) => {
        axis.projectToB(v);
    });
    return axis;
}

/**
 * @param {Vector2} linePoint
 * @param {Vector2} lineDirection
 * @param {Vector2} normal
 * @param {Vector2} point
 */
export function linePointQuery(linePoint, lineDirection, normal, point) {
    const difference = point.clone().sub(linePoint);
    const direction = lineDirection.normalize();
    const dot = difference.dot(direction);
    const distance = difference.dot(normal);
    return {
        point: linePoint.clone().add(direction.multiplyScalar(dot)),
        signedDistance: distance,
    };
}

/**
 * @param {Edge} edge
 * @param {Circle} circle
 */
export function edgeCircleQuery(edge, circle) {
    const info = linePointQuery(
        edge.tail(),
        edge.asVector(),
        edge.normal(),
        circle.centroid.clone()
    );
    const depth =
        Math.sign(info.signedDistance) *
        (Math.abs(info.signedDistance) - circle.radius);
    return {
        edgePoint: info.point.clone(),
        circlePoint: info.point
            .clone()
            .add(edge.normal().multiplyScalar(depth)),
        depth: depth,
    };
}
