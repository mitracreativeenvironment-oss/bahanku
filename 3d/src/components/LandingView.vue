<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSceneConfig } from '../composables/useSceneConfig'
import { useThreeScene } from '../composables/useThreeScene'
import { useAudioSynth } from '../composables/useAudioSynth'
import TopNavBar from './TopNavBar.vue'
import SlideCard from './SlideCard.vue'
import HorizontalHUD from './HorizontalHUD.vue'

const config = useSceneConfig()
const { nextSection, prevSection, isDashboardOpen } = config
const { playSlideSound } = useAudioSynth()

const canvasRef = ref(null)

// Inisialisasi engine Three.js
useThreeScene(canvasRef, config)

// Throttle untuk pergerakan scroll
let isThrottled = false
let touchStartX = 0
let touchStartY = 0

function handleWheel(e) {
  // Jika dashboard sedang terbuka, jangan gerakkan rel
  if (isDashboardOpen.value) return

  // Gunakan deltaY atau deltaX
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

  if (Math.abs(delta) < 20 || isThrottled) return

  isThrottled = true
  if (delta > 0) {
    playSlideSound()
    nextSection()
  } else {
    playSlideSound()
    prevSection()
  }

  setTimeout(() => {
    isThrottled = false
  }, 450)
}

function handleTouchStart(e) {
  if (e.touches && e.touches[0]) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
}

function handleTouchEnd(e) {
  if (isDashboardOpen.value || isThrottled) return
  if (e.changedTouches && e.changedTouches[0]) {
    const diffX = touchStartX - e.changedTouches[0].clientX
    const diffY = touchStartY - e.changedTouches[0].clientY

    // Hanya jika geseran horizontal lebih dominan
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      isThrottled = true
      if (diffX > 0) {
        playSlideSound()
        nextSection()
      } else {
        playSlideSound()
        prevSection()
      }
      setTimeout(() => {
        isThrottled = false
      }, 450)
    }
  }
}

function handleKeyDown(e) {
  if (isDashboardOpen.value) return

  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'd' || e.key === 'D') {
    if (e.key === 'd' || e.key === 'D') {
      isDashboardOpen.value = true
      return
    }
    playSlideSound()
    nextSection()
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    playSlideSound()
    prevSection()
  }
}

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: true })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="landing-viewport">
    <!-- WebGL Three.js Canvas -->
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>

    <!-- Top Navigation -->
    <TopNavBar />

    <!-- Current Slide Floating Card -->
    <SlideCard />

    <!-- Bottom HUD Navigation -->
    <HorizontalHUD />

    <!-- Subtle Vignette Overlay -->
    <div class="vignette-overlay"></div>
  </div>
</template>

<style scoped>
.landing-viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  user-select: none;
}

.webgl-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: block;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
  background: radial-gradient(circle at center, transparent 40%, rgba(7, 8, 14, 0.6) 100%);
}
</style>
