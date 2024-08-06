import { THREE } from '../three-defs.js';

import { getDefaultMaterial } from '../Shaders/Materials';

import GameObject from './GameObject';

const mat = getDefaultMaterial();

class Globe extends THREE.Mesh implements GameObject {

    constructor(params: {pos?: THREE.Vector3, radius?: number}) {
        super();

        const x = params.pos === undefined ? 0 : params.pos.x;
        const y = params.pos === undefined ? 0 : params.pos.y;
        const z = params.pos === undefined ? 0 : params.pos.z;

        const radius = params.radius === undefined ? 10 : params.radius;

        this.geometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, Math.PI * 2, Math.PI/2);
        this.material = mat;

        this.position.set(x, y, z);
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

    toggleWireframe = (): void => {
        mat.wireframe = !mat.wireframe;
    }
}

export default Globe;