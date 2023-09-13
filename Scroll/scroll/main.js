import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'


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


//light needed to show material

const directionalLight = new THREE.DirectionalLight('#ffffff',3)
directionalLight.position.set(1,0,0)
scene.add(directionalLight)

scene.add(mesh1,mesh2,mesh3)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()