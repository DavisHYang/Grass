import { THREE } from './three-defs.js';

class LightManager {
    lights: THREE.Light[];

    constructor() {
        this.lights = [];
    }
    /**
     * Generates lights for the scene
     * @returns the lights generated for the scene
     */
    generateLights = () : void => {
        // Ambient light separately (cannot cast shadows)
        this.lights.push(new THREE.AmbientLight(0xFAD6A9, 1));

        // Directional Light + Hemisphere Light (Sun)
        const direct1 = new THREE.DirectionalLight(0xFAD6A9, 2);
        direct1.position.set(-10, 20, 10);
        this.lights.push(direct1);

        const direct2 = new THREE.DirectionalLight(0xFAD6A9, 2);
        direct2.position.set(10, 20, 10);
        this.lights.push(direct2);

        // const direct3 = new THREE.DirectionalLight(0xFAD6A9, 1);
        // direct3.position.set(0, 20, -10);
        // this.lights.push(direct3);

        const hemi = new THREE.HemisphereLight(0xFAD6A9, 0xFAD6A9, 1);
        hemi.position.set(0, 10, 0);
        this.lights.push(hemi);
    }

    getLights = () : THREE.Light[] => {
        return this.lights;
    }

    dispose = () : void => {
        this.lights.forEach((light) => {
            light.dispose();
        })
    }

} export default LightManager;