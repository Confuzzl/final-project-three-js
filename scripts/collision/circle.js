import { Collidable } from "./collidable.js";

export class Circle extends Collidable {
    /**@type {number}*/
    radius;

    /**@param {number} radius*/
    constructor(radius) {
        super();
        this.radius = radius;
    }
}
