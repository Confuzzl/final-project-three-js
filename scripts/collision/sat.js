import { Collidable } from "./collidable.js";
import { Edge, Polygon } from "./polygon.js";
import { Circle } from "./circle.js";
import { Vector2 } from "three";
import { AABB } from "./aabb.js";

/**
 * @param {Collidable} a
 * @param {Collidable} b
 * @returns {boolean}
 */
export function isColliding(a, b) {
    if (!a.aabb.intersects(b.aabb)) return false;
    return sat(a, b);
}

/**
 * @param {Collidable} a
 * @param {Collidable} b
 * @returns {boolean}
 */
function sat(a, b) {
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
    const minDistance2 = (a.radius + b.radius) ** 2;
    return distance2 < minDistance2;
}

class Axis {
    /**@type {Vector2}*/
    direction = null;

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
        this.minA = Math.min(this.minA, dot);
        this.maxA = Math.max(this.maxA, dot);
    }
    /**@param {Vector2} point*/
    projectToB(point) {
        const dot = this.direction.dot(point);
        this.minB = Math.min(this.minB, dot);
        this.maxB = Math.max(this.maxB, dot);
    }

    depth() {
        return Math.max(this.minA, this.minB) - Math.min(this.maxA, this.maxB);
    }

    isIntersecting() {
        return this.depth() < 0;
    }
}

/**
 * @param {Polygon} a
 * @param {Polygon} b
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
 */
function intersectingOnAxis(a, b, edge) {
    const v = edge.asVector();
    const perp = new Vector2(v.y, -v.x);
    const axis = new Axis(perp);
    a.localVertices.forEach((v) => {
        const vertex = v.clone().add(a.centroid);
        axis.projectToA(vertex);
    });
    b.localVertices.forEach((v) => {
        const vertex = v.clone().add(b.centroid);
        axis.projectToB(vertex);
    });
    return axis.isIntersecting();
}

/**
 * @param {Polygon} a
 * @param {Circle} b
 */
function polygonCircle(a, b) {
    for (const edge of a.edges) if (b.edgeInside(edge)) return true;
    return false;
}
