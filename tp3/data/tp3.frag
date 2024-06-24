uniform vec4 diffuseColor;
varying vec3 interpolatedNormal;
varying vec3 interpolatedLight;

void main() {

  float intensity = dot(normalize(interpolatedNormal), interpolatedLight);

  gl_FragColor.a = diffuseColor.a;

  if (intensity > 0.95)
  {
    gl_FragColor.rgb = diffuseColor.rgb;
  }
  
  else if (intensity > 0.75)
  {
    gl_FragColor.rgb = diffuseColor.rgb * 0.6;
  }
  
  else if (intensity > 0.45)
  {
    gl_FragColor.rgb = diffuseColor.rgb * 0.4;
  }
  
  else
  {
    gl_FragColor.rgb = diffuseColor.rgb * 0.2;
  }

}
