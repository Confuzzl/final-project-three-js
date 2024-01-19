import { Polygon } from "../../polygon.js";
import { CollisionInfo, projectToAxis } from "./sat_util.js";
import { depthHeuristic } from "./sat_util.js";
import { Axis } from "../axis.js";
import { Edge } from "../../edge.js";

/**
 * @param {Polygon} a
 * @param {Polygon} b
 */
export function queryPolyPoly(a, b) {
    const out = new CollisionInfo();
    /**@type {{edge: Edge, axis: Axis}[]}*/
    const depths = [];
    for (const edge of a.edges) {
        const axis = projectToAxis(a, b, new Axis(edge.normal()));
        depths.push({
            edge: edge,
            axis: axis,
        });
        if (!axis.isIntersecting()) return out;
        console.log("PROJECTING");
        console.log(edge.asVector());
        console.log(edge.normal());
        console.log(axis.depth());
    }
    depths.sort((a, b) =>
        depthHeuristic(a.axis.depth(), b.axis.depth()) ? -1 : 1
    );
    const best = depths[0];
    out.isColliding = true;
    out.depth = best.axis.depth();
    // depths.forEach((depth) => {
    //     console.log("DEPTH");
    //     console.log(depth.edge.asVector());
    //     console.log(depth.axis.depth());
    // });
    return out;
}
