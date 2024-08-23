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
        const direct = new THREE.DirectionalLight(0xFAD6A9, 5);
        direct.position.set(0, 10, 0);
        this.lights.push(direct);
        // const hemi = new THREE.HemisphereLight(0xFFFFFF, 0x228B22, 3);
        // hemi.position.set(0, 10, 0);
        // this.lights.push(hemi);
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