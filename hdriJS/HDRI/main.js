import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'

//scene
const scene = new THREE.Scene

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
//camera positon
camera.position.set(4,3,4); 

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//render
renderer.render(scene,camera);

//orbit controls
const orbitControls = new OrbitControls(camera,renderer.domElement);

//animate function (important)

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  orbitControls.update();
}
//call function (important)
animate();

//gui setup
const gui= new dat.GUI();


//helpers
const axesHelper = new THREE.AxesHelper();
const gridHelper = new THREE.GridHelper(200,200, 0xffffff);

axesHelper.visible= false;
gridHelper.visible= false;
//helper gui
const axesGUI = gui.addFolder('Axes Helper');
axesGUI.add(axesHelper,'visible',);
const gridGui = gui.addFolder('Grid Helper');
gridGui.add(gridHelper,'visible');

scene.add(axesHelper,gridHelper);

//objects;

  const spherGeom=  new THREE.SphereGeometry(5,35,35,)
  const sphereMat= new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.2, metalness:1})
  const sphereMesh= new THREE.Mesh(spherGeom,sphereMat)
scene.add(sphereMesh);
//gui cube
const sphereGUI= gui.addFolder('Sphere details')
sphereMesh.visible= false;
sphereGUI.add(sphereMesh, 'visible')
sphereGUI.add(sphereMat, 'roughness').max(10).min(0).step(0.1)
sphereGUI.add(sphereMat, 'roughness').max(10).min(0).step(0.1)
sphereGUI.add(sphereMat, 'metalness').max(1).min(0).step(0.1)


/// HDRI Loader and GUI setup
const hdriLoader = new RGBELoader();

// Array of available HDRIs
const hdriFiles = ['test1.hdr', 'test2.hdr', 'test3.hdr', 'test4.hdr'];
let currentHDRIIndex = 0;

const hdriFolder = gui.addFolder('Change HDRI');

const nextHDRI = () => {
  currentHDRIIndex = (currentHDRIIndex + 1) % hdriFiles.length;
  loadHDRI(currentHDRIIndex);
};

const loadHDRI = (index) => {
  hdriLoader.load(`./static/${hdriFiles[index]}`, (texture) => {                    //update function for path 
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
};

const hdriController = hdriFolder.add({ Next: nextHDRI }, 'Next').name('Next HDRI');

loadHDRI(currentHDRIIndex);