import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { USDLoader } from 'three/addons/loaders/USDLoader.js'
import camryCutout from '../../media/fleet/toyota-camry-2015/01.webp'

const MODEL_URL = '/Toyota_Camry_2020.usdz'

function disposeModel(model: THREE.Object3D) {
  const textures = new Set<THREE.Texture>()
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value)
      }
      material.dispose()
    }
  })
  textures.forEach((texture) => texture.dispose())
}

export default function CamryModel() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch (error) {
      console.error('Unable to initialize the Toyota Camry 3D preview.', error)
      host.dataset.fallback = 'true'
      return
    }

    const small = window.matchMedia('(max-width: 767px)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 1000)
    const key = new THREE.DirectionalLight('#fff2d5', 2.8)
    key.position.set(4, 7, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight('#d5e2ff', 1.6)
    fill.position.set(-6, 3, 2)
    scene.add(fill)
    const rim = new THREE.DirectionalLight('#f4c979', 2.1)
    rim.position.set(2, 4, -6)
    scene.add(rim)

    let model: THREE.Group | undefined
    let frame = 0
    let visible = false
    let disposed = false
    let rotationTarget = 0
    let modelRadius = 1

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = width / height
      if (model) {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov)
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
        const limitingFov = Math.min(verticalFov, horizontalFov)
        const distance = (modelRadius / Math.sin(limitingFov / 2)) * 0.82
        camera.position.set(distance * 0.68, distance * 0.16, distance * 0.68)
        camera.lookAt(0, 0, 0)
      }
      camera.updateProjectionMatrix()
      if (model) renderer.render(scene, camera)
    }

    const render = () => {
      if (!model || disposed) return false
      model.rotation.y += (rotationTarget - model.rotation.y) * 0.045
      renderer.render(scene, camera)
      return renderer.info.render.calls > 0
    }
    const animate = () => {
      render()
      frame = visible && !reducedMotion ? requestAnimationFrame(animate) : 0
    }
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      rotationTarget = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.7
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && model && !reducedMotion) animate()
      else if (!visible && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    observer.observe(host)
    host.addEventListener('pointermove', onPointerMove)

    const loadModel = async () => {
      try {
        const loadedModel = await new USDLoader().loadAsync(MODEL_URL)
        if (disposed) {
          disposeModel(loadedModel)
          return
        }

        const bounds = new THREE.Box3().setFromObject(loadedModel)
        const size = bounds.getSize(new THREE.Vector3())
        const center = bounds.getCenter(new THREE.Vector3())
        const largestDimension = Math.max(size.x, size.y, size.z)
        if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
          throw new Error('The Toyota Camry USDZ model has invalid dimensions.')
        }

        loadedModel.position.sub(center)
        loadedModel.scale.multiplyScalar(4.2 / largestDimension)
        const fittedBounds = new THREE.Box3().setFromObject(loadedModel)
        modelRadius = fittedBounds.getBoundingSphere(new THREE.Sphere()).radius
        host.dataset.modelRadius = modelRadius.toFixed(3)
        let meshCount = 0
        loadedModel.traverse((object) => {
          if (object instanceof THREE.Mesh) meshCount += 1
        })
        if (meshCount === 0) throw new Error('The Toyota Camry USDZ model contains no renderable meshes.')
        model = loadedModel
        scene.add(loadedModel)
        resize()
        if (render()) host.dataset.ready = 'true'
        else host.dataset.fallback = 'true'
        if (visible && !reducedMotion && !frame) animate()
      } catch (error) {
        console.error('Unable to load the Toyota Camry USDZ model.', error)
        host.dataset.fallback = 'true'
      }
    }

    resize()
    void loadModel()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      if (model) disposeModel(model)
      environment.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div ref={hostRef} className="camry-model__stage" aria-hidden="true">
      <img className="camry-model__fallback-image" src={camryCutout} alt="" />
    </div>
  )
}
