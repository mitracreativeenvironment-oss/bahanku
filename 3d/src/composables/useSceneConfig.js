import { reactive, ref, computed, watch } from 'vue'

const STORAGE_KEY = 'schroling_horizontal_3d_config_v1'

const DEFAULT_SECTIONS = [
  {
    id: 'hero-origin',
    badge: '01 // HORIZONTAL TRACK',
    title: 'Schroling Horizontal 3D',
    tagline: 'Eksplorasi Spasial 3D Berbasiskan Vue 3 & Three.js',
    description: 'Rasakan pengalaman navigasi horizontal revolusioner. Gulir mouse atau gunakan tombol arah untuk meluncur melalui rel dimensi spasial dengan pencahayaan dinamis dan partikel stardust interaktif.',
    shapeType: 'torusKnot',
    primaryColor: '#00f2fe',
    accentColor: '#9d4edd',
    wireframe: false,
    ctaText: 'Jelajahi Koridor 3D',
    ctaAction: 'next'
  },
  {
    id: 'quantum-core',
    badge: '02 // QUANTUM MATRIX',
    title: 'Pusat Polihidron Quantum',
    tagline: 'Kristalisasi Geometri Berpresisi Tinggi',
    description: 'Setiap objek dirender secara real-time dengan shader fisik PBR (Physically Based Rendering), material reflektif logam, dan respon hover interaktif saat kursor mendekati objek.',
    shapeType: 'icosahedron',
    primaryColor: '#10b981',
    accentColor: '#00f2fe',
    wireframe: true,
    ctaText: 'Pelajari Arsitektur',
    ctaAction: 'next'
  },
  {
    id: 'cyber-monolith',
    badge: '03 // CYBER MONOLITH',
    title: 'Menara Data Arsitektur',
    tagline: 'Pilar Data Real-Time Tanpa Hambatan',
    description: 'Menghubungkan visual WebGL berperforma tinggi 60 FPS dengan reaktivitas Composition API Vue 3. Desain modular memudahkan penyesuaian konten dan parameter grafis langsung dari Dashboard.',
    shapeType: 'cyberMonolith',
    primaryColor: '#f59e0b',
    accentColor: '#f43f5e',
    wireframe: false,
    ctaText: 'Buka Dashboard Manajemen',
    ctaAction: 'dashboard'
  },
  {
    id: 'sphere-nexus',
    badge: '04 // LIQUID NEXUS',
    title: 'Orbita Chrome Reflektif',
    tagline: 'Interaksi Cairan Metalik dengan Cincin Planet',
    description: 'Visualisasi bola kromium dengan cincin partikel berotasi dinamis. Setiap parameter material, specular, dan rotasi dapat disesuaikan secara instan dari panel kontrol manajemen.',
    shapeType: 'chromeSphere',
    primaryColor: '#ec4899',
    accentColor: '#8b5cf6',
    wireframe: false,
    ctaText: 'Eksplorasi Fitur',
    ctaAction: 'next'
  },
  {
    id: 'portal-gateway',
    badge: '05 // GATEWAY TERMINAL',
    title: 'Terminal Gerbang Spasial',
    tagline: 'Integrasi Sempurna Web 3D dan Manajemen Konten',
    description: 'Sistem lengkap siap produksi dengan dukungan penyimpanan lokal (LocalStorage), impor/ekspor konfigurasi JSON, serta pengaturan pencahayaan dan kamera secara real-time.',
    shapeType: 'portalRing',
    primaryColor: '#3b82f6',
    accentColor: '#00f2fe',
    wireframe: false,
    ctaText: 'Kelola Landing Page Ini',
    ctaAction: 'dashboard'
  }
]

const DEFAULT_SETTINGS = {
  cameraFov: 55,
  cameraHeight: 0.8,
  cameraDistance: 11,
  scrollSpeed: 1.0,
  autoRotate: true,
  autoRotateSpeed: 0.8,
  particleCount: 1600,
  fogDensity: 0.015,
  fogColor: '#07080e',
  ambientIntensity: 1.2,
  lightIntensity: 2.2,
  theme: 'cyber-neon'
}

// Global Reactive State
const sections = ref([])
const sceneSettings = reactive({ ...DEFAULT_SETTINGS })
const activeSectionIndex = ref(0)
const scrollProgress = ref(0)
const isDashboardOpen = ref(false)
const isAudioEnabled = ref(false)
const analytics = reactive({
  impressions: 1240,
  interactions: 388,
  activeScene: computed(() => sections.value[activeSectionIndex.value]?.title || 'Hero Station')
})

// Load saved config or defaults
function initConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        sections.value = parsed.sections
      } else {
        sections.value = JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
      }
      if (parsed.sceneSettings) {
        Object.assign(sceneSettings, parsed.sceneSettings)
      }
      return
    }
  } catch (e) {
    console.warn('Gagal membaca localStorage, memuat preset default:', e)
  }
  sections.value = JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
}

// Auto-save on change
watch([sections, sceneSettings], () => {
  try {
    const data = {
      sections: sections.value,
      sceneSettings: { ...sceneSettings }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Gagal menyimpan ke localStorage:', e)
  }
}, { deep: true })

// Initialize once
if (sections.value.length === 0) {
  initConfig()
}

export function useSceneConfig() {
  const currentSection = computed(() => sections.value[activeSectionIndex.value] || sections.value[0])
  const totalSections = computed(() => sections.value.length)

  function setActiveIndex(idx) {
    if (idx >= 0 && idx < sections.value.length) {
      activeSectionIndex.value = idx
      scrollProgress.value = idx / (Math.max(1, sections.value.length - 1))
      analytics.interactions++
    }
  }

  function nextSection() {
    if (activeSectionIndex.value < sections.value.length - 1) {
      setActiveIndex(activeSectionIndex.value + 1)
    } else {
      setActiveIndex(0)
    }
  }

  function prevSection() {
    if (activeSectionIndex.value > 0) {
      setActiveIndex(activeSectionIndex.value - 1)
    } else {
      setActiveIndex(sections.value.length - 1)
    }
  }

  function addSection(customData = null) {
    const newIdx = sections.value.length + 1
    const newSec = customData || {
      id: `station-${Date.now()}`,
      badge: `0${newIdx} // NEW STATION`,
      title: `Stasiun Spasial ${newIdx}`,
      tagline: 'Kustomisasi stasiun 3D Anda',
      description: 'Deskripsi stasiun baru ini dapat Anda ubah kapan saja melalui dashboard manajemen.',
      shapeType: 'torusKnot',
      primaryColor: '#00f2fe',
      accentColor: '#9d4edd',
      wireframe: false,
      ctaText: 'Eksplorasi',
      ctaAction: 'next'
    }
    sections.value.push(newSec)
  }

  function updateSection(index, updatedData) {
    if (sections.value[index]) {
      sections.value[index] = { ...sections.value[index], ...updatedData }
    }
  }

  function removeSection(index) {
    if (sections.value.length <= 1) {
      alert('Minimal harus ada 1 stasiun pada landing page!')
      return
    }
    sections.value.splice(index, 1)
    if (activeSectionIndex.value >= sections.value.length) {
      activeSectionIndex.value = sections.value.length - 1
    }
  }

  function moveSection(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= sections.value.length) return
    const item = sections.value.splice(fromIndex, 1)[0]
    sections.value.splice(toIndex, 0, item)
    if (activeSectionIndex.value === fromIndex) {
      activeSectionIndex.value = toIndex
    }
  }

  function applyPreset(presetKey) {
    if (presetKey === 'cyberpunk') {
      sceneSettings.fogColor = '#070814'
      sceneSettings.ambientIntensity = 1.3
      sceneSettings.lightIntensity = 2.5
      sceneSettings.particleCount = 2000
    } else if (presetKey === 'deep-space') {
      sceneSettings.fogColor = '#020308'
      sceneSettings.ambientIntensity = 0.8
      sceneSettings.lightIntensity = 1.8
      sceneSettings.particleCount = 3000
    } else if (presetKey === 'emerald-matrix') {
      sceneSettings.fogColor = '#04100c'
      sceneSettings.ambientIntensity = 1.2
      sceneSettings.lightIntensity = 2.2
      sceneSettings.particleCount = 1500
    }
  }

  function exportConfigAsJson() {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      sections: sections.value,
      sceneSettings: { ...sceneSettings }
    }
    return JSON.stringify(data, null, 2)
  }

  function importConfigFromJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr)
      if (Array.isArray(parsed.sections)) {
        sections.value = parsed.sections
      }
      if (parsed.sceneSettings) {
        Object.assign(sceneSettings, parsed.sceneSettings)
      }
      activeSectionIndex.value = 0
      return true
    } catch (e) {
      console.error('Invalid JSON configuration', e)
      return false
    }
  }

  function resetToDefaults() {
    sections.value = JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
    Object.assign(sceneSettings, DEFAULT_SETTINGS)
    activeSectionIndex.value = 0
  }

  return {
    sections,
    sceneSettings,
    activeSectionIndex,
    scrollProgress,
    currentSection,
    totalSections,
    isDashboardOpen,
    isAudioEnabled,
    analytics,
    setActiveIndex,
    nextSection,
    prevSection,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    applyPreset,
    exportConfigAsJson,
    importConfigFromJson,
    resetToDefaults
  }
}
