import {
    Vector3,
    Quaternion,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";

export class Collidable {
    /**@type {Vector3}*/
    centroid;
    /**@type {Quaternion}*/
    rotation = new Quaternion();

    /**
     * @param {Vector3} centroid
     */
    constructor(centroid) {
        this.centroid = centroid;
    }
}
