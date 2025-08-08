import * as THREE from 'three'
import Experience from '../Experience'

export default class Sun {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.radius = 15 // радіус кола, по якому рухається сонце
        this.center = new THREE.Vector3(0, 0, 0) // центр сцени
        this.isDay = false
        this.debug = this.experience.debug

          this.initialAngle = Math.PI;

        this.setSun()

        this.time.on('tick', () => {
            this.update()
        })

            if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Sun')

    this.debugFolder.add(this, 'radius')
        .min(5).max(30).step(1).name('Orbit radius')

    this.debugFolder.add(this, 'initialAngle')
        .min(0).max(Math.PI * 2).step(0.01).name('Initial angle')

    this.debugFolder.add(this.sunLight, 'intensity')
        .min(0).max(5).step(0.1).name('Sun light intensity')

    this.debugFolder.addColor({ color: '#ffdd00' }, 'color')
        .name('Sun color')
        .onChange(value => {
            this.sunMesh.material.color.set(value)
        })

    this.debugFolder.add(this.sunLight.shadow, 'normalBias').min(- 0.05).max(0.05).step(0.001)
    this.debugFolder.add(this.sunLight.shadow, 'bias').min(- 0.05).max(0.05).step(0.001)

    this.debugFolder.add(this.scene.children.find(obj => obj.type === 'CameraHelper'), 'visible')
        .name('Shadow camera helper')
        }
    }

    setSun() {
        // Сфера-сонце
        const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32)
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 })
        this.sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
        this.scene.add(this.sunMesh)

        // Освітлення
        this.sunLight = new THREE.DirectionalLight('#ffffff', 0)
        this.sunLight.castShadow = true

        // Тіньова камера
        this.sunLight.shadow.camera.left = -10
        this.sunLight.shadow.camera.right = 10
        this.sunLight.shadow.camera.top = 10
        this.sunLight.shadow.camera.bottom = -10
        this.sunLight.shadow.camera.near = 0.1
        this.sunLight.shadow.camera.far = 35
        this.sunLight.shadow.mapSize.set(1024, 1024)

        this.sunLight.shadow.normalBias = 0.003
        this.sunLight.shadow.bias = - 0.004

        // Target світла 
        this.sunTarget = new THREE.Object3D()
        this.sunTarget.position.set(0, 0, 0)
        this.scene.add(this.sunTarget)
        this.sunLight.target = this.sunTarget

        // Камера-помічник
        const helper = new THREE.CameraHelper(this.sunLight.shadow.camera)
        this.scene.add(helper)
        helper.visible = false

        this.scene.add(this.sunLight)
    }

    update() {
        const elapsed = this.time.elapsed / 1000
           const angle = this.initialAngle + elapsed * 0.3; 

        // Обчислення позиції по колу навколо сцени
        const x = this.center.x + this.radius * Math.cos(angle)
        const y = this.center.y + this.radius * Math.sin(angle)
        const z = this.center.z

        this.isDay = y > 0

        // Рухаємо сонце та світло
        this.sunMesh.position.set(x, y, z)
        this.sunLight.position.copy(this.sunMesh.position)

        // Кут висоти (щоб симулювати інтенсивність)
        const normalizedY = (y + this.radius) / (2 * this.radius) // від 0 до 1
        const intensity = THREE.MathUtils.clamp(normalizedY, 0.1, 0.25) // обмеження інтенсивності від 0.1 до 0.25
        this.sunLight.intensity = intensity
        this.sunMesh.material.color.setHSL(0.15, 1, intensity * 0.1 + 0.25)

        if(!this.isDay) {
            this.sunLight.intensity = 0
        }
    }
}
