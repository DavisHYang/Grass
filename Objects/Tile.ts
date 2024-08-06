import { THREE } from '../three-defs.js';

import { getFloorMaterial } from '../Shaders/Materials';
import GameObject from './GameObject';

const mat = getFloorMaterial();

class Tile extends THREE.Mesh implements GameObject {

    constructor(params: {pos?: THREE.Vector3, size?: THREE.Vector2, segments?: number}) {
        super();

        const x = params.pos === undefined ? 0 : params.pos.x;
        const y = params.pos === undefined ? 0 : params.pos.y;
        const z = params.pos === undefined ? 0 : params.pos.z;

        const width = params.size === undefined ? 100 : params.size.x;
        const length = params.size === undefined ? 100 : params.size.y;

        const segments = params.segments === undefined ? 1 : params.segments;

        this.geometry = new THREE.PlaneGeometry(width, length, segments, segments);
        this.material = mat;

        this.position.set(x, y, z);
        this.rotateX(- Math.PI / 2);
        this.receiveShadow = true;
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

export default Tile;