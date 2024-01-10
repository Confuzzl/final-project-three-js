import { Collidable } from "./collidable.js";
import { Polygon } from "./polygon.js";
import { Circle } from "./circle.js";
import { Vector3 } from "https://unpkg.com/three@0.126.1/build/three.module.js";

/**
 * @param {Collidable} a
 * @param {Collidable} b
 * @returns {boolean}
 */
export function sat(a, b) {
    if (a instanceof Circle) {
        if (b instanceof Circle) return circleCircle(a, b);
        if (b instanceof Polygon) return polygonCircle(b, a);
        throw new Error("Object was not of type Collidable");
    }
    if (a instanceof Polygon) {
        if (b instanceof Circle) return polygonCircle(a, b);
        if (b instanceof Polygon) return polygonPolygon(a, b);
        throw new Error("Object was not of type Collidable");
    }
    throw new Error("Object was not of type Collidable");
}

/**
 * @param {Circle} a
 * @param {Circle} b
 * @returns {boolean}
 */
function circleCircle(a, b) {
    const distance2 = a.centroid.distanceToSquared(b.centroid);
    // console.log(distance2);
    const minDistance2 = (a.radius + b.radius) ** 2;
    // console.log(minDistance2);
    return distance2 < minDistance2;
}
/**
 * @param {Polygon} a
 * @param {Polygon} b
 * @returns {boolean}
 */
function polygonPolygon(a, b) {}
/**
 * @param {Polygon} a
 * @param {Circle} b
 * @returns {boolean}
 */
function polygonCircle(a, b) {}
