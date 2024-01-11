import { Collidable } from "../collidable.js";
import { AABB } from "../aabb.js";

class Node {
    isLeaf;

    childrenIndices = [];

    leafChild;
    count;

    static createBranch() {}
    static createLeaf() {}
}
export class QuadTree {
    boundingBox = AABB.expandingBase();
    root = new Node();
    nodes = [];

    /**@param {Collidable[]} array*/
    constructor(array) {
        for (const collidable of array) {
        }
    }
}
