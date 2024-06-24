import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

let canvas, scene, camera, renderer, mesh, material;

function animate() {
    requestAnimationFrame(animate);
    render();
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
    camera.position.set(0, 0, 5);

    let ambient_light = new THREE.AmbientLight(0xFFFFFF, 0.5);
    let camera_light = new THREE.DirectionalLight(0xFFFFFF, 1);
    
    scene.add(ambient_light);
    camera.add(camera_light);

    const vertexShader = `
        uniform mat4 modelview;
        uniform mat4 projection;
        uniform mat3 customNormalMatrix;
        uniform vec4 lightPosition;
        varying vec3 interpolatedNormal;
        varying vec3 interpolatedLight;

        void main() {
            vec4 coords = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vec4 eyeCoords = modelview * coords;
            gl_Position = projection * eyeCoords;

            interpolatedNormal = normalize(customNormalMatrix * normal);

            if (lightPosition.w == 0.0) {
                interpolatedLight = normalize(lightPosition.xyz);
            } else {
                interpolatedLight = normalize(lightPosition.xyz / lightPosition.w - eyeCoords.xyz);
            }
        }
    `;

    const fragmentShader = `
        varying vec3 interpolatedNormal;
        varying vec3 interpolatedLight;

        void main() {
            float intensity = dot(interpolatedNormal, interpolatedLight);
            float threshold = 0.5; // Adjust this threshold as needed

            // Apply toon shading with a step function
            float toonShading = step(threshold, intensity);

            // Output color based on the toon shading
            gl_FragColor = vec4(vec3(toonShading), 1.0);
        }
    `;

    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            modelview: { value: new THREE.Matrix4() },
            projection: { value: new THREE.Matrix4() },
            customNormalMatrix: { value: new THREE.Matrix3() },
            lightPosition: { value: new THREE.Vector4() },
        },
    });

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let controls = new ArcballControls(camera, canvas, scene);
    controls.setGizmosVisible(false);
    animate();
}

function render() {
    const modelviewMatrix = camera.matrixWorldInverse.clone().multiply(mesh.matrixWorld);
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(modelviewMatrix);

    material.uniforms.modelview.value.copy(modelviewMatrix);
    material.uniforms.projection.value.copy(camera.projectionMatrix);
    material.uniforms.customNormalMatrix.value.copy(normalMatrix);
    material.uniforms.lightPosition.value.set(1.0, 1.0, 1.0, 0.0); // Example light position

    renderer.render(scene, camera);
}

init();
