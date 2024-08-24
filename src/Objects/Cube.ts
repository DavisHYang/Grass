import { THREE } from '../three-defs.js';

import { getDefaultMaterial } from '../Shaders/Materials';

import GameObject from './GameObject';

const mat = getDefaultMaterial();

class Cube extends THREE.Mesh implements GameObject {

    constructor(params: {pos?: THREE.Vector3, scale?: THREE.Vector3}) {
        super();

        this.geometry = new THREE.BoxGeometry();
        this.material = mat;
        this.castShadow = true;

        const x = params.pos === undefined ? 0 : params.pos.x;
        const y = params.pos === undefined ? 0 : params.pos.y;
        const z = params.pos === undefined ? 0 : params.pos.z;

        const xScale = params.scale === undefined ? 0 : params.scale.x;
        const yScale = params.scale === undefined ? 0 : params.scale.y;
        const zScale = params.scale === undefined ? 0 : params.scale.z;

        this.position.set(x, y, z);
        this.scale.set(xScale, yScale, zScale);
        this.castShadow = true;
    }

    // Does something in the animation loop
    update = (time: number) : void => {
        time;
    }

    // Dispose
    dispose = () : void => {
        this.traverse((obj) => {
            if((obj as THREE.Mesh).isMesh) {
                (obj as THREE.Mesh).geometry.dispose();
                const temp = (obj as THREE.Mesh).material;
                if(Array.isArray(temp)) {
                    temp.forEach((m) => {
                        m.dispose();
                    })
                } else {
                    temp.dispose();
                }
            }
        })
        this.removeFromParent();
    }

    toggleWireframe = () : void => {
        mat.wireframe = !mat.wireframe;
    }
}

export default Cube;