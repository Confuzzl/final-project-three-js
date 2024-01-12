import { Collidable } from "../collidable.js";
import { AABB } from "../aabb.js";

class Node {
    /**@type {Node}*/
    parent = null;

    /**@type {Node}*/
    childA = null;
    /**@type {Node}*/
    childB = null;

    /**@type {AABB}*/
    box = null;

    /**@type {Collidable}*/
    data = null;

    isLeaf() {
        return !this.data;
    }

    updateAABB() {
        this.box = this.isLeaf()
            ? this.data.aabb.clone()
            : this.childA.box.clone().union(this.childB.box);
    }

    getSibling() {
        return this.parent.childA === this
            ? this.parent.childB
            : this.parent.childA;
    }

    /**
     * @param {Node} a
     * @param {Node} b
     */
    makeBranch(a, b) {
        a.parent = this;
        b.parent = this;

        this.childA = a;
        this.childB = b;
    }
    /**@param {Collidable} collidable*/
    makeLeaf(collidable) {
        this.data = collidable;
    }
}

export class QuadTree {
    boundingBox = AABB.expandingBase();
    /**@type {Node}*/
    root = null;

    /**@param {Collidable[]} array*/
    constructor(array) {
        array.forEach((collidable) => {
            this.add(collidable);
        });
    }

    /**@param {Collidable} collidable*/
    add(collidable) {
        if (this.root) {
        } else {
            this.root = new Node();
            this.root.makeLeaf(collidable);
            this.root.updateAABB();
        }
    }
}
