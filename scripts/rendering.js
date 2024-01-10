import {
    Mesh,
    CircleGeometry,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { Collidable } from "./collision/collidable.js";
import { Polygon } from "./collision/polygon.js";
import { Circle } from "./collision/circle.js";
import { Scene2D } from "./scene/scene2d.js";

export const CIRCLE_SEGMENTS = 10;

/**
 * @param {Collidable} collidable
 * @returns {Mesh}
 */
export function collidableToMesh(collidable) {
    if (other instanceof Polygon) return polygonToMesh(collidable);
    if (other instanceof Circle) return circleToMesh(collidable);
    throw new Error("Object was not of type Collidable");
}
/**
 * @param {Polygon} polygon
 * @returns {Mesh}
 */
function polygonToMesh(polygon) {}
/**
 * @param {Circle} circle
 * @returns {Mesh}
 */
function circleToMesh(circle) {
    return Mesh(
        new CircleGeometry(circle.radius, CIRCLE_SEGMENTS),
        Scene2D.defaultMaterial
    );
}
