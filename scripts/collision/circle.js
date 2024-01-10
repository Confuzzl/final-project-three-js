import { Collidable } from "./collidable.js";

export class Circle extends Collidable {
    /**@type {number}*/
    radius;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     */
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }
}
