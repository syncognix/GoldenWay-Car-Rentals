import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Brushed-champagne torus-knot "sculpture" — an abstract nod to a road that
 * loops back on itself. Lightweight: one mesh, environment lighting, capped
 * DPR, paused offscreen, fully disposed on unmount.
 */
export default function ChromeSculpture({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      host.dataset.fallback = 'true'
      return
    }
    const small = window.matchMedia('(max-width: 767px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    const geometry = new THREE.TorusKnotGeometry(1.55, 0.36, small ? 180 : 320, small ? 24 : 40, 2, 3)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d8b878'),
      metalness: 1,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      iridescence: 0.15,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const key = new THREE.DirectionalLight('#fff3dc', 2.2)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight('#9fc6ff', 1.2)
    rim.position.set(-5, -2, -3)
    scene.add(rim)

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = width / height
      camera.position.z = width / height < 1 ? 11 : 9
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Pointer tilt
    let px = 0
    let py = 0
    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width - 0.5) * 2
      py = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    host.addEventListener('pointermove', onPointer)

    const clock = new THREE.Clock()
    let raf = 0
    let visible = false
    const render = () => {
      const t = clock.getElapsedTime()
      mesh.rotation.y += ((reduced ? 0 : t * 0.25) + px * 0.5 - mesh.rotation.y) * 0.05
      mesh.rotation.x += (0.35 + py * 0.3 - mesh.rotation.x) * 0.05
      renderer.render(scene, camera)
    }
    const loop = () => {
      render()
      raf = visible && !reduced ? requestAnimationFrame(loop) : 0
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) {
        clock.start()
        loop()
      }
    })
    io.observe(host)
    render()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('pointermove', onPointer)
      geometry.dispose()
      material.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
