import { Vector2 } from "three";

export class Force {
    /**@param {number} magnitude */
    static new({ x = 0, y = 0 }, magnitude) {
        return new Vector2(x, y).normalize().multiplyScalar(magnitude);
    }
}
