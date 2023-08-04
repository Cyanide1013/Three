import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'


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


//parameters 
const parameters={}
parameters.count= 100000;
parameters.size= 0.01;
parameters.radius = 5;
parameters.branches = 5;
parameters.spin = 1;
parameters.randomness= 0.2
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';


//null declaration
let galaxyGeo =null
let galaxyMat =null
let galaxyPoints= null //because to create new galaxy everytime we call functiomm we have to remove previous one

//galaxy function
const generateGalaxy = ()=> {

  if(galaxyPoints != null){
    galaxyGeo.dispose();                                    //checking if it is still null if not(by changing in gui) it will refresh galaxy 
    galaxyMat.dispose();
    scene.remove(galaxyPoints);
  }


  galaxyGeo = new THREE.BufferGeometry()                                        //geometry
  
  const position = new Float32Array(parameters.count *3)                        // position as float32 array
  const colors = new Float32Array(parameters.count *3) 

  for (let i=0; i<parameters.count; i++){                                       //loop for random placement
    //positions
    const i3 = i*3
    const radius = Math.random()*parameters.radius
    const branchAngle= (i% parameters.branches) /parameters.branches *Math.PI *2            // angle between the arms of galaxy
    const spinAngle = radius*parameters.spin

    const randomX = Math.pow(Math.random(),parameters.randomnessPower)* (Math.random()<0.5? 1:-1)
    const randomY = Math.pow(Math.random(),parameters.randomnessPower)* (Math.random()<0.5? 1:-1)
    const randomZ = Math.pow(Math.random(),parameters.randomnessPower)* (Math.random()<0.5? 1:-1)

    position[i3+0] = Math.cos(branchAngle+spinAngle)*radius+randomX                                           // position in x
    position[i3+1] = 0+randomY                                                                                // position in y
    position[i3+2] = Math.sin(branchAngle+spinAngle)*radius+randomZ                                           // position in z
    
    colors[i3+0] =1
    colors[i3+1] =0
    colors[i3+2]= 0
 
  }
  galaxyGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(position,3)
  )
  galaxyGeo.setAttribute(
    'color',
    new THREE.BufferAttribute(colors,3)
  )

  //galaxy material
  galaxyMat = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: true,
    vertexColors:true
  })
  //poinsts
  galaxyPoints = new THREE.Points(galaxyGeo,galaxyMat)
  scene.add(galaxyPoints)

}
generateGalaxy();

//gui of galaxy
const galaxyGUI = gui.addFolder('Galaxy Properties')
galaxyGUI.add(parameters, 'count').max(100000).min(1000).step(100).onFinishChange(generateGalaxy)    //in function element so we will
galaxyGUI.add(parameters, 'size').max(0.1).min(0.001).step(0.001).onFinishChange(generateGalaxy)   // call it again and again
galaxyGUI.add(parameters, 'radius').max(20).min(0.01).step(0.01).onFinishChange(generateGalaxy) 
galaxyGUI.add(parameters, 'branches').max(10).min(2).step(1).onFinishChange(generateGalaxy) 
galaxyGUI.add(parameters, 'spin').max(5).min(-5).step(0.1).onFinishChange(generateGalaxy) 
galaxyGUI.add(parameters, 'randomness').max(2).min(0).step(0.01).onFinishChange(generateGalaxy) 
galaxyGUI.add(parameters, 'randomnessPower').max(10).min(1).step(0.01).onFinishChange(generateGalaxy) 
galaxyGUI.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy) 
galaxyGUI.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy) 