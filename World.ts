import { THREE } from './three-defs.js';

import Tile from './Objects/Tile';
import Grass from './Objects/Grass';

import { clamp } from './Math';
import GameObject from './Objects/GameObject';

type terrain = {
    seed: number;
}

/**
 * Contains everything in a scene related to
 * terrain and other world-building blocks
 */
class World {
    private scene: THREE.Scene;
    private objects: Set<GameObject>;
    private debug: Set<THREE.Object3D>;
    private plane: Tile[];

    /**
     * Creates a new World object with target Scene
     * @param scene the Scene to draw on
     */
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.objects = new Set();
        this.debug = new Set();
        this.plane = [];
    }

    /**
     * Generates a basic floor plane
     * @param scene the scene to add the floor plane to
     */
    generateTerrainPlane = (params: {tiles: number, size: [number, number], segments: number}) : void => {
        this.plane = generateFloorPlane(params.tiles, params.size, params.segments);

        // Generate terrain from given seed
        generateTerrain(this.plane, {seed: 0});

        // Wireframe for debugging
        // const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(plane.geometry));
        // wireframe.applyQuaternion(plane.quaternion);
        // wireframe.visible = false;
        
        this.plane.forEach((tile) => {
            this.scene.add(tile);
            this.objects.add(tile);
        });

        const [gridHelperXZ, gridHelperXY , gridHelperYZ] = generateGridHelper({gridSize: params.tiles * params.size[0]});

        this.scene.add(gridHelperXZ);
        this.scene.add(gridHelperXY);
        this.scene.add(gridHelperYZ);
    
        this.debug.add(gridHelperXZ);
        this.debug.add(gridHelperXY);
        this.debug.add(gridHelperYZ);
    }

    /**
     * Generates the grass on the floor plane
     */
    generateGrass = () : void => {
        this.plane.forEach((tile) => {
            const grass = new Grass(1, {l: 50, w: 50, pos: tile.position, h: flatPlane}, "high");
    
            this.scene.add(grass);
            this.objects.add(grass);
        })
    }

    /**
     * Retrives a set of all objects on the scene
     * @returns a set of all objects on the scene
     */
    getObjects = () : Set<GameObject> => {
        return this.objects;
    }

    toggleDebug = () : void => {
        this.debug.forEach((obj) => {
            obj.visible = !obj.visible;
        });
    }

    toggleWireframe = () : void => {
        this.getObjects().forEach((obj) => {
            obj.toggleWireframe();
        });
    }

    update = (time: number) : void => {
        this.objects.forEach((obj) => {
            obj.update(time);
        });
    }

    dispose = () : void => {
        this.objects.forEach((obj) => {
            obj.dispose();
        });
    }
} export default World;

/**
 * Generates a basic floor plane
 * @param size the size of the floor plane
 * @param segments the number of segments to
 *                  divide the plane into
 */
const generateFloorPlane = (tiles: number, size: [number, number], segments : number) : Tile[] => {
    const plane = [];
    const [WIDTH, LENGTH] = size;

    const offset = WIDTH / 2;
    for(let i = -tiles/2; i < tiles/2; i++) {
        const x = i * WIDTH + offset;
        for(let j = -tiles/2; j < tiles/2; j++) {
            const y = j * WIDTH + offset;
            plane.push(
                new Tile({
                    pos: new THREE.Vector3(x, 0, y),
                    size: new THREE.Vector2(WIDTH, LENGTH), 
                    segments: segments
                }));
        }
    }

    return plane;
}

/**
 * Generates noise onto the given plane based on the seed
 * @param plane the target plane to modify
 * @param type information about how terrain should
 *              be generated
 */
const generateTerrain = (plane: Tile[], type: terrain) : void => {
    plane.forEach((tile) => {
        const vertices = tile.geometry.getAttribute('position');
        for(let i = 0; i < vertices.count; i++) {
            if(type.seed === 0) {
                vertices.setZ(i, flatPlane(vertices.getX(i), vertices.getY(i), vertices.getZ(i)));
            } else if(type.seed === 1) {
                vertices.setZ(i, roundedHill(vertices.getX(i), vertices.getY(i), vertices.getZ(i)));
            } else {

            }
        }
    });
}

const flatPlane = (_x: number, _y: number, z: number) : number => {
    return z;
}

const roundedHill = (x: number, y: number, _z: number) : number => {
    const zero = new THREE.Vector2(0, 0);
    const cur = new THREE.Vector2(x, y);
    const dist = cur.distanceTo(zero);

    let h = 1 - clamp(dist / 50 * Math.sqrt(2));
    h = h * h * h * (h * (h * 6 - 15) + 10) * 5;
    return h;
}

/**
 * Generates a helper grid
 * @param size size of the gridhelper
 * @returns 3 GridHelpers of the desired size
 */
const generateGridHelper = (size: {gridSize: number}) : THREE.GridHelper[] => {
    // GridHelper on XZ plane
    const gridHelperXZ = new THREE.GridHelper(size.gridSize, size.gridSize / 10, 0x000000);

    // GridHelper on XY plane
    const gridHelperXY = new THREE.GridHelper(size.gridSize, size.gridSize / 10, 0x000000);
    gridHelperXY.rotateZ(Math.PI/2);

    // GridHelper on YZ plane
    const gridHelperYZ = new THREE.GridHelper(size.gridSize, size.gridSize / 10, 0x000000);
    gridHelperYZ.rotateX(Math.PI/2);

    gridHelperXZ.visible = false;
    gridHelperXY.visible = false;
    gridHelperYZ.visible = false;

    return [gridHelperXY, gridHelperXZ, gridHelperYZ];
}