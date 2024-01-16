import { Vector2 } from "three";
import { MAIN_SCENE } from "./script.js";

export class Simulation {
    gravityStrength = 0.001;
    gravityDirection = new Vector2(0, -1);

    getGravity() {
        return this.gravityDirection
            .clone()
            .multiplyScalar(this.gravityStrength);
    }

    /**@type {Set<GameObject>}*/
    objectSet = new Set();

    /**@param {GameObject} object */
    addGameObject(object) {
        this.objectSet.add(object);
        MAIN_SCENE.add(object.group);
    }

    /**@param {number} dt */
    update(dt) {
        this.objectSet.forEach((object) => {
            object.update(dt);
        });
    }
}
