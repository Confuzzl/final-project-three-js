import { Collidable } from "../../collidable.js";
import { Polygon } from "../../polygon.js";
import { Circle } from "../../circle.js";
import { queryCircCirc } from "./circcirc.js";
import { queryPolyCirc } from "./polycirc.js";
import { queryPolyPoly } from "./polypoly.js";

// https://www.cs.ubc.ca/~rhodin/2020_2021_CPSC_427/lectures/D_CollisionTutorial.pdf

/**
 * @param {Collidable} a
 * @param {Collidable} b
 */
export function queryCollision(a, b) {
    if (a instanceof Circle) {
        if (b instanceof Circle) return queryCircCirc(a, b);
        if (b instanceof Polygon) return queryPolyCirc(b, a, true);
    } else if (a instanceof Polygon) {
        if (b instanceof Circle) return queryPolyCirc(a, b, false);
        if (b instanceof Polygon) return queryPolyPoly(a, b);
    }
    throw new Error("Parameters must be of type Collidable");
}
