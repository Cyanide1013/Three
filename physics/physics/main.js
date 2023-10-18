import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import CANNON from 'cannon'

//console time
console.time()

//scene
const scene = new THREE.Scene

//camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1,1000)
camera.position.set(-8,3,9)

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //shadow map is enabled
renderer.shadowMap.type= THREE.PCFSoftShadowMap
renderer.render(scene, camera);

//orbit controls

const OrbitControl = new OrbitControls(camera,renderer.domElement)


//animate funcrtion

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera)
  OrbitControl.update();
}
animate();

//////////////////////////////////////////////////////////////////////////// Physics

//world
const world = new CANNON.World();
world.gravity.set(0,-9.82,0)

//material 
const concreteMat = new CANNON.Material('concrete')
const plasticMat = new CANNON.Material('plastic')
const jellyMat = new CANNON.Material('jelly')

const contactMat1 = new CANNON.ContactMaterial(
  concreteMat,
  plasticMat,{
    friction: 0.1,
    restitution: 0.5
  }
)
world.addContactMaterial(contactMat1)

//world sphere
const sphereShape = new CANNON.Sphere(2);
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 10, 0),
  shape: sphereShape,
  material: plasticMat
})
world.addBody(sphereBody)

//world plane 
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body()
planeBody.mass = 0;
planeBody.material = concreteMat
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI*0.5);
world.addBody(planeBody);


/////////////////////////////////////////////////////////////////////////////// Three

//sphere
const sphereGeo = new THREE.SphereGeometry(2,40,40);
const sphereMat= new THREE.MeshStandardMaterial()
const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
sphereMesh.position.set(0,10,0)
sphereMesh.castShadow= true;
scene.add(sphereMesh);

//plane
const plane = new THREE.PlaneGeometry(20,20,5)
const planeMat = new THREE.MeshStandardMaterial({
  color:'#777777',
  metalness:0.3,
  roughness: 0.4
})
const planeMesh = new THREE.Mesh(plane,planeMat)
planeMesh.rotation.x= -Math.PI*0.5
planeMesh.receiveShadow = true;
scene.add(planeMesh);

//light
const directionLight = new THREE.DirectionalLight(0xffffff,2)
directionLight.castShadow= true;
directionLight.shadow.mapSize.set(1024,1024)
directionLight.shadow.camera.far= 20;
directionLight.shadow.camera.left= -10;
directionLight.shadow.camera.right= 10;
directionLight.shadow.camera.top= 10;
directionLight.shadow.camera.bottom= -10;
directionLight.position.set(5,5,5)

const lightHelper = new THREE.DirectionalLightHelper(directionLight,5)
scene.add(directionLight,lightHelper);

//tick function

const clock = new THREE.Clock()
let oldElapsedTimeTime = 0;

const tick = ()=> {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTimeTime
  oldElapsedTimeTime = elapsedTime;

  //update phycics world
  world.step(1/60,deltaTime ,3)

  //phycis on shphere
  sphereMesh.position.copy(sphereBody.position)

  //update controls
  OrbitControl.update();

  //renderer 
  renderer.render(scene,camera);

  //call tick 
  window.requestAnimationFrame(tick);

}
tick();



////////////////////////////////////////////////////////////////////////
//GUI
const gui = new dat.GUI();

//orbit control gui
const OrbitGui = gui.addFolder('Orbit Control')
OrbitGui.add(OrbitControl,'enabled')

//sphere control gui
const sphereControl = gui.addFolder('Sphere Control')
sphereControl.add(sphereMesh,'visible')

//plane control gui
const planeControl = gui.addFolder("Plane Control")
planeControl.add(planeMesh,"visible")

//light control gui
const directionlightControl = gui.addFolder(" Directional Light Control")
directionlightControl.add(directionLight.position,'x').max(10).min(-10).step(1)
directionlightControl.add(directionLight.position,'y').max(10).min(-10).step(1)
directionlightControl.add(directionLight.position,'z').max(10).min(-10).step(1)

directionlightControl.add(lightHelper,'visible').name("Light Helper")




console.timeEnd()