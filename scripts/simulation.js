import { Vector2 } from "three";
import { MAIN_SCENE } from "./script";

export class Simulation {
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
