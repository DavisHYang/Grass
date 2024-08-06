import { THREE, GLTFLoader, DRACOLoader } from './three-defs.js';

import Bunny from './Characters/Bunny';
import Mickey from './Characters/Mickey';
import Character from './Characters/Character';

/**
 * 
 */
class CharacterManager {
    assetMap: Map<number, Character>;
    loader: GLTFLoader;
    dracoLoader: DRACOLoader;
    id: number;

    /**
     * Creates a new CharacterManager object
     */
    constructor() {
        this.assetMap = new Map();
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.id = 0;
    }

    /**
     *  Adds a character onto the scene
     * @param name the name (id) of the character to add
     * @param pos the position to add the character at
     */
    addCharacter = (scene: THREE.Scene, name: string, pos: THREE.Vector3) : void => {
        if(name === 'bunny') {
            const bunny = new Bunny(this.loader, this.dracoLoader, {pos: pos});
            this.assetMap.set(this.id, bunny);
            this.id++;

            scene.add(bunny);
        }
        if(name === 'mickey') {
            const mickey = new Mickey(this.loader, this.dracoLoader, {pos: pos});
            this.assetMap.set(this.id, mickey);
            this.id++;

            scene.add(mickey);
        }
    }

    /**
     * Retrieves a map containing all characters on the scene
     * @returns a map containing all characters on the scene
     */
    getCharacters = () :  Map<number, Character> => {
        return this.assetMap;
    }
    
    /**
     * Clears the current character Map
     * @param scene the scene to remove the characters from
     * @param objects the set of objects to remove the characters from
     */
    clearCharacters = (scene : THREE.Scene, objects: Set<THREE.Object3D>) : void => {
        this.assetMap.forEach((asset) => {
            scene.remove(asset);
            objects.delete(asset);
        });
        this.assetMap.clear();
        this.id = 0;
    }

    toggleDebug = () : void => {
        this.getCharacters().forEach((chr) => {
            chr.visible = !chr.visible;
        });
    }

    update = (time: number) : void => {
        this.getCharacters().forEach((asset) => {
            asset.update(time);
        });
    }

    dispose = () : void => {
        this.getCharacters().forEach((chr) => {
            chr.dispose();
        })
    }

} export default CharacterManager;