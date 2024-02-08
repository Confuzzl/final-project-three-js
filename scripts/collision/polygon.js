import { Vector2, Vector3 } from "three";
import { Collidable } from "./collidable.js";
import { AABB } from "./aabb.js";
import { Edge } from "./edge.js";

export class Polygon extends Collidable {
    /**@type {Vector2[]} */
    localVertices = [];
    /**@type {Edge[]}*/
    edges = [];

    radius = 0;

    /**
     * @param {number} mass
     * @param {number[][]} vertices
     * @param {number} radius
     */
    constructor(mass = 1, vertices, radius) {
        super(mass);
        if (vertices.length < 3) throw new Error("Vertices must be >=3");

        this.localVertices = vertices.map(
            (pair) => new Vector2(pair[0], pair[1])
        );
        this.edges = this.localVertices.map(
            (v, i, arr) => new Edge(this, v, arr[(i + 1) % arr.length])
        );
        this.radius = radius;
        this.moi = this.#calculateMOI();
    }

    /**@param {number} sides*/
    static new(sides, { mass = 1, radius = 1, offset = 0 }) {
        if (sides < 3) throw new Error("Must have at least 3 sides");
        const common = (2 * Math.PI) / sides;
        const vertices = [...Array(sides)].map((_, i) => {
            const theta = common * i + offset;
            return [radius * Math.cos(theta), radius * Math.sin(theta)];
        });
        return new Polygon(mass, vertices, radius);
    }
    clone() {
        return new Polygon(
            this.mass,
            structuredClone(this.localVertices),
            this.radius
        );
    }

    #calculateMOI() {
        // https://www.youtube.com/watch?v=TAML8pPbwEs
        const pin = Math.PI / this.localVertices.length;
        const sin = Math.sin(pin),
            cos = Math.cos(pin);
        return (
            ((this.mass * this.radius * this.radius) / 6) *
            (sin * sin + 3 * cos * cos)
        );
    }

    globalVertices() {
        return this.localVertices.map((v) => {
            const rot = this.rotation;
            const cos = Math.cos(rot),
                sin = Math.sin(rot);
            const x = v.x,
                y = v.y;
            const newX = x * cos - y * sin;
            const newY = y * cos + x * sin;
            return new Vector2(newX, newY).add(this.centroid);
        });
    }

    /**@override*/
    updateAABB() {
        this.aabb = AABB.expandingBase();
        this.globalVertices().forEach((v) => {
            this.aabb.expand(v);
        });
    }

    /**
     * @param {number}
     * @override
     */
    rotate(theta) {
        this.rotation += theta;
        this.updateAABB();
    }
}
