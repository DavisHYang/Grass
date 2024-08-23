import { THREE } from '../three-defs.js';

import grassVertex from './grass_vertex.glsl.js';
import grassFragment from './grass_fragment.glsl.js';

const defaultMaterial = new THREE.MeshStandardMaterial({
    wireframe: false
});
const floorMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(.0502, .1056, .0701),
    wireframe: false
});

const uniforms = THREE.UniformsUtils.merge(
    [THREE.UniformsLib['lights'],
    THREE.UniformsLib['fog'],
    {
      baseColor: {value: new THREE.Vector3(.0502, .0856, .001)},
      tipColor: {value: new THREE.Vector3(.254, .454, .156)},
      aoColor: {value: new THREE.Vector3(.0502, .1056, .0701)},
      height: {value: 1.5},
    }
    ]
)

const grassMaterial = new THREE.ShaderMaterial({
    vertexShader: grassVertex,
    fragmentShader: grassFragment,
    uniforms: uniforms,
    side: THREE.DoubleSide,
    wireframe: false,
    lights: true,
    fog: true
}); 

export const getDefaultMaterial = () : THREE.MeshStandardMaterial => {
    return defaultMaterial;
}

export const getFloorMaterial = () : THREE.MeshLambertMaterial => {
    return floorMaterial;
}

export const getGrassMaterial = () : THREE.ShaderMaterial => {
    return grassMaterial;
}
