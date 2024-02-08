import { Vector2, Quaternion } from "three";
import { AABB } from "./aabb.js";
import { Simulation } from "../simulation.js";
import { MAIN_SCENE, MAIN_SIMULATION } from "../script.js";

export class Collidable {
    /**@type {AABB}*/
    aabb = AABB.expandingBase();

    mass = 0;
    centroid = new Vector2();
    acceleration = new Vector2();
    velocity = new Vector2();
    force = new Vector2();

    moi = 0;
    rotation = 0;
    alpha = 0;
    omega = 0;
    torque = 0;

    constructor(mass = 1) {
        this.mass = mass;
    }

    /**@abstract*/
    clone() {}

    centroidArray() {
        return [this.centroid.x, this.centroid.y, 0];
    }

    /**@abstract*/
    updateAABB() {}

    /**@param {number} dt*/
    update(dt) {
        this.acceleration = this.force.clone().divideScalar(this.mass);
        this.alpha = this.torque / this.mass;
        this.velocity.add(this.acceleration.clone().divideScalar(dt));
        this.omega += this.alpha / dt;
        this.translate(this.velocity);
        this.rotate(this.omega);
        this.force = new Vector2();
        this.torque = 0;
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
        this.updateLinearVelocity(f);
        this.updateRotationalVelocity(f, p);
    }
    /**
     * @param {{
     * x: number,
     * y: number
     * }} f
     * */
    updateLinearVelocity(f) {
        this.force.set(f.x, f.y);
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
    updateRotationalVelocity(f, p) {
        // https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics
        const r = { x: p.x - this.centroid.x, y: p.y - this.centroid.y };
        this.torque = r.x * f.y - r.y * f.x;
    }

    /**@param {Vector2} v */
    translate(v) {
        this.centroid.add(v);
        this.updateAABB();
    }
    /**@abstract*/
    rotate(theta) {}
}
