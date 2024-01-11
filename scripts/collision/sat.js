import { Collidable } from "./collidable.js";
import { Edge, Polygon } from "./polygon.js";
import { Circle } from "./circle.js";
import { Vector2 } from "https://unpkg.com/three@0.126.1/build/three.module.js";

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

class Axis {
    direction;

    minA = Number.POSITIVE_INFINITY;
    maxA = Number.NEGATIVE_INFINITY;
    minB = Number.POSITIVE_INFINITY;
    maxB = Number.NEGATIVE_INFINITY;

    /**@param {Vector2} direction*/
    constructor(direction) {
        this.direction = direction.clone();
        this.direction.normalize();
    }

    /**@param {Vector2} point*/
    projectToA(point) {
        const dot = this.direction.dot(point);
        console.log(dot);
        this.minA = Math.min(this.minA, dot);
        this.maxA = Math.max(this.maxA, dot);
    }
    /**@param {Vector2} point*/
    projectToB(point) {
        const dot = this.direction.dot(point);
        console.log(dot);
        this.minB = Math.min(this.minB, dot);
        this.maxB = Math.max(this.maxB, dot);
    }

    depth() {
        return Math.max(this.minA, this.minB) - Math.min(this.maxA, this.maxB);
    }

    isIntersecting() {
        const out = this.depth();
        console.log(out);
        return out < 0;
    }
}

/**
 * @param {Polygon} a
 * @param {Polygon} b
 * @returns {boolean}
 */
function polygonPolygon(a, b) {
    for (const edgeA of a.edges) {
        if (!intersectingOnAxis(a, b, edgeA)) return false;
    }
    for (const edgeB of b.edges) {
        if (!intersectingOnAxis(a, b, edgeB)) return false;
    }
    return true;
}

/**
 * @param {Polygon} a
 * @param {Polygon} b
 * @param {Edge} edge
 * @returns {boolean}
 */
function intersectingOnAxis(a, b, edge) {
    const v = edge.asVector();
    const perp = new Vector2(v.y, -v.x);
    const axis = new Axis(perp);
    console.log(axis.direction);
    a.localVertices.forEach((v) => {
        const vertex = v.clone().add(a.centroid);
        console.log(vertex);
        axis.projectToA(vertex);
    });
    b.localVertices.forEach((v) => {
        const vertex = v.clone().add(b.centroid);
        console.log(vertex);
        axis.projectToB(vertex);
    });
    console.log(
        `${a.localVertices.length}[${axis.minA} ${axis.maxA}] ${b.localVertices.length}[${axis.minB} ${axis.maxB}]`
    );
    const out = axis.isIntersecting();
    console.log(out);
    return out;
}

/**
 * @param {Polygon} a
 * @param {Circle} b
 * @returns {boolean}
 */
function polygonCircle(a, b) {}
