import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { DotScreenPass } from "three/examples/jsm/Addons.js";
import { GlitchPass } from "three/examples/jsm/Addons.js";
import { ShaderPass } from "three/examples/jsm/Addons.js";
import { RGBShiftShader } from "three/examples/jsm/Addons.js";
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import * as THREE from 'three'
import Experience from "../Experience";



export default class Postprocessing {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.renderer = this.experience.renderer.instance

         this.debug = this.experience.debug

        this.setEffectComposer()
        this.setPostprocessing()
        this.setDebug()
    }

    setEffectComposer() {
              this.renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: this.renderer.getPixelRatio() < 1.5 ? 3 : 0
            }
        )

        this.instance =  new EffectComposer(this.renderer, this.renderTarget)

        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)

        this.renderPass = new RenderPass(this.scene, this.camera)

        this.instance.addPass(this.renderPass)


    }

    setPostprocessing() { 
        // DotSreen
        this.dotScreenPass = new DotScreenPass()
        this.dotScreenPass.enabled = false
        this.instance.addPass(this.dotScreenPass)

        // Glitch

        this.glitchPass = new GlitchPass()
        this.glitchPass.enabled = false
        this.instance.addPass(this.glitchPass)

        // unrealBloom
        this.unrealBloomPass = new UnrealBloomPass(
    0.1,        // strength
    0.377,        // radius
    0.262         // threshold
        )
        this.instance.addPass(this.unrealBloomPass)
        this.unrealBloomPass.strength = 0.1
        this.unrealBloomPass.radius = 0.377
        this.unrealBloomPass.threshold = 0.262


        // RGBShaderPass

        this.shaderPass = new ShaderPass(RGBShiftShader)
        this.shaderPass.enabled = false
        this.instance.addPass(this.shaderPass)

        this.gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
        this.instance.addPass(this.gammaCorrectionShader)
    }

    setDebug() { 
        if (this.debug.active) {  
        this.debugFolder = this.debug.ui.addFolder('Postprocessing')
        this.debugFolder.add(this.dotScreenPass, 'enabled').name('DotScreen')
        this.debugFolder.add(this.glitchPass, 'enabled').name('Glitch')
        console.log(this.unrealBloomPass);
        this.debugFolder.add(this.unrealBloomPass, 'enabled')
        this.debugFolder.add(this.unrealBloomPass, 'strength').min(0).max(2).step(0.001)
        this.debugFolder.add(this.unrealBloomPass, 'radius').min(0).max(2).step(0.001)
        this.debugFolder.add(this.unrealBloomPass, 'threshold').min(0).max(1).step(0.001)
        }
    }

    resize() {
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
       this.instance.render(this.scene, this.camera)
    }
}