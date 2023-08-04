import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

console.time()

//Three scene
const scene = new THREE.Scene;

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,1000)

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene,camera);
camera.position.set(3,4,4);

//gui
const gui = new dat.GUI();

//orbit control
const orbitControl = new OrbitControls(camera, renderer.domElement)
const controlGui = gui.addFolder('Orbit Control')
controlGui.add(orbitControl,'enabled')

//helpers
const gridHelper = new THREE.GridHelper(200,100);
const axesHelper = new THREE.AxesHelper;
scene.add(gridHelper,axesHelper);

//important real time animate function
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  orbitControl.update();
}
animate();

//////
//test cubeMesh 
const cubeMesh= new THREE.Mesh(
  new  THREE.BoxGeometry(5,5,5),
  new THREE.MeshBasicMaterial()
)
scene.add(cubeMesh)

console.timeEnd()