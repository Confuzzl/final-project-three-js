import { Vector2, Vector3 } from "three";

export class Edge {
    /**@type {Polygon}*/
    #parent = null;
    #tail = new Vector2();
    #head = new Vector2();
    normal = new Vector2();

    /**
     * @param {Polygon} parent
     * @param {Vector2} tail
     * @param {Vector2} head
     */
    constructor(parent, tail, head) {
        this.#parent = parent;
        this.#tail = tail;
        this.#head = head;
        this.normal = this.#calculateNormal();
    }

    /**@param {Vector2} point*/
    signedDistance(point) {
        return (
            point.clone().sub(this.tail()).dot(this.normal) /
            this.normal.length()
        );
    }

    #calculateNormal() {
        const tail3 = new Vector3(this.#tail.x, this.#tail.y, 0);
        const head3 = new Vector3(this.#head.x, this.#head.y, 0);
        const up = tail3.cross(head3);
        const this2 = this.asVector();
        const this3 = new Vector3(this2.x, this2.y, 0);
        const norm3 = this3.cross(up);
        return new Vector2(norm3.x, norm3.y).normalize();
    }

    tail() {
        return this.#tail.clone().add(this.#parent.centroid);
    }

    head() {
        return this.#head.clone().add(this.#parent.centroid);
    }

    asVector() {
        return this.#head.clone().sub(this.#tail);
    }

    /**
     * @param {number} t
     * @returns {Vector2}
     */
    at(t) {
        return this.tail().add(this.asVector().multiplyScalar(t));
    }

    /**@param {Vector2} point*/
    containsPoint(point) {
        return (
            this.tail().distanceTo(point) + this.head().distanceTo(point) ===
            this.asVector().length()
        );
    }
}
