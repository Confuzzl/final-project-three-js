import { Vector2, Vector3 } from "three";

export class Edge {
    /**@type {Polygon}*/
    #parent = null;
    #tail = new Vector2();
    #head = new Vector2();
    #normal = new Vector2();

    /**
     * @param {Polygon} parent
     * @param {Vector2} tail
     * @param {Vector2} head
     */
    constructor(parent, tail, head) {
        this.#parent = parent;
        this.#tail = tail;
        this.#head = head;
        this.#normal = this.#calculateNormal();
    }

    normal() {
        const x = this.#normal.x,
            y = this.#normal.y;
        const rot = this.#parent.rotation;
        const cos = Math.cos(rot),
            sin = Math.sin(rot);
        return new Vector2(x * cos - y * sin, y * cos + x * sin);
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
        const rot = this.#parent.rotation;
        const cos = Math.cos(rot),
            sin = Math.sin(rot);
        const x = this.#tail.x,
            y = this.#tail.y;
        const newX = x * cos - y * sin;
        const newY = y * cos + x * sin;
        const rotated = new Vector2(newX, newY);
        return rotated.add(this.#parent.centroid);
    }

    head() {
        const rot = this.#parent.rotation;
        const x = this.#head.x,
            y = this.#head.y;
        const cos = Math.cos(rot),
            sin = Math.sin(rot);
        const newX = x * cos - y * sin;
        const newY = y * cos + x * sin;
        const rotated = new Vector2(newX, newY);
        return rotated.add(this.#parent.centroid);
    }

    asVector() {
        return this.head().sub(this.tail());
    }

    /**
     * @param {number} t
     * @returns {Vector2}
     */
    at(t) {
        return this.tail().add(this.asVector().multiplyScalar(t));
    }

    /**@param {Vector2} point*/
    contains(point) {
        return (
            this.tail().distanceTo(point) + this.head().distanceTo(point) ===
            this.asVector().length()
        );
    }
}
