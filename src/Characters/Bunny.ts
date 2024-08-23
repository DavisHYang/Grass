import { THREE } from '../three-defs.js';
import { GLTFLoader, DRACOLoader} from 'three/examples/jsm/Addons'

import Character from './Character';

class Bunny extends THREE.Mesh implements Character {
    loader: GLTFLoader;

    offset = {
        x: 0,
        y: 0.9,
        z: 0
    }

    constructor(loader: GLTFLoader, dracoLoader: DRACOLoader, params: {pos?: THREE.Vector3}) {
        super();

        const x = params.pos === undefined ? 0 : params.pos.x;
        const y = params.pos === undefined ? 0 : params.pos.y;
        const z = params.pos === undefined ? 0 : params.pos.z;

        this.geometry = new THREE.BoxGeometry();
        this.position.set(x, y, z);
        this.material = new THREE.MeshBasicMaterial();
        this.material.visible = false;

        this.loader = loader;
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        this.loader.setDRACOLoader(dracoLoader);
        this.loader.load('./public/bunny/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.castShadow = true;
            model.receiveShadow = true;
            model.scale.set(3, 3, 3);
            model.position.set(this.offset.x * model.scale.x + x, 
                this.offset.y * model.scale.y + y, 
                this.offset.z * model.scale.z + z);
            this.attach(model);
        });
    }

    // Does something in the animation loop
    update = (time: number) : void => {
        this.rotation.y += time;
    }

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
}

export default Bunny;