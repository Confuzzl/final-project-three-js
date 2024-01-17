import { Vector2 } from "three";
import { Collidable } from "../collidable.js";
import { Polygon } from "../polygon.js";
import { Circle } from "../circle.js";
import { Edge } from "../edge.js";

// https://www.cs.ubc.ca/~rhodin/2020_2021_CPSC_427/lectures/D_CollisionTutorial.pdf

export const EPSILON = 1e-9;

export class CollisionInfo {
    isColliding = false;
    pointA = new Vector2();
    pointB = new Vector2();
    normalA = new Vector2();
    depth = undefined;
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
export function polygonPolygon(a, b) {
    const out = new CollisionInfo();
    return out;
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
const depthHeuristic = minDepthHeuristic;

/**
 * @param {Circle} a
 * @param {Circle} b
 */
export function circleCircle(a, b) {
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

/**
 * @param {Polygon} polygon
 * @param {Circle} circle
 * @param {boolean} reversed
 */
export function polygonCircle(polygon, circle, reversed) {
    const out = new CollisionInfo();
    for (const edge of polygon.edges) {
        // console.log("EDGE");
        const info = edgeCircleQuery(edge, circle);

        if (!circle.contains(edge.tail()) && !circle.contains(edge.head())) {
            // console.log("circle contains neither");

            if (!edge.contains(info.edgePoint)) {
                // console.log("edgepoint not on edge");
                continue;
            }
            const distance2 = info.edgePoint.distanceToSquared(circle.centroid);
            if (distance2 > circle.radius * circle.radius) {
                // console.log("edgepoint inside circle");
                continue;
            }
        }

        out.isColliding = true;
        // if (info.depth >= out.depth) continue;
        console.log(
            info.depth,
            out.depth,
            depthHeuristic(info.depth, out.depth)
        );
        if (!depthHeuristic(info.depth, out.depth)) continue;
        out.depth = info.depth;
        out.pointA = reversed ? info.circlePoint : info.edgePoint;
        out.pointB = reversed ? info.edgePoint : info.circlePoint;
        out.normalA = out.pointA.clone().sub(out.pointB).normalize();
    }
    for (const vertex of polygon.globalVertices()) {
        const distance = vertex.distanceTo(circle.centroid);
        const depth = distance - circle.radius;
        if (depth > 0) continue;

        out.isColliding = true;
        // if (depth >= out.depth) continue;
        if (!depthHeuristic(depth, out.depth)) continue;
        out.depth = depth;
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
