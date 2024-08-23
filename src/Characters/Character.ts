import { THREE } from '../three-defs.js';

interface Character extends THREE.Mesh {
    offset: {
        x: number,
        y: number,
        z: number
    }

    update(deltaTime: number) : void;

    dispose() : void;
}

export default Character;