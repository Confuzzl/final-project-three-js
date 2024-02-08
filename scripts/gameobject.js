import { Group, Mesh, Vector2, Vector3 } from "three";
import { Collidable } from "./collision/collidable.js";
import { MAIN_SCENE, MAIN_SIMULATION } from "./script.js";
import {
    aabbToMesh,
    collidableToMesh,
    randomColor,
    transformAABB,
} from "./rendering.js";

export class GameObject {
    static COUNT = 0;

    group = new Group();

    color = 0;
    /**@type {Mesh}*/
    mainMesh;
    /**@type {Mesh}*/
    aabbMesh;
    showAABB = false;

    /**@type {Collidable}*/
    collidable;

    static = false;

    /**@param {Collidable} collidable*/
    constructor({ x = 0, y = 0 }, collidable, showAABB = false) {
        this.group.name = `GAMEOBJECT_${GameObject.COUNT++}`;
        this.color = randomColor();

        this.collidable = collidable;
        this.collidable.translate(new Vector2(x, y));
        this.showAABB = showAABB;

        this.mainMesh = collidableToMesh(collidable, this.color);
        this.aabbMesh = aabbToMesh(collidable, this.color);

        this.group.position.set(...collidable.centroidArray());
        this.group.add(this.mainMesh);
        this.toggleAABB(showAABB);

        MAIN_SIMULATION.addGameObject(this);
    }

    clone() {
        return new GameObject(
            this.collidable.centroid,
            this.collidable.clone(),
            this.showAABB
        );
    }

    /**@param {boolean} b */
    toggleAABB(b) {
        this.showAABB = b;
        const contains = this.group.children.includes(this.aabbMesh);
        if (this.showAABB) {
            if (contains) return;
            this.group.add(this.aabbMesh);
        } else {
            if (!contains) return;
            this.group.remove(this.aabbMesh);
        }
    }

    /**@param {number} dt */
    update(dt) {
        if (this.static) return;
        this.collidable.update(dt);
        this.refresh();
    }

    refresh() {
        this.#refreshPosition();
        this.#refreshRotation();
    }
    #refreshPosition() {
        this.group.position.x = this.collidable.centroid.x;
        this.group.position.y = this.collidable.centroid.y;
    }
    #refreshRotation() {
        this.mainMesh.setRotationFromAxisAngle(
            new Vector3(0, 0, 1),
            this.collidable.rotation
        );
        transformAABB(this.collidable, this.aabbMesh);
    }

    /**
     * @param {{
     * x: number,
     * y: number
     * }} f
     * @param {{
     * x: number,
     * y: number
     * }} p
     */
    applyForce(f, p) {
        this.collidable.applyForce(f, p);
    }

    /**@param {Vector2} v */
    translate(v) {
        this.collidable.translate(v);
        // this.#refreshPosition();
    }

    /**@param {number} theta */
    rotate(theta) {
        this.collidable.rotate(theta);
        // this.#refreshRotation();
    }
}
