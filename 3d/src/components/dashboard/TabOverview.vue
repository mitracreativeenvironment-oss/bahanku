<script setup>
import { computed } from 'vue'
import { useSceneConfig } from '../../composables/useSceneConfig'
import { Activity, Layers, Compass, Camera, Sparkles, CheckCircle2 } from 'lucide-vue-next'

const { sections, sceneSettings, activeSectionIndex, analytics } = useSceneConfig()

const activeSection = computed(() => sections.value[activeSectionIndex.value] || {})
</script>

<template>
  <div class="tab-overview">
    <!-- Header -->
    <div class="overview-header">
      <h3 class="section-heading">Ringkasan Sistem Spasial 3D</h3>
      <p class="section-subheading">Status performa rendering, stasiun horizontal aktif, dan telemetri interaksi pengguna.</p>
    </div>

    <!-- Stat Grid -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper cyan">
          <Layers :size="20" />
        </div>
        <div>
          <span class="stat-label">Total Stasiun</span>
          <h4 class="stat-value">{{ sections.length }}</h4>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper violet">
          <Compass :size="20" />
        </div>
        <div>
          <span class="stat-label">Stasiun Aktif</span>
          <h4 class="stat-value">#{{ activeSectionIndex + 1 }}</h4>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper emerald">
          <Activity :size="20" />
        </div>
        <div>
          <span class="stat-label">Interaksi Pengguna</span>
          <h4 class="stat-value">{{ analytics.interactions }}</h4>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper amber">
          <Sparkles :size="20" />
        </div>
        <div>
          <span class="stat-label">Kerapatan Partikel</span>
          <h4 class="stat-value">{{ sceneSettings.particleCount }}</h4>
        </div>
      </div>
    </div>

    <!-- Active Station Quick Info -->
    <div class="active-preview-card">
      <div class="preview-header">
        <div class="preview-badge">
          <CheckCircle2 :size="14" class="text-cyan" />
          <span>FOKUS KAMERA SPASIAL SAAT INI</span>
        </div>
        <span class="shape-tag">{{ activeSection.shapeType }}</span>
      </div>

      <h4 class="preview-title">{{ activeSection.title }}</h4>
      <p class="preview-desc">{{ activeSection.description }}</p>

      <div class="preview-meta">
        <div class="meta-item">
          <span class="meta-label">Primary Color</span>
          <div class="color-badge">
            <span class="color-dot" :style="{ backgroundColor: activeSection.primaryColor }"></span>
            <code>{{ activeSection.primaryColor }}</code>
          </div>
        </div>

        <div class="meta-item">
          <span class="meta-label">Accent Color</span>
          <div class="color-badge">
            <span class="color-dot" :style="{ backgroundColor: activeSection.accentColor }"></span>
            <code>{{ activeSection.accentColor }}</code>
          </div>
        </div>

        <div class="meta-item">
          <span class="meta-label">Mode Wireframe</span>
          <span class="status-pill" :class="{ on: activeSection.wireframe }">
            {{ activeSection.wireframe ? 'AKTIF' : 'NONAKTIF' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.overview-header {
  margin-bottom: 4px;
}

.section-heading {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.section-subheading {
  font-size: 0.85rem;
  color: #94a3b8;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
}

.stat-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.cyan {
  background: rgba(0, 242, 254, 0.15);
  color: #00f2fe;
}
.stat-icon-wrapper.violet {
  background: rgba(157, 78, 221, 0.15);
  color: #9d4edd;
}
.stat-icon-wrapper.emerald {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
.stat-icon-wrapper.amber {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.stat-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
}

.active-preview-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 242, 254, 0.3);
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.08);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #00f2fe;
  letter-spacing: 0.05em;
}

.shape-tag {
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #e2e8f0;
}

.preview-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.preview-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 20px;
}

.preview-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.color-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.status-pill.on {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}
</style>
