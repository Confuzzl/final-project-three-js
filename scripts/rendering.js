import {
    Mesh,
    CircleGeometry,
    Shape,
    ShapeGeometry,
    LineLoop,
    BufferGeometry,
    PlaneGeometry,
    MeshBasicMaterial,
    Vector2,
    Vector3,
    EdgesGeometry,
    Plane,
    LineBasicMaterial,
} from "three";
import { Collidable } from "./collision/collidable.js";
import { Polygon } from "./collision/polygon.js";
import { Circle } from "./collision/circle.js";
import { AABB } from "./collision/aabb.js";

const CIRCLE_SEGMENTS = 16;

/**@param {number} color*/
export function material(color, wireframe = false) {
    return new MeshBasicMaterial({ color: color, wireframe: wireframe });
}
/**@param {number} color*/
export function lineMaterial(color) {
    return new LineBasicMaterial({ color: color });
}
export function randomMaterial() {
    return material(randomColor());
}
export function randomColor() {
    return Math.floor(Math.random() * (1 << 24));
}

/**
 * @param {Collidable} collidable
 * @param {number} color
 * @returns {Mesh}
 */
export function collidableToMesh(collidable, color) {
    if (collidable instanceof Polygon) return polygonToMesh(collidable, color);
    if (collidable instanceof Circle) return circleToMesh(collidable, color);
    throw new Error("Object was not of type Collidable");
}
/**
 * @param {Polygon} polygon
 * @param {number} color
 * @returns {Mesh}
 */
function polygonToMesh(polygon, color) {
    const out = new Mesh(
        // new ShapeGeometry(new Shape(polygon.globalVertices())),
        new ShapeGeometry(new Shape(polygon.localVertices)),
        material(color)
    );
    // out.position.set(...polygon.centroidArray());
    return out;
}
/**
 * @param {Circle} circle
 * @param {number} color
 * @returns {Mesh}
 */
function circleToMesh(circle, color) {
    const out = new Mesh(
        new CircleGeometry(circle.radius, CIRCLE_SEGMENTS),
        material(color)
    );
    // out.position.set(...circle.centroidArray());
    return out;
}

const baseAABB = new BufferGeometry().setFromPoints([
    new Vector2(-1 / 2, -1 / 2),
    new Vector2(+1 / 2, -1 / 2),
    new Vector2(+1 / 2, +1 / 2),
    new Vector2(-1 / 2, +1 / 2),
]);
/**
 * @param {Collidable} collidable
 * @param {number} color
 * @returns {Mesh}
 */
export function aabbToMesh(collidable, color) {
    const out = new LineLoop(baseAABB, lineMaterial(color));
    return transformAABB(collidable, out);
}

/**
 * @param {Collidable} collidable
 * @param {Mesh} mesh
 */
export function transformAABB(collidable, mesh) {
    const aabb = collidable.aabb;
    const offset = aabb.midpoint().sub(collidable.centroid);
    mesh.position.x = offset.x;
    mesh.position.y = offset.y;
    const size = aabb.size();
    mesh.scale.x = size.x;
    mesh.scale.y = size.y;
    return mesh;
}
