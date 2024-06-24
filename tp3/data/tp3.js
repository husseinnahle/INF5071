// Testé dans un furteur Edge
// Skybox: https://www.humus.name/index.php?page=Cubemap&item=Nalovardo
// Modèle 3D: https://www.printables.com/model/212457-star-wars-x-wing-s-foils-in-attack-position

"use strict";
import * as THREE from 'three';

import { ArcballControls } from 'three/addons/controls/ArcballControls.js';  // Pour ajouter une interaction avec la souris
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';  // Pour charger un modèle STL


let scene, camera, renderer, canvas, outline;

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result;
}

/* Création de la scène 3D */
function createScene(textures) {
    scene = new THREE.Scene();

    // Ajouter les textures de la carte d'environnement
    scene.background = textures;

    // Ajouter la caméra
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
    camera.position.z = -1.75;

    // Ajouter une faible lumière ambiante
    let ambient_light = new THREE.AmbientLight("white", 0.2);
    scene.add(ambient_light);

    // Ajout une lumière directionnelle liée à la caméra
    let camera_light = new THREE.DirectionalLight("white", 1);
    camera.add(camera_light);
}

function createMaterial(vertShader, fragShader){

    // Couleur diffuse du matériau
    const diffuseColor = new THREE.Vector4(1, 1, 1, 1);

    // Positionner la lumière sur le point de vue de la caméra
    const lightPosition = new THREE.Vector4().applyMatrix4(camera.matrixWorld);

    // Créer le matériau
    return new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        uniforms: {
            diffuseColor: { value: diffuseColor },
            lightPosition: { value: lightPosition }
        }
    });
}

function animate() {     
    requestAnimationFrame(animate);

    // Générer la scène à l'aide de l'effet outline
    outline.render(scene, camera);
}

function init() {
    try {
        canvas = document.getElementById("canvas");
        renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML="<p><b>Sorry, an error occurred:<br>" +
            e + "</b></p>";
        return;
    }

    // Importation des textures
    const textures = new THREE.CubeTextureLoader()
        .setPath( 'textures/' )
        .load([
            'posx.jpg',
            'negx.jpg',
            'posy.jpg',
            'negy.jpg',
            'posz.jpg',
            'negz.jpg'
        ]);
    
    // Création de la scène 3D
    createScene(textures);

    // Création du matériau shader
    const vertexShaderSource = loadFile("./tp3.vert");
    const fragmentShaderSource = loadFile("./tp3.frag");
    let material = createMaterial(vertexShaderSource, fragmentShaderSource);

    // Importation du modèle 3D
    var loader = new STLLoader();
    loader.load("./tp3.stl", function (geometry) {
        var mesh = new THREE.Mesh(geometry, material);    

        // Centrer le modèle dans la scène et ajuster sa taille
        mesh.position.set(-1.4, 0.45, -0.5);
        mesh.scale.set(0.01, 0.01, 0.01);

        scene.add(mesh);
    }); 

    // Ajout de l'interactivité avec la souris
    let controls = new ArcballControls(camera, canvas, scene);
    controls.setGizmosVisible(false);

    // Postprocessing
    outline = new OutlineEffect(renderer, {
        defaultThickness: 0.01,  // Épaisseur
        defaultColor: [0, 0, 0]  // Couleur RGB
    });

    // Animation de la scèene (appelée toutes les 30 ms)
    animate();
}

init();
