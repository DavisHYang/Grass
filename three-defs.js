
import * as THREE from 'three';

import { Sky } from 'three/examples/jsm/Addons';

import { OrbitControls } from 'three/examples/jsm/Addons';
import Stats from 'three/examples/jsm/libs/stats.module';

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader';
import {ACESFilmicToneMappingShader} from 'three/examples/jsm/shaders/ACESFilmicToneMappingShader';
import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader.js';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

import { CSM } from 'three/examples/jsm/csm/CSM.js';
import { CSMShader } from 'three/examples/jsm/csm/CSMShader';

import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export function Float32ToFloat16(data) {
  const data16 = new Uint16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    data16[i] = THREE.DataUtils.toHalfFloat(data[i]);
  }
  return data16;
}

export {
  THREE, Sky, EffectComposer, ShaderPass, GammaCorrectionShader, ACESFilmicToneMappingShader,
  RenderPass, FXAAShader, UnrealBloomPass,
  FBXLoader, GLTFLoader, DRACOLoader, SkeletonUtils,
  CSM, CSMShader, OrbitControls, Stats
};