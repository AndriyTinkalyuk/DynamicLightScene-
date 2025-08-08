import * as THREE from 'three'
import Experience from '../Experience'
import Environment  from './Environment'
import Floor from './Floor'
import House from './House'
import Sun from './Sun'
import Table from './Table'
import Lamp from './Lamp'
import StreetLamp from './StreetLight'
import { Sky } from 'three/examples/jsm/Addons.js'

export default class World {
    constructor() { 
        this.experience = new Experience()
        this.scene  = this.experience.scene
        this.resources = this.experience.resourses
        
    
            // Setup
            this.lamp = new Lamp()
            this.streetLight = new StreetLamp()
            this.sun = new Sun()
            this.floor = new Floor()
            this.house = new House()
            this.table = new Table()
            this.environment = new Environment()

            this.scene.fog = new THREE.FogExp2("#02343f", 0.02)
           
        this.setAmbientLight()
        this.setSky()
    }

     setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
        this.scene.add(this.ambientLight)
    }

    setSky() {
        this.sky = new Sky()
        this.sky.scale.set(100, 100, 100)
        this.scene.add(this.sky)
        this.sky.material.uniforms['turbidity'].value = 10
        this.sky.material.uniforms['rayleigh'].value = 3
        this.sky.material.uniforms['mieCoefficient'].value = 0.1
        this.sky.material.uniforms['mieDirectionalG'].value = 0.95
        this.sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

        
    }


    update(){
        this.lamp.update(this.sun.isDay)
        this.streetLight.update(this.sun.isDay)

          const sunIntensity = this.sun.sunLight.intensity

        // Плавно змінюємо інтенсивність ambientLight
        this.ambientLight.intensity += (sunIntensity - this.ambientLight.intensity) * 0.05

        // Плавно змінюємо інтенсивність sky
      if(this.sun.sunLight.position.y < 0 && this.sun.sunLight.position.y > - 5) {
            this.sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
        } else {
            this.sky.material.uniforms['sunPosition'].value.copy(this.sun.sunLight.position)
        }
    }
}