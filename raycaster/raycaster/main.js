import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//scene
const scene = new THREE.Scene

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
//camera positon
camera.position.set(0,0,10); 

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//render
renderer.render(scene,camera);

//mouse
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event)=>{
  mouse.x = event.clientX/window.innerWidth*2 -1;
  mouse.y = (event.clientY/window.innerHeight*2 -1)*-1;
})

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

//onjects

const mesh1= new THREE.Mesh(
  new THREE.SphereGeometry(0.5,16,16),
  new THREE.MeshBasicMaterial({color: '#ff0000'})
)
mesh1.position.set(-2,0,0)
//
const mesh2= new THREE.Mesh(
  new THREE.SphereGeometry(0.5,16,16),
  new THREE.MeshBasicMaterial({color: '#ff0000'})
)
mesh2.position.set(0,0,0)
//
const mesh3= new THREE.Mesh(
  new THREE.SphereGeometry(0.5,16,16),
  new THREE.MeshBasicMaterial({color: '#ff0000'})
)
mesh3.position.set(2,0,0)
scene.add(mesh1,mesh2,mesh3)

//raycaster

const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3,0,0)  //custom origin and direction
// const rayDirection = new THREE.Vector3(1,0,0)


///clock funtion
const clock = new THREE.Clock
const tick= ()=>{
  const elapsedTime = clock.getElapsedTime()
  raycaster.setFromCamera(mouse,camera)

  mesh1.position.y = Math.sin(elapsedTime *0.3) *1.5    
  mesh2.position.y = Math.sin(elapsedTime *0.8) *1.5    
  mesh3.position.y = Math.sin(elapsedTime *1.4) *1.5    
  const objectToTest = [mesh1, mesh2, mesh3] // array to check intersect
  const intersects = raycaster.intersectObjects(objectToTest)  //intersect rayccast method

//changes object to red
for (const object of objectToTest){
  object.material.color.set('#ff0000')
}
//change object to blue when intersect
  for(const intersect of intersects ){
    intersect.object.material.color.set('#0000ff')
  }


  orbitControls.update()
  renderer.render(scene,camera)
  window.requestAnimationFrame(tick)  
}
tick()
