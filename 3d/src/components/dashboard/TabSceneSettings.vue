<script setup>
import { useSceneConfig } from '../../composables/useSceneConfig'
import { Eye, Camera, Sun, Sparkles, RefreshCw } from 'lucide-vue-next'

const { sceneSettings } = useSceneConfig()
</script>

<template>
  <div class="tab-scene-settings">
    <!-- Camera Section -->
    <div class="settings-group">
      <div class="group-header">
        <Camera :size="18" class="group-icon" />
        <h4 class="group-title">Parameter Kamera & Rel Horizontal</h4>
      </div>

      <div class="controls-grid">
        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Jarak Kamera (Z-Distance)</label>
            <span class="control-val">{{ sceneSettings.cameraDistance }}</span>
          </div>
          <input
            v-model.number="sceneSettings.cameraDistance"
            type="range"
            min="6"
            max="20"
            step="0.5"
            class="range-slider"
          />
        </div>

        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Ketinggian Kamera (Y-Height)</label>
            <span class="control-val">{{ sceneSettings.cameraHeight }}</span>
          </div>
          <input
            v-model.number="sceneSettings.cameraHeight"
            type="range"
            min="-2"
            max="4"
            step="0.2"
            class="range-slider"
          />
        </div>

        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Sudut Pandang (Camera FOV)</label>
            <span class="control-val">{{ sceneSettings.cameraFov }}°</span>
          </div>
          <input
            v-model.number="sceneSettings.cameraFov"
            type="range"
            min="35"
            max="85"
            step="1"
            class="range-slider"
          />
        </div>
      </div>
    </div>

    <!-- Atmosphere & Lighting -->
    <div class="settings-group">
      <div class="group-header">
        <Sun :size="18" class="group-icon" />
        <h4 class="group-title">Pencahayaan & Atmosfer Kabut (Fog)</h4>
      </div>

      <div class="controls-grid">
        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Warna Kabut & Latar</label>
            <code>{{ sceneSettings.fogColor }}</code>
          </div>
          <div class="color-picker-row">
            <input
              v-model="sceneSettings.fogColor"
              type="color"
              class="color-input"
            />
            <input
              v-model="sceneSettings.fogColor"
              type="text"
              class="form-input"
            />
          </div>
        </div>

        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Kepadatan Kabut (Fog Density)</label>
            <span class="control-val">{{ sceneSettings.fogDensity }}</span>
          </div>
          <input
            v-model.number="sceneSettings.fogDensity"
            type="range"
            min="0.005"
            max="0.04"
            step="0.002"
            class="range-slider"
          />
        </div>

        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Intensitas Cahaya Ambient</label>
            <span class="control-val">{{ sceneSettings.ambientIntensity }}</span>
          </div>
          <input
            v-model.number="sceneSettings.ambientIntensity"
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            class="range-slider"
          />
        </div>

        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Intensitas Lampu Utama</label>
            <span class="control-val">{{ sceneSettings.lightIntensity }}</span>
          </div>
          <input
            v-model.number="sceneSettings.lightIntensity"
            type="range"
            min="0.5"
            max="4.5"
            step="0.2"
            class="range-slider"
          />
        </div>
      </div>
    </div>

    <!-- Motion & Particles -->
    <div class="settings-group">
      <div class="group-header">
        <Sparkles :size="18" class="group-icon" />
        <h4 class="group-title">Animasi & Bidang Partikel</h4>
      </div>

      <div class="controls-grid">
        <div class="control-card">
          <div class="toggle-row">
            <div>
              <span class="control-label">Rotasi Otomatis Objek</span>
              <span class="toggle-sub">Memutar bentuk 3D secara perlahan</span>
            </div>
            <input
              v-model="sceneSettings.autoRotate"
              type="checkbox"
              class="custom-checkbox"
            />
          </div>
        </div>

        <div class="control-card" v-if="sceneSettings.autoRotate">
          <div class="control-header">
            <label class="control-label">Kecepatan Rotasi</label>
            <span class="control-val">{{ sceneSettings.autoRotateSpeed }}x</span>
          </div>
          <input
            v-model.number="sceneSettings.autoRotateSpeed"
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            class="range-slider"
          />
        </div>

        <div class="control-card">
          <div class="control-header">
            <label class="control-label">Jumlah Partikel Stardust</label>
            <span class="control-val">{{ sceneSettings.particleCount }}</span>
          </div>
          <input
            v-model.number="sceneSettings.particleCount"
            type="range"
            min="300"
            max="3500"
            step="100"
            class="range-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-scene-settings {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  color: #00f2fe;
}

.group-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.control-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.control-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #cbd5e1;
}

.control-val {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #00f2fe;
}

.range-slider {
  width: 100%;
  accent-color: #00f2fe;
  cursor: pointer;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-sub {
  display: block;
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 2px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #00f2fe;
  cursor: pointer;
}
</style>
