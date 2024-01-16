import { Scene2D } from "./scene/scene2d.js";

export const MAIN_SCENE = new Scene2D(window.innerWidth, window.innerHeight);
export const MAIN_SIMULATION = MAIN_SCENE.simulation;
MAIN_SCENE.init();
MAIN_SCENE.render();
