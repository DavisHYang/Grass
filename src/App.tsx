import React, { useEffect } from 'react';
import { THREE, OrbitControls, Sky, Stats } from './three-defs.js';

import LightManager from './LightManager';
import World from './World';

import './main.css';
import Cube from './Objects/Cube';

// Camera settings
const CAM = {
  FOV: 75, 
  aspectRatio: window.innerWidth / window.innerHeight, 
  near: 0.6, 
  far: 100
};

// Ground plane settings
const WORLD = {
  TILES: 1,
  TILE_SIZE: 50,
  TILE_SEGMENTS: 10,
};


const App = () => {
  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true, 
      alpha: true
    });

    const world = new World(scene);
    const lights = new LightManager();
    
    const clock = new THREE.Clock();
    const stats = new Stats();
    stats.showPanel(2);
    document.body.append(stats.dom);

    scene.fog = new THREE.Fog(0xFAD6A9, 10, 150);

  
    /*************************/
    /*** Renderer + Camera ***/
    /*************************/


    // Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);
  
    // Camera
    const FOV = CAM.FOV;
    const aspectRatio = CAM.aspectRatio;
    const near = CAM.near;
    const far = CAM.far;

    const camera = new THREE.PerspectiveCamera(FOV, aspectRatio, near, far);
    camera.position.set(0, 3, -25);

    const sky = new Sky();
    sky.scale.setScalar((WORLD.TILES+1) * WORLD.TILE_SIZE);
    sky.material.uniforms['sunPosition'].value = new THREE.Vector3(0, 2.56, 100);
    sky.material.uniforms['turbidity'].value = 10;
    sky.material.uniforms['rayleigh'].value = 3;
    sky.material.uniforms['mieCoefficient'].value = 0.005;
    sky.material.uniforms['mieDirectionalG'].value = 0.7;
    scene.add(sky);

    // Camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = WORLD.TILES * WORLD.TILE_SIZE;
    controls.minDistance = 0;
    controls.enableDamping = true;


    /*******************************************/
    /*** Initialize Scene (lighting) ***/
    /*******************************************/


    // Initalize the lights
    lights.generateLights()
    lights.getLights().forEach((l) => {
      scene.add(l);
    })

    
    /****************************************************/
    /*** World Creation (populate world with objects) ***/
    /****************************************************/


    // World terrain plane
    const grassParams = {
      tiles: WORLD.TILES, 
      width: WORLD.TILE_SIZE,
      length: WORLD.TILE_SIZE,
      segments: WORLD.TILE_SEGMENTS};

    world.generateTerrainPlane({
      tiles: grassParams.tiles, 
      size: [grassParams.width, grassParams.length], 
      segments: grassParams.segments
    });

    world.generateGrass();

    const cube = new Cube({pos: new THREE.Vector3(0, 2.5, 0), scale: new THREE.Vector3(5,5,5)});
    scene.add(cube);

    
    /************************/
    /*** User Interaction ***/
    /************************/


    // Make window responsive to resizing
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // toggle debug
    window.addEventListener('keypress', (k) => {
      if(k.key === 'q'){
        world.toggleDebug();
      }

      if(k.key === 'w'){
        world.toggleWireframe();
      }
    });

    // Make window scroll to top on load
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
      world.dispose();
      lights.dispose();
      sky.removeFromParent();

      scene.removeFromParent();

      camera.removeFromParent();

      renderer.setAnimationLoop(null);
      renderer.dispose();
    }
  

    /*******************/
    /*** Render Loop ***/
    /*******************/



    // Scene render/update
    const render = () => {
      controls.update();

      stats.begin();
      
      // const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      world.update(elapsed);

      // Render
      renderer.render(scene, camera);
      stats.end();
    };

    renderer.setAnimationLoop(null);
    renderer.setAnimationLoop(render);
  }, []);

  return <div></div>
}
export default App;