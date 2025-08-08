import Experience from "../Experience"
import * as THREE from 'three'
export default class Environment{ 
    constructor() { 
       this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resourses

        
    }


    setEnvironmentMap() { 
         this.environmentMap = {}
        this.environmentMap.intensity = 0.5
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        
        this.scene.environment = this.environmentMap.texture

 this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()
    }
    }
