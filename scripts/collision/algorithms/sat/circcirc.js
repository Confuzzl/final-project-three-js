import { Circle } from "../../circle.js";
import { CollisionInfo } from "./sat_util.js";

/**
 * @param {Circle} a
 * @param {Circle} b
 */
export function queryCircCirc(a, b) {
    const out = new CollisionInfo();

    const distance2 = a.centroid.distanceToSquared(b.centroid);
    const minDistance2 = (a.radius + b.radius) ** 2;
    console.log(distance2, minDistance2);
    if (distance2 > minDistance2) {
        return out;
    }
    out.isColliding = true;

    const difference = b.centroid.clone().sub(a.centroid);
    const length = difference.length();
    const normal = difference.clone().divideScalar(length);
    out.normalA = normal.clone();
    out.pointA = a.centroid
        .clone()
        .add(normal.clone().multiplyScalar(a.radius));
    out.pointB = b.centroid
        .clone()
        .sub(normal.clone().multiplyScalar(b.radius));
    out.depth = length - a.radius - b.radius;
    return out;
}
