<script setup>
import { computed } from 'vue'
import { useSceneConfig } from '../composables/useSceneConfig'
import { useAudioSynth } from '../composables/useAudioSynth'
import { ChevronLeft, ChevronRight, Navigation } from 'lucide-vue-next'

const { sections, activeSectionIndex, scrollProgress, nextSection, prevSection, setActiveIndex } = useSceneConfig()
const { playSlideSound } = useAudioSynth()

const currentNumber = computed(() => {
  const num = activeSectionIndex.value + 1
  return num < 10 ? `0${num}` : `${num}`
})

const totalNumber = computed(() => {
  const num = sections.value.length
  return num < 10 ? `0${num}` : `${num}`
})

const progressPercent = computed(() => {
  if (sections.value.length <= 1) return 100
  return (activeSectionIndex.value / (sections.value.length - 1)) * 100
})

function handlePrev() {
  playSlideSound()
  prevSection()
}

function handleNext() {
  playSlideSound()
  nextSection()
}

function handleStationClick(idx) {
  playSlideSound()
  setActiveIndex(idx)
}
</script>

<template>
  <footer class="bottom-hud">
    <div class="hud-left">
      <!-- Section Counter -->
      <div class="counter-box">
        <span class="active-num">{{ currentNumber }}</span>
        <span class="divider">/</span>
        <span class="total-num">{{ totalNumber }}</span>
      </div>

      <!-- Scroll Hint -->
      <div class="hint-box">
        <Navigation :size="13" class="hint-icon" />
        <span>Gulir mouse atau gunakan tombol [←] [→]</span>
      </div>
    </div>

    <!-- Track & Progress -->
    <div class="hud-center">
      <div class="track-bar">
        <!-- Interactive Station Markers -->
        <div
          v-for="(sec, idx) in sections"
          :key="sec.id || idx"
          class="track-station"
          :class="{ active: idx === activeSectionIndex, completed: idx < activeSectionIndex }"
          :style="{ left: `${(idx / Math.max(1, sections.length - 1)) * 100}%` }"
          @click="handleStationClick(idx)"
          :title="sec.title"
        >
          <div class="station-node"></div>
          <span class="station-index">0{{ idx + 1 }}</span>
        </div>

        <!-- Continuous Progress Line -->
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
      </div>
    </div>

    <!-- HUD Right: Nav Arrows -->
    <div class="hud-right">
      <button class="nav-arrow" @click="handlePrev" title="Stasiun Sebelumnya (Panah Kiri)">
        <ChevronLeft :size="20" />
      </button>
      <button class="nav-arrow" @click="handleNext" title="Stasiun Berikutnya (Panah Kanan)">
        <ChevronRight :size="20" />
      </button>
    </div>
  </footer>
</template>

<style scoped>
.bottom-hud {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 84px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 35;
  background: linear-gradient(0deg, rgba(7, 8, 14, 0.95) 0%, rgba(7, 8, 14, 0) 100%);
  pointer-events: auto;
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.counter-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: var(--font-display);
}

.active-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: #00f2fe;
  line-height: 1;
}

.divider {
  color: #475569;
  font-size: 1.1rem;
}

.total-num {
  font-size: 1.1rem;
  font-weight: 600;
  color: #94a3b8;
}

.hint-box {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hint-icon {
  color: #00f2fe;
}

.hud-center {
  flex: 1;
  max-width: 520px;
  margin: 0 40px;
}

.track-bar {
  position: relative;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #00f2fe 0%, #9d4edd 100%);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.6);
  border-radius: 999px;
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.track-station {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.station-node {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1e293b;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.25s ease;
}

.track-station:hover .station-node {
  border-color: #00f2fe;
  transform: scale(1.3);
}

.track-station.completed .station-node {
  background: #00f2fe;
  border-color: #00f2fe;
}

.track-station.active .station-node {
  background: #ffffff;
  border-color: #00f2fe;
  box-shadow: 0 0 12px #00f2fe;
  transform: scale(1.4);
}

.station-index {
  position: absolute;
  top: -18px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.05em;
  transition: color 0.2s ease;
}

.track-station.active .station-index {
  color: #00f2fe;
}

.hud-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(18, 20, 32, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-arrow:hover {
  background: rgba(0, 242, 254, 0.15);
  border-color: #00f2fe;
  color: #00f2fe;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
  transform: translateY(-1px);
}

.nav-arrow:active {
  transform: translateY(1px);
}
</style>
