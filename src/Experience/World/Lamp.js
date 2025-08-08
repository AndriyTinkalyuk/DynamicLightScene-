import Experience from "../Experience"
import * as THREE from 'three'

export default class Lamp {

    constructor() { 
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resourses
        this.debug = this.experience.debug
         this.raycaster = this.experience.raycaster
         this.manualControl = false

        this.resource = this.resources.items.lampModel

        this.setModel()
        this.setDebug()
        this.setResetButton()
    }

       setModel() { 
           this.model = this.resource.scene
           this.model.position.set(0.8, 0.5, 3)
           this.model.scale.set(3, 3, 3)
           console.log(this.model);

           this.light = new THREE.PointLight(0xffecb3, 3, 5)
           this.light.position.set(0, 0.1, 0)
           this.light.scale.set(0.1,0.1,0.1)
           this.light.shadow.camera.near = 10;
           this.light.shadow.camera.far = 25; 


           this.light.castShadow = true
           this.light.intensity = 0
           this.model.add(this.light)

           this.helper = new THREE.PointLightHelper(this.light)
           this.helper.visible = false
           this.scene.add(this.helper)
           
             this.scene.add(this.model)

             this.model.userData.onClick = () => this.toggle()
             this.raycaster.addItem(this.model)
   
             this.model.traverse((child) => {
               if(child instanceof THREE.Mesh) {
                    child.castShadow = true
               }
             })
       }

       setDebug() {
    if (!this.debug.active) return

    this.debugFolder = this.debug.ui.addFolder('Lamp')

    this.debugFolder.add(this.light, 'intensity').min(0).max(10).step(0.1).name('Intensity')
    this.debugFolder.add(this.light, 'distance').min(0).max(20).step(0.1).name('Distance')

    this.debugFolder.addColor({ color: '#ffffff' }, 'color')
        .name('Light color')
        .onChange(value => {
            this.light.color.set(value)
        })

    this.debugFolder.add(this.helper, 'visible').name('Show helper')

    const modelPos = this.model.position
    this.debugFolder.add(modelPos, 'x').min(-10).max(10).step(0.1).name('Model X')
    this.debugFolder.add(modelPos, 'y').min(0).max(10).step(0.1).name('Model Y')
    this.debugFolder.add(modelPos, 'z').min(-10).max(10).step(0.1).name('Model Z')
}


       update(isDay) { 
        if(!this.manualControl) {
        this.light.intensity = isDay ? 0 : 1
        }
       }

       toggle() {
        this.manualControl = true
        this.light.intensity = 1 - this.light.intensity
       }

       resetManualControl() { 
        this.manualControl = false
       }

       setResetButton() { 
        const resetButton = document.querySelector('.reset-button')
        resetButton.addEventListener("click", () => this.resetManualControl())
       }
}