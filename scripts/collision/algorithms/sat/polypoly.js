import { Polygon } from "../../polygon.js";
import { CollisionInfo, projectToAxis } from "./sat_util.js";
import { depthHeuristic } from "./sat_util.js";
import { Axis } from "../axis.js";
import { Edge } from "../../edge.js";

const PROJECTION_STATES = {
    INTERSECTION: 0,
    NONE: 1,
};

/**
 * @param {Polygon} a
 * @param {Polygon} b
 */
export function queryPolyPoly(a, b) {
    const out = new CollisionInfo();
    /**@type {{edge: Edge, axis: Axis}[]}*/
    const depths = [];

    const ab = projectPolyToPoly(a, b, depths);
    if (ab === PROJECTION_STATES.NONE) return out;
    const ba = projectPolyToPoly(b, a, depths);
    if (ba === PROJECTION_STATES.NONE) return out;

    depths.sort((a, b) =>
        depthHeuristic(a.axis.depth(), b.axis.depth()) ? -1 : 1
    );
    const best = depths[0];
    out.isColliding = true;
    out.depth = best.axis.depth();
    const normal = best.edge.normal();
    out.normalA = best.edge.parent === a ? normal : normal.negate();
    out.normalA = normal;
    return out;
}

/**
 * @param {Polygon} a
 * @param {Polygon} b
 * @param {{edge: Edge, axis: Axis}[]} refDepths
 */
function projectPolyToPoly(a, b, refDepths) {
    // worst case O(n^2)
    for (const edge of a.edges) {
        const axis = projectToAxis(a, b, new Axis(edge.normal()));
        refDepths.push({
            edge: edge,
            axis: axis,
        });
        if (!axis.isIntersecting()) return PROJECTION_STATES.NONE;
    }
    return PROJECTION_STATES.INTERSECTION;
}
