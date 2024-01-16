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

    /**
     * @param {number} x
     * @param {number} y
     * @param {Collidable} collidable
     * */
    constructor(x, y, collidable, showAABB = false) {
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
        this.#refreshPosition();
    }

    #refreshPosition() {
        this.group.position.x = this.collidable.centroid.x;
        this.group.position.y = this.collidable.centroid.y;
    }

    /**@param {Vector2} v */
    translate(v) {
        this.collidable.translate(v);
        // this.group.position.add(new Vector3(v.x, v.y, 0));
        this.#refreshPosition();
    }

    /**@param {number} theta */
    rotate(theta) {
        this.collidable.rotate(theta);
        this.mainMesh.rotateZ(theta);
        // this.aabbMesh = aabbToMesh(
        //     this.collidable.aabb,
        //     this.mainMesh.material.color
        // );
        transformAABB(this.collidable, this.aabbMesh);
        // const size = this.collidable.aabb.size();
        // this.aabbMesh.scale.x = size.x;
        // this.aabbMesh.scale.y = size.y;
    }
}
