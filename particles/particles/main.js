import './style.css'
import *as THREE from 'three'
import *as dat from'dat.gui'
import  {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

console.time()

//scene
const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1,1000)

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(5);
renderer.render(scene,camera);

//gui setup
const gui = new dat.GUI();

//orbit controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
const controler = gui.addFolder('Orbit Controls')
orbitControls.enabled= false;
controler.add(orbitControls,'enabled').name('Enable');

//animate function important 
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  orbitControls.update();
}
animate();

//helpers
const axeshelper = new THREE.AxesHelper;
scene.add(axeshelper);
const grid = new THREE.GridHelper(200,10)
scene.add(grid);
axeshelper.visible= false;
grid.visible= false;
//gui helpers
const helpersControl = gui.addFolder('Axes Helper');
helpersControl.add(axeshelper, 'visible').name('Visible');
const gridhelper = gui.addFolder('Grid Helper');
gridhelper.add(grid, 'visible').name('Visible');

//texture loader
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('/textures/particles/1.png')


/**
 * particles
 */
const particlesGeom = new THREE.BufferGeometry()   //particles custom buffer geometry
const count = 20000;
const positions = new Float32Array(count * 3); //position atruibute
const colors = new Float32Array(count * 3);   // colour atruibute

for ( let i = 0; i < count*3; i++ ) {
  positions[i]= (Math.random()-0.5)*10;
  colors[i]= Math.random();

};
particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions,3))
particlesGeom.setAttribute('color', new THREE.BufferAttribute(colors,3))

const particlesMat = new THREE.PointsMaterial({       //particle material 
  color: '#ff88cc',
  size: 0.1,
  sizeAttenuation: true
});

particlesMat.transparent = true;
particlesMat.alphaMap= particlesTexture
// particlesMat.alphaTest= 0.001;
// particlesMat.depthTest= false;
particlesMat.depthWrite= false;
particlesMat.blending= THREE.AdditiveBlending
particlesMat.vertexColors=  true;

const particlesMesh = new THREE.Points(particlesGeom,particlesMat) // not mesh but points 
scene.add(particlesMesh);


/**
 * tick function 
 */

const clock = new THREE.Clock();
const tick = ()=>{
  const elaspedTme = clock.getElapsedTime()

  //update particles
  // particlesMesh.rotation.y= elaspedTme*0.3;
  for(let i=0;i<count; i++){
    const i3 = i*3;

    const x = particlesGeom.attributes.position.array[i3] //i3 is poisiton of x and i3+1 is of Y and +2 is of z 
    particlesGeom.attributes.position.array[i3+1]= Math.sin(elaspedTme+x); 
  }
  particlesGeom.attributes.position.needsUpdate= true;

  //update controls
  orbitControls.update()

  //renderer
  renderer.render(scene,camera)

  //call tick again on next frame
  window.requestAnimationFrame(tick)

}
tick();


console.timeEnd();