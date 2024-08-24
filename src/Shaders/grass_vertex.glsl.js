export default /* glsl */`
#include <common>
uniform float height;
uniform float uTime;
uniform vec3 uPosition;

attribute vec3 offset;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vCamPos;
varying vec4 vWorldPosition;
varying float vAngle;

mat3 rotateX(float angle) {
	// angle = clamp(angle, -3.14/4.0, 3.14/4.0);
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3(1.0, 0.0, 0.0),
		vec3(0.0, c, s),
		vec3(0.0, -s, c)
	);
}
float easeOut(float x, float t) {
	return 1.0 - pow(1.0 - x, t);
}
vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}



#include <fog_pars_vertex>
  void main() {
    vWorldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

    float angle = .25 * (position.y / height);
    angle += .06 * cnoise(vec2(uTime * .35, 1.0) + vWorldPosition.xz);
    vAngle = angle;

    mat3 grassMat = rotateX(angle);

    vNormal = (instanceMatrix * vec4(grassMat * normal, 0.0)).xyz;
    vPosition = position * grassMat;
    vCamPos = cameraPosition;
    
    vec4 mvPosition = (modelViewMatrix * instanceMatrix * vec4( vPosition, 1.0 ));

    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
  }

`;
