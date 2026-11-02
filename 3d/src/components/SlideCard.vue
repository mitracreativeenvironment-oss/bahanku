<script setup>
import { computed } from 'vue'
import { useSceneConfig } from '../composables/useSceneConfig'
import { useAudioSynth } from '../composables/useAudioSynth'
import { ArrowRight, Sliders, Box, Eye } from 'lucide-vue-next'

const { currentSection, nextSection, isDashboardOpen } = useSceneConfig()
const { playUiClick, playSlideSound } = useAudioSynth()

const shapeName = computed(() => {
  const map = {
    torusKnot: 'Kinetic Torus Knot',
    icosahedron: 'Quantum Icosahedron',
    cyberMonolith: 'Futuristic Monolith',
    chromeSphere: 'Liquid Chrome Sphere',
    portalRing: 'Cyber Portal Ring',
    wireframeCube: 'Hypercube Matrix'
  }
  return map[currentSection.value.shapeType] || currentSection.value.shapeType
})

function handleCtaClick() {
  playUiClick()
  if (currentSection.value.ctaAction === 'dashboard') {
    isDashboardOpen.value = true
  } else {
    playSlideSound()
    nextSection()
  }
}

function handleOpenDashboard() {
  playUiClick()
  isDashboardOpen.value = true
}
</script>

<template>
  <div class="slide-card-container">
    <transition name="card-fade" mode="out-in">
      <div :key="currentSection.id" class="slide-card glass-panel">
        <!-- Badge -->
        <div class="card-badge" :style="{ borderColor: currentSection.primaryColor }">
          <span class="badge-dot" :style="{ backgroundColor: currentSection.primaryColor }"></span>
          <span>{{ currentSection.badge }}</span>
        </div>

        <!-- Title & Tagline -->
        <h2 class="card-title">{{ currentSection.title }}</h2>
        <h3 class="card-tagline" :style="{ color: currentSection.primaryColor }">
          {{ currentSection.tagline }}
        </h3>

        <!-- Description -->
        <p class="card-desc">{{ currentSection.description }}</p>

        <!-- Spec Pills -->
        <div class="spec-pills">
          <div class="spec-pill">
            <Box :size="13" />
            <span>{{ shapeName }}</span>
          </div>
          <div class="spec-pill" v-if="currentSection.wireframe">
            <Eye :size="13" />
            <span>Wireframe Mode</span>
          </div>
          <div class="spec-color-pill">
            <span class="color-swatch" :style="{ backgroundColor: currentSection.primaryColor }"></span>
            <span class="color-swatch" :style="{ backgroundColor: currentSection.accentColor }"></span>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions">
          <button class="btn-primary" @click="handleCtaClick">
            <span>{{ currentSection.ctaText }}</span>
            <ArrowRight :size="16" />
          </button>

          <button class="btn-secondary" @click="handleOpenDashboard">
            <Sliders :size="15" />
            <span>Kustomisasi</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-card-container {
  position: absolute;
  left: 64px;
  bottom: 120px;
  max-width: 520px;
  z-index: 25;
  pointer-events: none;
}

.slide-card {
  pointer-events: auto;
  border-radius: 20px;
  padding: 32px 36px;
  background: rgba(11, 14, 24, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.1);
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.card-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-tagline {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 22px;
}

.spec-pills {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.spec-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.74rem;
  color: #cbd5e1;
}

.spec-color-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.color-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Transitions */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.97);
}

@media (max-width: 768px) {
  .slide-card-container {
    left: 20px;
    right: 20px;
    bottom: 96px;
    max-width: none;
  }
  .card-title {
    font-size: 1.7rem;
  }
  .slide-card {
    padding: 24px;
  }
}
</style>
