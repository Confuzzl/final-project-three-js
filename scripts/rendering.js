import { Mesh, CircleGeometry, Shape, ShapeGeometry } from "three.js";
import { Collidable } from "./collision/collidable.js";
import { Polygon } from "./collision/polygon.js";
import { Circle } from "./collision/circle.js";
import { material, randomMaterial } from "./scene/scene2d.js";
import { AABB } from "./collision/aabb.js";

export const CIRCLE_SEGMENTS = 32;

/**
 * @param {Collidable} collidable
 * @returns {Mesh}
 */
export function collidableToMesh(collidable) {
    if (collidable instanceof Polygon) return polygonToMesh(collidable);
    if (collidable instanceof Circle) return circleToMesh(collidable);
    throw new Error("Object was not of type Collidable");
}
/**
 * @param {Polygon} polygon
 * @returns {Mesh}
 */
function polygonToMesh(polygon) {
    const out = new Mesh(
        new ShapeGeometry(new Shape(polygon.localVertices)),
        randomMaterial()
    );
    out.position.set(...polygon.centroidArray());
    return out;
}
/**
 * @param {Circle} circle
 * @returns {Mesh}
 */
function circleToMesh(circle) {
    const out = new Mesh(
        new CircleGeometry(circle.radius, CIRCLE_SEGMENTS),
        randomMaterial()
    );
    out.position.set(...circle.centroidArray());
    return out;
}

/**
 * @param {AABB} aabb
 * @param {number} color
 * @returns {Mesh}
 */
export function aabbToMesh(aabb, color) {
    const out = new Mesh(
        new ShapeGeometry(new Shape(aabb.getVertices())),
        material(color, true)
    );
    return out;
}
