import './style.css'
import * as THREE from 'three'
import *as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

console.time()
// scene
const scene = new THREE.Scene;
//fog
const fog = new THREE.Fog('#262837',1, 15);
scene.fog=fog;
//camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor('#262837')
camera.position.set(8,4,6);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene,camera);

//gui setup
const gui = new dat.GUI();

//orbitControls
const orbitControls = new OrbitControls(camera,renderer.domElement);
//gui controls
const controler = gui.addFolder('Orbit Controls')
controler.add(orbitControls,'enabled')

//axeshelper
const axeshelper = new THREE.AxesHelper;
scene.add(axeshelper);
const grid = new THREE.GridHelper(200,10)
scene.add(grid);

//loading textures (big taska)_
const textureLoader = new THREE.TextureLoader()

//door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAplhaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientTexture = textureLoader.load('/textures/door/ambient.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

//brick
const bricksColortTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientTexture = textureLoader.load('/textures/bricks/ambient.jpg')
const bricksNormaltTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnesstTexture = textureLoader.load('/textures/bricks/roughness.jpg')
//grass
const grassColortTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientTexture = textureLoader.load('/textures/grass/ambient.jpg')
const grassNormaltTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnesstTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColortTexture.repeat.set(8,8)
grassAmbientTexture.repeat.set(8,8)
grassNormaltTexture.repeat.set(8,8)
grassRoughnesstTexture.repeat.set(8,8)

grassColortTexture.wrapS = THREE.RepeatWrapping
grassAmbientTexture.wrapS = THREE.RepeatWrapping
grassNormaltTexture.wrapS = THREE.RepeatWrapping 
grassRoughnesstTexture.wrapS = THREE.RepeatWrapping

grassColortTexture.wrapT = THREE.RepeatWrapping
grassAmbientTexture.wrapT = THREE.RepeatWrapping
grassNormaltTexture.wrapT = THREE.RepeatWrapping 
grassRoughnesstTexture.wrapT = THREE.RepeatWrapping

////////

//ambienbt Light
const ambient = new THREE.AmbientLight('#b9d5ff',0.12);
//gui
const ambientControl = gui.addFolder('ambient control')
ambientControl.add(ambient,'intensity')

scene.add(ambient);

//
//IMPORTANT Per Tick Render
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  orbitControls.update();
}
animate();


//now the house comes for house party YAY!!!!

//plane mesh 
const planeGeo = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshStandardMaterial({
  map:grassColortTexture,
  aoMap:grassAmbientTexture,
  normalMap: grassNormaltTexture,
  roughnessMap: grassRoughnesstTexture
})
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
planeMesh.rotation.x = -Math.PI*0.5;
planeMesh.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(planeMesh.geometry.attributes.uv.array,2))
scene.add(planeMesh)

//group
const house = new THREE.Group;
scene.add(house);

//wals of house
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4,2.5,4),
  new THREE.MeshStandardMaterial({
    map: bricksColortTexture,
    aoMap: bricksAmbientTexture,
    normalMap:bricksNormaltTexture,
    roughnessMap: bricksRoughnesstTexture
  })
)
  walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))

walls.position.set(0,2.5/2,0);
house.add(walls)


//roof of house
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5,1,4),
  new THREE.MeshStandardMaterial({color: '#b35f45'})
)
roof.position.set(0,3,0)
roof.rotation.y= Math.PI/4
house.add(roof);

//door of the house 

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2,100,100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAplhaTexture,
    aoMap:doorAmbientTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap:doorMetalTexture,
    roughnessMap:doorRoughnessTexture
    
  })
)
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))

door.position.set(0,1,2.01);
house.add(door)

//bushes 
const busheGeom = new THREE.SphereGeometry(1,16,16);
const bushMat = new THREE.MeshStandardMaterial({color: '#89c894'});


const bush1 = new THREE.Mesh(busheGeom,bushMat);
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(busheGeom,bushMat);
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(busheGeom,bushMat);
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(busheGeom,bushMat);
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1,bush2,bush3,bush4);

///graves
const graves = new THREE.Group()

const graveGeo = new THREE.BoxGeometry(0.6, 0.6, 0.2);
const graveMat = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i=0; i<50; i++) {
  const angle = Math.random()*Math.PI*2
  const radius = 3+ Math.random()*7
  const  x= Math.sin(angle)* radius
  const z= Math.cos(angle)* radius

  const graveMesh = new THREE.Mesh(graveGeo,graveMat)
  graveMesh.position.set(x,0.2,z);
  graveMesh.rotation.y= (Math.random()-0.5)*0.4
  graveMesh.castShadow=true
  graves.add(graveMesh)
}
scene.add(graves);


//directional light

const directionalLight = new THREE.DirectionalLight('#b9d5ff',0.12)
directionalLight.position.set(4,5,-2);
//gui directional light
const directionalControl = gui.addFolder('Directional Light')
directionalControl.add(directionalLight.position,'x')
directionalControl.add(directionalLight.position,'y')
directionalControl.add(directionalLight.position,'z')
directionalControl.add(directionalLight, 'intensity')

//door light
const doorLight = new THREE.PointLight('#ff7d46',1,7);
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)

//ghosts booooo

const ghost1 = new THREE.PointLight('#ff00ff',2, 3)
const ghost2 = new THREE.PointLight('#00ffff',2, 3)
const ghost3 = new THREE.PointLight('#ff0000',2, 3)

scene.add(ghost1,ghost2,ghost3)

//clock animate petr tick

const clock = new THREE.Clock()
const tick=()=>{
  const elapsedTime = clock.getElapsedTime()

  //update ghosts
  const ghost1Angle = elapsedTime*0.5
  ghost1.position.x= Math.cos(ghost1Angle)*4
  ghost1.position.z= Math.sin(ghost1Angle)*4
  ghost1.position.y= Math.sin(elapsedTime*3)

  const ghost2Angle = elapsedTime*0.32
  ghost2.position.x= Math.cos(ghost2Angle)*5
  ghost2.position.z= Math.sin(ghost2Angle)*5
  ghost2.position.y= Math.sin(elapsedTime*3)+Math.sin(elapsedTime*2.5)

  const ghost3Angle = -elapsedTime*0.18
  ghost3.position.x= Math.cos(ghost3Angle)*4
  ghost3.position.z= Math.sin(ghost3Angle)*4
  ghost3.position.y= Math.sin(elapsedTime*3)

  //update contols 
  orbitControls.update()

  //render
  renderer.render(scene,camera)

  //call the tick in next frame
  window.requestAnimationFrame(tick)
}
//call function
tick();

//shadows
directionalLight.castShadow= true;

doorLight.castShadow=true;
doorLight.shadow.mapSize.width=256;
doorLight.shadow.mapSize.height=256;
doorLight.shadow.camera.far=7;

ghost1.castShadow=true;
ghost1.shadow.mapSize.width=256;
ghost1.shadow.mapSize.height=256;
ghost1.shadow.camera.far=7;

ghost2.castShadow=true;
ghost2.shadow.mapSize.width=256;
ghost2.shadow.mapSize.height=256;
ghost2.shadow.camera.far=7;

ghost3.castShadow=true;
ghost3.shadow.mapSize.width=256;
ghost3.shadow.mapSize.height=256;
ghost3.shadow.camera.far=7;

walls.castShadow=true;
bush1.castShadow=true;
bush2.castShadow=true;
bush3.castShadow=true;
bush4.castShadow=true;

planeMesh.receiveShadow=true;


console.timeEnd();