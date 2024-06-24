uniform vec4 lightPosition;
varying vec3 interpolatedNormal;
varying vec3 interpolatedLight;

// J'ai utilisé les variables uniform pré-définies à la compilation par WebGLRenderer
// Référence: https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram

void main() {

    vec4 coords = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec4 eyeCoords = viewMatrix * coords;

    gl_Position = coords;

    interpolatedNormal = normalize(normalMatrix * normal);

    if (lightPosition.w == 0.0)
    {
      interpolatedLight = normalize(lightPosition.xyz);
    }
    
    else
    {
      interpolatedLight = normalize(lightPosition.xyz / lightPosition.w - eyeCoords.xyz);
    }

}
