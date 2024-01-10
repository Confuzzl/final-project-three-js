import { OrthographicCamera } from "https://unpkg.com/three@0.126.1/build/three.module.js";

export class Camera2D extends OrthographicCamera {
    constructor(width, height, zoom = 50) {
        super(-width / 2, width / 2, height / 2, -height / 2, 1, 100);
        super.lookAt(0, 0, -1);
        this.setZoom(zoom);
    }

    /**
     * @param {number} zoom
     */
    setZoom(zoom) {
        super.zoom = zoom;
        super.updateProjectionMatrix();
    }
}
