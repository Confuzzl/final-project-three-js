import { OrthographicCamera } from "three";

export class Camera2D extends OrthographicCamera {
    /**
     * @param {number} width
     * @param {number} height
     * @param {number} zoom
     */
    constructor(width, height, zoom = 50) {
        super(-width / 2, width / 2, height / 2, -height / 2, 1, 100);
        super.lookAt(0, 0, -1);
        this.setZoom(zoom);
    }

    /**@param {number} zoom*/
    setZoom(zoom) {
        super.zoom = zoom;
        super.updateProjectionMatrix();
    }
}
