import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { Tween } from 'gsap/gsap-core'


/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>
    {
        toonMat.color.set(parameters.materialColor)
        pointMat.color.set(parameters.materialColor)

    })

/**
 * Base
 */
// Canvas

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

/**
 * meshes
 */

//texture loader 
const textureloader = new THREE.TextureLoader();
const gradientTexture = textureloader.load('texture/3.jpg')
gradientTexture.magFilter= THREE.NearestFilter;

//test mat
const toonMat= new THREE.MeshToonMaterial(
    {
        color: parameters.materialColor,
        gradientMap: gradientTexture,
})

const objectDistance = 4; // for distancing the mesh ( increse to affect distance)

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    toonMat
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    toonMat
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    toonMat
)



// mesh1.position.y= 2;
// mesh1.scale.set(0.5,0.5,0.5)

// mesh2.position.y= -2;
// mesh2.scale.set(0.5,0.5,0.5)

mesh2.position.y = - objectDistance*1;
mesh3.position.y = - objectDistance*2;
mesh1.position.y = - objectDistance*0;


mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2
scene.add(mesh1,mesh2,mesh3)
const sceneMeshes = [mesh1,mesh2,mesh3]
//light needed to show material

//particles
const particleCOunt = 200
const particlePos = new Float32Array(particleCOunt*3)

for(let i=0; i<particleCOunt; i++){
    particlePos[i*3+0]= (Math.random()-0.5) *10
    particlePos[i*3+1]= objectDistance*0.5-Math.random() *objectDistance * sceneMeshes.length
    particlePos[i*3+2]= (Math.random()-0.5) *10
}
const particleGeom = new THREE.BufferGeometry()
particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos,3))

//points material
const pointMat = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03, 
})

//points 
const pointsMesh = new THREE.Points(particleGeom,pointMat)
scene.add(pointsMesh)

const directionalLight = new THREE.DirectionalLight('#ffffff',3)
directionalLight.position.set(1,0,0)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight


    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

    //camera group
    const cameraGroup = new THREE.Group
    scene.add(cameraGroup)
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 * 
 */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: false,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* scroll */

let scrollY = window.scrollY
let currentSection=0


window.addEventListener('scroll', ()=>{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY/sizes.height)

    if (newSection != currentSection){

        currentSection = newSection

        gsap.to(
            sceneMeshes[currentSection].rotation,{
                duration: 1.5,
                ease: 'power2,inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )

    }
})

const cursor ={}
cursor.x=0;
cursor.y=0;

window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX/sizes.width -0.5;
    cursor.y = event.clientY/sizes.height -0.5;
})

/**
 * Animate
 */
const clock = new THREE.Clock()

let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime= elapsedTime - previousTime
    previousTime = elapsedTime

    //animate camera

    camera.position.y = -scrollY/sizes.height*objectDistance

    const parallaxX = cursor.x  // to create paralax of the objects
    const parallaxY = -cursor.y

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) *0.1 *deltaTime *8
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) *0.1 *deltaTime *8
    //animate meshes 

    for( const mesh of sceneMeshes){
        mesh.rotation.x += deltaTime*0.1
        mesh.rotation.y += deltaTime*0.13
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()