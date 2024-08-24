export default /* glsl */`
uniform vec3 baseColor;
uniform vec3 tipColor;
uniform vec3 aoColor;
uniform float height;
uniform float uTime;

varying vec4 vWorldPosition;

#if NUM_DIR_LIGHTS > 0
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
     };
     uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

#if NUM_HEMI_LIGHTS > 0
	 struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	 };
	 uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
#endif

uniform vec3 ambientLightColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vCamPos;

float easeIn(float x, float t) {
	return pow(x, t);
}
float easeOut(float x, float t) {
	return 1.0 - pow(1.0 - x, t);
}

// Lighting
vec3 ambientLight() {
	vec3 totalAmbient = ambientLightColor;
	return totalAmbient;
}

vec3 diffuseLight() {
	// Directional light calculation
	vec3 totalDirectionalLight = vec3(0);
	vec3 source = (vec3(0, 1, 0));
	vec3 norm = normalize(vNormal);
	
	#if NUM_DIR_LIGHTS > 0
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
			float nDotL = max(
				clamp(dot(normalize(source), -norm), 0.0, 1.0),
				clamp(dot(normalize(source), norm), 0.0, 1.0)
			);

			totalDirectionalLight += nDotL * directionalLights[i].color;
		}
	#endif

	#if NUM_HEMI_LIGHTS > 0
		for( int i = 0; i < NUM_HEMI_LIGHTS; i++ ) {
			float nDotL = max(
				clamp(dot(normalize(source), -norm), 0.0, 1.0),
				clamp(dot(normalize(source), norm), 0.0, 1.0)
			);
			totalDirectionalLight += nDotL * hemisphereLights[i].groundColor;
		}
	#endif

	return totalDirectionalLight;
}

vec3 specularLight() {
	vec3 source = (vec3(0, 10, 0));
	vec3 norm = normalize(vNormal);

	vec3 reflectSource = normalize(reflect(source, norm));
	float specular = max(dot(vec3(-2, 0, -2), reflectSource), dot(vec3(2, 0, 2), reflectSource));
	specular = pow(specular, 4.7);

	return specular * vec3(0.1, 0.1, 0.1);
}
  
#include <fog_pars_fragment>
void main() {
	float heightPercent = vPosition.y / height;
	vec3 color = mix(baseColor, tipColor, easeIn(heightPercent, 1.0));
	color = mix(aoColor, color, easeOut(heightPercent, 10.0));

	vec3 light = vec3(0);
	light += ambientLight();
	light += diffuseLight();
	light += specularLight();


	gl_FragColor = vec4(color * light, 1.0);
	// gl_FragColor = vec4(normalize(vWorldPosition).xyz, 1.0);
	#include <fog_fragment>
}

`;