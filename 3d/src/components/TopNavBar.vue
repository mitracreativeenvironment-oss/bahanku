<script setup>
import { useSceneConfig } from '../composables/useSceneConfig'
import { useAudioSynth } from '../composables/useAudioSynth'
import { Volume2, VolumeX, Sliders, Layers, Sparkles } from 'lucide-vue-next'

const { sections, activeSectionIndex, setActiveIndex, isDashboardOpen } = useSceneConfig()
const { isSoundActive, toggleSound, playUiClick, playSlideSound } = useAudioSynth()

function handleNavClick(idx) {
  playSlideSound()
  setActiveIndex(idx)
}

function handleSoundClick() {
  toggleSound()
}

function handleDashboardToggle() {
  playUiClick()
  isDashboardOpen.value = !isDashboardOpen.value
}
</script>

<template>
  <header class="top-navbar">
    <!-- Brand Title -->
    <div class="brand">
      <div class="brand-icon">
        <Sparkles class="icon-sparkle" :size="18" />
      </div>
      <div>
        <h1 class="brand-title">Schroling Horizontal 3D</h1>
        <p class="brand-sub">Vue 3 + Three.js Spasial Engine</p>
      </div>
    </div>

    <!-- Navigation Pills -->
    <nav class="nav-pills">
      <button
        v-for="(sec, idx) in sections"
        :key="sec.id || idx"
        class="nav-pill"
        :class="{ active: idx === activeSectionIndex }"
        @click="handleNavClick(idx)"
        :title="sec.title"
      >
        <span class="pill-dot"></span>
        <span class="pill-label">{{ sec.title.split(' ')[0] }}</span>
      </button>
    </nav>

    <!-- Right Controls -->
    <div class="right-actions">
      <!-- Audio Toggle -->
      <button
        class="action-btn"
        :class="{ active: isSoundActive }"
        @click="handleSoundClick"
        :title="isSoundActive ? 'Matikan Suara SFX' : 'Aktifkan Suara SFX Sci-Fi'"
      >
        <Volume2 v-if="isSoundActive" :size="18" />
        <VolumeX v-else :size="18" />
        <span class="btn-text">{{ isSoundActive ? 'SFX ON' : 'SFX OFF' }}</span>
      </button>

      <!-- Dashboard Button -->
      <button
        class="dashboard-btn"
        @click="handleDashboardToggle"
      >
        <Sliders :size="17" />
        <span>Dashboard Manajemen</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.top-navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 40;
  background: linear-gradient(180deg, rgba(7, 8, 14, 0.9) 0%, rgba(7, 8, 14, 0) 100%);
  pointer-events: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(157, 78, 221, 0.25) 100%);
  border: 1px solid rgba(0, 242, 254, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f2fe;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, #ffffff 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-sub {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
}

.nav-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(18, 20, 32, 0.6);
  backdrop-filter: blur(12px);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.nav-pill:hover {
  color: #ffffff;
}

.nav-pill.active {
  background: rgba(0, 242, 254, 0.15);
  color: #00f2fe;
  border: 1px solid rgba(0, 242, 254, 0.3);
}

.nav-pill.active .pill-dot {
  background: #00f2fe;
  box-shadow: 0 0 8px #00f2fe;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.action-btn.active {
  border-color: #00f2fe;
  color: #00f2fe;
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.2);
}

.dashboard-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(157, 78, 221, 0.25) 100%);
  border: 1px solid rgba(0, 242, 254, 0.5);
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 0 18px rgba(0, 242, 254, 0.25);
}

.dashboard-btn:hover {
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.35) 0%, rgba(157, 78, 221, 0.45) 100%);
  border-color: #00f2fe;
  transform: translateY(-1px);
  box-shadow: 0 0 25px rgba(0, 242, 254, 0.45);
}
</style>
