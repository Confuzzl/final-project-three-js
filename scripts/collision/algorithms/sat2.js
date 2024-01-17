import { Vector2 } from "three";
import { Collidable } from "../collidable.js";
import { Polygon } from "../polygon.js";
import { Circle } from "../circle.js";
import { Edge } from "../edge.js";

// https://www.cs.ubc.ca/~rhodin/2020_2021_CPSC_427/lectures/D_CollisionTutorial.pdf

export class CollisionInfo {
    isColliding = false;
    pointA = new Vector2();
    pointB = new Vector2();
    normalA = new Vector2();
    depth = 0;

    // /**
    //  * @param {boolean} isColliding
    //  * @param {Vector2} pointA
    //  * @param {Vector2} pointB
    //  * @param {Vector2} normal
    //  * @param {number} depth
    //  */
    // constructor(isColliding, pointA, pointB, normal, depth) {
    //     this.isColliding = isColliding;
    //     this.pointA = pointA;
    //     this.pointB = pointB;
    //     this.normal = normal;
    //     this.depth = depth;
    // }
}

/**
 * @param {Collidable} a
 * @param {Collidable} b
 */
export function sat2(a, b) {
    if (a instanceof Circle) {
        if (b instanceof Circle) return circleCircle(a, b);
        if (b instanceof Polygon) return polygonCircle(b, a, true);
    }
    if (a instanceof Polygon) {
        if (b instanceof Circle) return polygonCircle(a, b, false);
        if (b instanceof Polygon) return polygonPolygon(a, b);
    }
    throw new Error("Parameters must be of type Collidable");
}

/**
 * @param {Polygon} a
 * @param {Polygon} b
 */
function polygonPolygon(a, b) {
    const out = new CollisionInfo();
    return out;
}

/**
 * @param {Circle} a
 * @param {Circle} b
 */
function circleCircle(a, b) {
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
        .add(normal.clone().multiplyScalar(b.radius));
    out.depth = length - a.radius - b.radius;
    return out;
}

/**
 * @param {Polygon} a
 * @param {Circle} b
 * @param {boolean} reversed
 */
function polygonCircle(a, b, reversed) {
    const out = new CollisionInfo();
    for (const edge of a.edges) {
        if (!b.edgeInside(edge)) continue;
    }
    for (const vertex of a.globalVertices()) {
        if (!b.pointInside(vertex)) continue;
    }
    return out;
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
        circle.centroid
    );
    const scale =
        Math.sign(info.signedDistance) *
        (Math.abs(info.signedDistance) - circle.radius);
    console.log(scale);
    return {
        edgePoint: info.point.clone(),
        circlePoint: info.point
            .clone()
            .add(edge.normal().multiplyScalar(scale)),
    };
}
