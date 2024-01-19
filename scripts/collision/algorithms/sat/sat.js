// import { Collidable } from "../../collidable.js";
// import { Polygon } from "../../polygon.js";
// import { Edge } from "../../edge.js";
// import { Circle } from "../../circle.js";
// import { Vector2 } from "three";
// import { AABB } from "../../aabb.js";
// import { Axis } from "../axis.js";

// /**
//  * @param {Collidable} a
//  * @param {Collidable} b
//  * @returns {boolean}
//  */
// export function isColliding(a, b) {
//     if (!a.aabb.intersects(b.aabb)) return false;
//     return sat(a, b);
// }

// /**
//  * @param {Collidable} a
//  * @param {Collidable} b
//  * @returns {boolean}
//  */
// function sat(a, b) {
//     if (a instanceof Circle) {
//         if (b instanceof Circle) return circleCircle(a, b);
//         if (b instanceof Polygon) return polygonCircle(b, a);
//         throw new Error("Object was not of type Collidable");
//     }
//     if (a instanceof Polygon) {
//         if (b instanceof Circle) return polygonCircle(a, b);
//         if (b instanceof Polygon) return polygonPolygon(a, b);
//         throw new Error("Object was not of type Collidable");
//     }
//     throw new Error("Object was not of type Collidable");
// }

// /**
//  * @param {Circle} a
//  * @param {Circle} b
//  * @returns {boolean}
//  */
// function circleCircle(a, b) {
//     const distance2 = a.centroid.distanceToSquared(b.centroid);
//     const minDistance2 = (a.radius + b.radius) ** 2;
//     return distance2 < minDistance2;
// }

// /**
//  * @param {Polygon} a
//  * @param {Polygon} b
//  */
// function polygonPolygon(a, b) {
//     for (const edgeA of a.edges) {
//         if (!intersectingOnAxis(a, b, edgeA)) return false;
//     }
//     for (const edgeB of b.edges) {
//         if (!intersectingOnAxis(a, b, edgeB)) return false;
//     }
//     return true;
// }

// /**
//  * @param {Polygon} a
//  * @param {Circle} b
//  */
// function polygonCircle(a, b) {
//     for (const edge of a.edges) if (b.edgeInside(edge)) return true;
//     return false;
// }
