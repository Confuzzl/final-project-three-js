import {
    Vector2,
    Quaternion,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";

export class Collidable {
    /**@type {Vector2}*/
    centroid;
    /**@type {Quaternion}*/
    rotation = new Quaternion();

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.centroid = new Vector2(x, y);
    }

    /**@returns {number[]}*/
    centroidArray() {
        return [this.centroid.x, this.centroid.y, 0];
    }
}
