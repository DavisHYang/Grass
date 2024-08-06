import { THREE } from '../three-defs.js';

import { getGrassMaterial } from '../Shaders/Materials';

import GameObject from './GameObject';

const positions = [
    0, 1.5, 0,
    0.05, .789, 0,
    -0.05, .789, 0,
    .1, .314, 0,
    -.1, .314, 0,
    .11, 0, 0,
    -.11, 0, 0
];

const indices = [
    0, 1, 2,
    2, 3, 4,
    2, 1, 3,
    4, 5, 6,
    4, 3, 5,
];

const positionsLow = [
    0, 1.5, 0,
    .11, 0, 0,
    -.11, 0, 0
]

const indicesLow = [
    0, 1, 2
]

const mat = getGrassMaterial();

class Grass extends THREE.Mesh implements GameObject {

    constructor(density: number, p: {l: number, w: number, pos: THREE.Vector3, h: Function}, LOD: 'high'|'low', scale?: number) {
        super();

        const s = scale === undefined ? 1.0 : scale;

        const geo = new THREE.BufferGeometry();

        const GRASS_BLADES = p.l * p.w * 100;
        const GRASS_X = p.l;
        const GRASS_Y = p.w;

        const mesh = new THREE.InstancedMesh(geo, mat, GRASS_BLADES);

        const xOffset = p.pos.x/2 -.055;
        const yOffset = p.pos.y/2 -.055;
        let index = 0;
        const dummy = new THREE.Object3D();
        for(let i = -GRASS_X/2; i < GRASS_X/2; i+=.1) {
            for(let j = -GRASS_Y/2; j < GRASS_Y/2; j+=.1) {
                if(Math.random() >= 1 - density) {
                    const x = i + (Math.random() * .05 - .025);
                    const y = j + (Math.random() * .05 - .025);
                    const rot = Math.random() * Math.PI;
    
                    const h = p.h(x, y, 0);
                    dummy.position.set(x + p.pos.x - xOffset, p.pos.z + h, y + p.pos.y - yOffset);
                    dummy.rotateY(rot);
                    dummy.updateMatrix();

                    mesh.setMatrixAt(index, dummy.matrix);
                    
                    index++;
                }
            }
        }

        if(LOD === 'high') {
            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
            geo.setIndex(indices);
        } else {
            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionsLow), 3));
            geo.setIndex(indicesLow);
        }
        geo.computeVertexNormals();
        geo.scale(s, s, s);

        mat.uniforms.uTime = {value : 0};

        mesh.matrixWorldNeedsUpdate = true;
        mesh.receiveShadow = true;

        this.add(mesh);
    }

    // Does something in the animation loop
    update = (time: number) : void => {
        mat.uniforms.uTime.value = time;
        mat.uniformsNeedUpdate = true;
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

export default Grass;