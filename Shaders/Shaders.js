import { THREE, CSMShader } from '../three-defs.js';

class ShaderManager {
  static shaderCode = {};
  static threejs = null;
};

// export function SetThreeJS(threejs) {
//   ShaderManager.threejs = threejs;
// }

export function loadShaders() {
  const loadText =  (url) => {
    const d = fetch(url);
    return d;
  };

  const globalShaders = [
    'header.glsl',
    'common.glsl',
    'oklab.glsl',
    'noise.glsl',
    'sky.glsl',
  ];

  const globalShadersCode = [];
  for (let i = 0; i < globalShaders.length; ++i) {
    globalShadersCode.push(loadText('Shaders/' + globalShaders[i]));
  }

  const loadShader = async (url) => {
    let shaderCode = '';
    for (let i = 0; i < globalShadersCode.length; ++i) {
      shaderCode += globalShadersCode[i] + '\n';
    }
    return shaderCode + '\n';
  }

  ShaderManager.shaderCode['PHONG'] = {
    vertexShader: loadShader('Shaders/phong-lighting-model-vertexShader.glsl'),
    fragmentShader: loadShader('Shaders/phong-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager['GRASS'] = {
    vertexShader: loadShader('Shaders/grass-lighting-model-vertexShader.glsl'),
    fragmentShader: loadShader('Shaders/grass-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager.shaderCode['TERRAIN'] = {
    vertexShader: loadShader('Shaders/terrain-lighting-model-vertexShader.glsl'),
    fragmentShader: loadShader('Shaders/terrain-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager.shaderCode['BUGS'] = {
    vertexShader:   loadShader('Shaders/bugs-lighting-model-vertexShader.glsl'),
    fragmentShader:   loadShader('Shaders/bugs-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager.shaderCode['WIND'] = {
    vertexShader:   loadShader('Shaders/wind-lighting-model-vertexShader.glsl'),
    fragmentShader:   loadShader('Shaders/wind-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager.shaderCode['SKY'] = {
    vertexShader:   loadShader('Shaders/sky-lighting-model-vertexShader.glsl'),
    fragmentShader:   loadShader('Shaders/sky-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager.shaderCode['WATER'] = {
    vertexShader:   loadShader('Shaders/water-lighting-model-vertexShader.glsl'),
    fragmentShader:   loadShader('Shaders/water-lighting-model-fragmentShader.glsl'),
  };

  ShaderManager.shaderCode['WATER-TEXTURE'] = {
    vertexShader:   loadShader('Shaders/water-texture-vertexShader.glsl'),
    fragmentShader:   loadShader('Shaders/water-texture-fragmentShader.glsl'),
  };
} 


export class ShaderMaterial extends THREE.ShaderMaterial {
  constructor(shaderType, parameters) {
    parameters.vertexShader = ShaderManager.shaderCode[shaderType].vertexShader;
    parameters.fragmentShader = ShaderManager.shaderCode[shaderType].fragmentShader;

    super(parameters);
  }
};

export class GamePBRMaterial extends THREE.MeshStandardMaterial {

  #uniforms_ = {};
  #shader_ = null;

  constructor(shaderType, parameters) {
    super(parameters);

    this.#shader_ = null;
    this.#uniforms_ = {};

    ShaderManager.threejs.SetupMaterial(this);

    const previousCallback = this.onBeforeCompile;
    
    this.onBeforeCompile = (shader) => {
        shader.fragmentShader = ShaderManager.shaderCode[shaderType].fragmentShader;
        shader.vertexShader = ShaderManager.shaderCode[shaderType].vertexShader;
        shader.uniforms.time = { value: 0.0 };
        shader.uniforms.playerPos = { value: new THREE.Vector3(0.0) };

        for (let k in this.#uniforms_) {
          shader.uniforms[k] = this.#uniforms_[k];
        }

        this.#shader_ = shader;

        previousCallback(shader);
    };

    this.onBeforeRender = () => {
      if (shaderType == 'BUGS') {
        let a = 0;
      }
      let a = 0;
    }

    this.customProgramCacheKey = () => {
      let uniformStr = '';
      for (let k in this.#uniforms_) {
        uniformStr += k + ':' + this.#uniforms_[k].value + ';';
      }
      return shaderType + uniformStr;
    }
  }

  setFloat(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec2(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec3(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec4(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setMatrix(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTexture(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTextureArray(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }
}

export class GameMaterial extends THREE.MeshPhongMaterial {

  #uniforms_ = {};
  #shader_ = null;

  constructor(shaderType, parameters) {
    super(parameters);

    this.#shader_ = null;
    this.#uniforms_ = {};

    ShaderManager.threejs.SetupMaterial(this);

    const previousCallback = this.onBeforeCompile;

    this.onBeforeCompile = (shader) => {
        shader.fragmentShader = ShaderManager.shaderCode[shaderType].fragmentShader;
        shader.vertexShader = ShaderManager.shaderCode[shaderType].vertexShader;
        shader.uniforms.time = { value: 0.0 };
        shader.uniforms.playerPos = { value: new THREE.Vector3(0.0) };

        for (let k in this.#uniforms_) {
          shader.uniforms[k] = this.#uniforms_[k];
        }

        this.#shader_ = shader;

        previousCallback(shader);
    };

    this.onBeforeRender = () => {
      if (shaderType == 'BUGS') {
        let a = 0;
      }
      let a = 0;
    }

    this.customProgramCacheKey = () => {
      let uniformStr = '';
      for (let k in this.#uniforms_) {
        uniformStr += k + ':' + this.#uniforms_[k].value + ';';
      }
      return shaderType + uniformStr;
    }
  }

  setFloat(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec2(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec3(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec4(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setMatrix(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTexture(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTextureArray(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }
}