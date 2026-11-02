import * as THREE from 'three'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const SPACING_X = 22 // Jarak antar stasiun di sepanjang sumbu X

export function useThreeScene(canvasRef, config) {
  let renderer = null
  let scene = null
  let camera = null
  let animationFrameId = null

  // Groups and objects
  let stationsGroup = new THREE.Group()
  let particlesMesh = null
  let gridFloor = null
  let pointLights = []
  let ambientLight = null
  let dirLight = null

  // Pointer & Raycaster
  const pointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  let hoveredMesh = null
  let isDragging = false
  let previousMouseX = 0

  // Camera targets for smooth lerping
  let targetCamX = 0
  let targetCamY = 0.8
  let targetCamZ = 11

  // Mouse Parallax targets
  let mouseTargetX = 0
  let mouseTargetY = 0

  function init() {
    if (!canvasRef.value) return

    const width = window.innerWidth
    const height = window.innerHeight

    // 1. Scene & Fog
    scene = new THREE.Scene()
    scene.background = new THREE.Color(config.sceneSettings.fogColor || '#07080e')
    scene.fog = new THREE.FogExp2(
      config.sceneSettings.fogColor || '#07080e',
      config.sceneSettings.fogDensity || 0.015
    )

    // 2. Camera
    camera = new THREE.PerspectiveCamera(
      config.sceneSettings.cameraFov || 55,
      width / height,
      0.1,
      1000
    )
    camera.position.set(0, config.sceneSettings.cameraHeight || 0.8, config.sceneSettings.cameraDistance || 11)

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // 4. Lighting
    setupLights()

    // 5. Grid Floor Highway
    setupGridHighway()

    // 6. Particle Field
    setupParticles()

    // 7. Stations
    scene.add(stationsGroup)
    rebuildStations()

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize)
    window.addEventListener('pointermove', onPointerMove)

    // 9. Start Loop
    animate()
  }

  function setupLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, config.sceneSettings.ambientIntensity || 1.2)
    scene.add(ambientLight)

    dirLight = new THREE.DirectionalLight(0xffffff, config.sceneSettings.lightIntensity || 2.2)
    dirLight.position.set(10, 20, 15)
    scene.add(dirLight)
  }

  function setupGridHighway() {
    const gridHelper = new THREE.GridHelper(300, 60, 0x00f2fe, 0x1e293b)
    gridHelper.position.y = -3.5
    gridFloor = gridHelper
    scene.add(gridFloor)
  }

  function setupParticles() {
    if (particlesMesh) {
      scene.remove(particlesMesh)
      particlesMesh.geometry.dispose()
      particlesMesh.material.dispose()
    }

    const count = config.sceneSettings.particleCount || 1600
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const color1 = new THREE.Color(0x00f2fe)
    const color2 = new THREE.Color(0x9d4edd)

    for (let i = 0; i < count; i++) {
      // Distribusikan partikel di sepanjang sumbu horizontal X
      positions[i * 3] = (Math.random() - 0.2) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35 - 5

      const mixed = color1.clone().lerp(color2, Math.random())
      colors[i * 3] = mixed.r
      colors[i * 3 + 1] = mixed.g
      colors[i * 3 + 2] = mixed.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    })

    particlesMesh = new THREE.Points(geometry, material)
    scene.add(particlesMesh)
  }

  function createShapeMesh(sec, idx) {
    const group = new THREE.Group()
    group.position.x = idx * SPACING_X
    group.position.y = 0
    group.position.z = 0

    let mainGeo
    const shape = sec.shapeType || 'torusKnot'

    switch (shape) {
      case 'torusKnot':
        mainGeo = new THREE.TorusKnotGeometry(2.1, 0.6, 128, 32)
        break
      case 'icosahedron':
        mainGeo = new THREE.IcosahedronGeometry(2.6, 1)
        break
      case 'cyberMonolith':
        mainGeo = new THREE.BoxGeometry(2.2, 4.4, 2.2)
        break
      case 'chromeSphere':
        mainGeo = new THREE.SphereGeometry(2.3, 64, 64)
        break
      case 'portalRing':
        mainGeo = new THREE.TorusGeometry(2.8, 0.35, 30, 100)
        break
      case 'wireframeCube':
      default:
        mainGeo = new THREE.BoxGeometry(3.0, 3.0, 3.0)
        break
    }

    const primCol = new THREE.Color(sec.primaryColor || '#00f2fe')
    const accCol = new THREE.Color(sec.accentColor || '#9d4edd')

    // Material utama
    const material = new THREE.MeshStandardMaterial({
      color: primCol,
      emissive: primCol,
      emissiveIntensity: 0.25,
      metalness: 0.85,
      roughness: 0.18,
      wireframe: !!sec.wireframe
    })

    const mainMesh = new THREE.Mesh(mainGeo, material)
    mainMesh.userData = { sectionIndex: idx, isMainShape: true }
    group.add(mainMesh)

    // Aksen tambahan berdasarkan jenis bentuk
    if (shape === 'chromeSphere') {
      const ringGeo = new THREE.TorusGeometry(3.8, 0.08, 16, 80)
      const ringMat = new THREE.MeshBasicMaterial({ color: accCol, wireframe: true })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2.3
      ring.userData = { isOrbitalRing: true }
      group.add(ring)
    } else if (shape === 'portalRing') {
      const coreGeo = new THREE.OctahedronGeometry(1.2, 0)
      const coreMat = new THREE.MeshStandardMaterial({ color: accCol, wireframe: true })
      const core = new THREE.Mesh(coreGeo, coreMat)
      core.userData = { isInnerCore: true }
      group.add(core)
    } else if (shape === 'cyberMonolith') {
      // Glow wireframe shell
      const shellGeo = new THREE.BoxGeometry(2.4, 4.6, 2.4)
      const shellMat = new THREE.MeshBasicMaterial({ color: accCol, wireframe: true, transparent: true, opacity: 0.4 })
      group.add(new THREE.Mesh(shellGeo, shellMat))
    }

    // Point Light lokal di setiap stasiun
    const pLight = new THREE.PointLight(accCol, 4.0, 14)
    pLight.position.set(0, 3.0, 2.0)
    group.add(pLight)
    pointLights.push(pLight)

    return group
  }

  function rebuildStations() {
    // Clear old objects
    while (stationsGroup.children.length > 0) {
      const child = stationsGroup.children[0]
      stationsGroup.remove(child)
      child.traverse((node) => {
        if (node.geometry) node.geometry.dispose()
        if (node.material) {
          if (Array.isArray(node.material)) node.material.forEach(m => m.dispose())
          else node.material.dispose()
        }
      })
    }
    pointLights = []

    // Build each station from config.sections
    config.sections.value.forEach((sec, idx) => {
      const station = createShapeMesh(sec, idx)
      stationsGroup.add(station)
    })
  }

  function onWindowResize() {
    if (!renderer || !camera) return
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  function onPointerMove(e) {
    // Normalized device coordinates (-1 to +1)
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

    mouseTargetX = pointer.x * 0.8
    mouseTargetY = pointer.y * 0.4
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate)

    // 1. Camera horizontal positioning target
    targetCamX = (config.activeSectionIndex.value || 0) * SPACING_X
    targetCamY = (config.sceneSettings.cameraHeight || 0.8) + mouseTargetY
    targetCamZ = config.sceneSettings.cameraDistance || 11

    // Smooth lerp camera movement
    camera.position.x += (targetCamX + mouseTargetX - camera.position.x) * 0.055
    camera.position.y += (targetCamY - camera.position.y) * 0.055
    camera.position.z += (targetCamZ - camera.position.z) * 0.055

    // Camera looks slightly ahead along the track
    camera.lookAt(camera.position.x, 0.4, 0)

    // 2. Rotate shapes at each station
    if (config.sceneSettings.autoRotate) {
      const rotSpeed = 0.012 * (config.sceneSettings.autoRotateSpeed || 1.0)
      stationsGroup.children.forEach((group, idx) => {
        group.children.forEach((child) => {
          if (child.userData.isMainShape) {
            child.rotation.x += rotSpeed * 0.7
            child.rotation.y += rotSpeed
          } else if (child.userData.isOrbitalRing) {
            child.rotation.z += rotSpeed * 1.5
          } else if (child.userData.isInnerCore) {
            child.rotation.y -= rotSpeed * 2.0
            child.rotation.x += rotSpeed
          }
        })
      })
    }

    // 3. Gentle particle drift
    if (particlesMesh) {
      particlesMesh.rotation.y += 0.0003
      particlesMesh.rotation.x += 0.0002
    }

    // 4. Raycasting for hover highlights
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(stationsGroup.children, true)
    const validHit = intersects.find(hit => hit.object.userData.isMainShape)

    if (validHit) {
      if (hoveredMesh !== validHit.object) {
        if (hoveredMesh) hoveredMesh.scale.set(1.0, 1.0, 1.0)
        hoveredMesh = validHit.object
        hoveredMesh.scale.set(1.08, 1.08, 1.08)
      }
    } else {
      if (hoveredMesh) {
        hoveredMesh.scale.set(1.0, 1.0, 1.0)
        hoveredMesh = null
      }
    }

    renderer.render(scene, camera)
  }

  // Watchers to update 3D world reactively
  watch(
    () => config.sections.value,
    () => {
      rebuildStations()
    },
    { deep: true }
  )

  watch(
    () => config.sceneSettings,
    (newSettings) => {
      if (scene) {
        scene.background.set(newSettings.fogColor)
        scene.fog.color.set(newSettings.fogColor)
        scene.fog.density = newSettings.fogDensity
      }
      if (ambientLight) ambientLight.intensity = newSettings.ambientIntensity
      if (dirLight) dirLight.intensity = newSettings.lightIntensity
      if (camera) {
        camera.fov = newSettings.cameraFov
        camera.updateProjectionMatrix()
      }
      setupParticles()
    },
    { deep: true }
  )

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('pointermove', onPointerMove)
    if (renderer) renderer.dispose()
  })

  return {
    rebuildStations
  }
}
