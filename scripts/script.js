import { Scene2D } from "./scene/scene2d.js";

export const MAIN_SCENE = new Scene2D(window.innerWidth, window.innerHeight);
MAIN_SCENE.init();
MAIN_SCENE.render();
