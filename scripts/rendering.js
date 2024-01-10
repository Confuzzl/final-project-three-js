import {
    Mesh,
    CircleGeometry,
    Shape,
    ShapeGeometry,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { Collidable } from "./collision/collidable.js";
import { Polygon } from "./collision/polygon.js";
import { Circle } from "./collision/circle.js";
import { Scene2D } from "./scene/scene2d.js";

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
        new ShapeGeometry(new Shape(polygon.vertices)),
        Scene2D.defaultMaterial
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
        Scene2D.defaultMaterial
    );
    out.position.set(...circle.centroidArray());
    return out;
}
