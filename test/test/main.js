import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'



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
const cubeMesh= new THREE.Mesh(
  new THREE.BoxGeometry(5,5,5,),
  new THREE.MeshBasicMaterial()
);
scene.add(cubeMesh);
//gui cube
const cubeGUI= gui.addFolder('cube details')
cubeMesh.visible= false;
cubeGUI.add(cubeMesh, 'visible')