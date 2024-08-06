import { THREE } from '../three-defs.js';

interface GameObject extends THREE.Object3D {

    update(deltaTime: number) : void;

    dispose() : void;
    
    toggleWireframe(): void;
}

export default GameObject;