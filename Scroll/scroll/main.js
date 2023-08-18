import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples//jsm/controls/OrbitControls'

//scene
const scene = new THREE.Scene()

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene,camera)

//gui 
const gui = new dat.GUI()

//orbit controls
const orbitControl = new OrbitControls(camera, renderer.domElement)