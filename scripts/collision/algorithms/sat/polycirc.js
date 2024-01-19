import { Polygon } from "../../polygon.js";
import { Circle } from "../../circle.js";
import { CollisionInfo } from "./sat_util.js";
import { depthHeuristic } from "./sat_util.js";
import { Vector2 } from "three";
import { edgeCircleQuery } from "./sat_util.js";

/**
 * @param {Polygon} polygon
 * @param {Circle} circle
 * @param {boolean} reversed
 */
export function queryPolyCirc(polygon, circle, reversed) {
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
        if (!depthHeuristic(info.depth, out.depth)) continue;
        out.depth = info.depth;
        out.pointA = reversed ? info.circlePoint : info.edgePoint;
        out.pointB = reversed ? info.edgePoint : info.circlePoint;
        out.calculateNormal();
    }
    for (const vertex of polygon.globalVertices()) {
        const difference = vertex.clone().sub(circle.centroid);

        const distance = difference.length();
        const depth = distance - circle.radius;
        if (depth > 0) continue;

        out.isColliding = true;
        if (!depthHeuristic(depth, out.depth)) continue;
        out.depth = depth;
        const circlePoint = circle.centroid
            .clone()
            .add(difference.clone().normalize().multiplyScalar(circle.radius));
        out.pointA = reversed ? circlePoint : vertex;
        out.pointB = reversed ? vertex : circlePoint;
        out.calculateNormal();
    }
    return out;
}
