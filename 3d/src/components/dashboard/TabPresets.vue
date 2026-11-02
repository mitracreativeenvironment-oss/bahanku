<script setup>
import { ref } from 'vue'
import { useSceneConfig } from '../../composables/useSceneConfig'
import { useAudioSynth } from '../../composables/useAudioSynth'
import { Download, Upload, RotateCcw, Palette, Check } from 'lucide-vue-next'

const { applyPreset, exportConfigAsJson, importConfigFromJson, resetToDefaults } = useSceneConfig()
const { playUiClick } = useAudioSynth()

const importText = ref('')
const copySuccess = ref(false)
const importSuccess = ref(false)

const presets = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Warna ungu & sian pekat dengan pencahayaan neon berkekuatan tinggi.',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #9d4edd 100%)'
  },
  {
    id: 'deep-space',
    name: 'Deep Cosmos',
    desc: 'Latar kosmos gelap tanpa batas dengan 3000+ partikel stardust.',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #030712 100%)'
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    desc: 'Suasana dunia digital hijau emerald futuristik.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)'
  }
]

function handleApplyPreset(presetId) {
  playUiClick()
  applyPreset(presetId)
}

function handleExport() {
  playUiClick()
  const json = exportConfigAsJson()
  navigator.clipboard.writeText(json)
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2500)
}

function handleDownloadFile() {
  playUiClick()
  const json = exportConfigAsJson()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `schroling-3d-config-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  playUiClick()
  if (!importText.value.trim()) return
  const success = importConfigFromJson(importText.value)
  if (success) {
    importSuccess.value = true
    importText.value = ''
    setTimeout(() => {
      importSuccess.value = false
    }, 2500)
  } else {
    alert('Format JSON tidak valid!')
  }
}

function handleReset() {
  playUiClick()
  if (confirm('Apakah Anda yakin ingin mengembalikan semua stasiun dan pengaturan ke bawaan pabrik?')) {
    resetToDefaults()
  }
}
</script>

<template>
  <div class="tab-presets">
    <!-- Presets Section -->
    <div class="preset-section">
      <div class="section-title-row">
        <Palette :size="18" class="text-cyan" />
        <h4 class="section-title">Preset Tema Visual Instan</h4>
      </div>

      <div class="preset-cards">
        <div
          v-for="preset in presets"
          :key="preset.id"
          class="preset-card"
          @click="handleApplyPreset(preset.id)"
        >
          <div class="preset-banner" :style="{ background: preset.gradient }"></div>
          <div class="preset-info">
            <h5 class="preset-name">{{ preset.name }}</h5>
            <p class="preset-desc">{{ preset.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Backup & Restore JSON -->
    <div class="preset-section">
      <div class="section-title-row">
        <Download :size="18" class="text-cyan" />
        <h4 class="section-title">Ekspor & Impor Konfigurasi (JSON)</h4>
      </div>

      <div class="backup-grid">
        <!-- Export Box -->
        <div class="backup-card">
          <h5 class="backup-heading">Ekspor Cadangan Konfigurasi</h5>
          <p class="backup-text">Unduh atau salin seluruh konfigurasi stasiun dan pengaturan 3D saat ini ke clipboard.</p>
          <div class="btn-group">
            <button class="btn-primary" @click="handleExport">
              <Check v-if="copySuccess" :size="15" />
              <span>{{ copySuccess ? 'Tersalin ke Clipboard!' : 'Salin JSON' }}</span>
            </button>
            <button class="btn-secondary" @click="handleDownloadFile">
              <Download :size="15" />
              <span>Unduh File .json</span>
            </button>
          </div>
        </div>

        <!-- Import Box -->
        <div class="backup-card">
          <h5 class="backup-heading">Impor Konfigurasi</h5>
          <textarea
            v-model="importText"
            class="form-input textarea"
            placeholder="Tempelkan format JSON konfigurasi di sini..."
            rows="3"
          ></textarea>
          <button class="btn-secondary mt-2" @click="handleImport" :disabled="!importText.trim()">
            <Upload :size="15" />
            <span>{{ importSuccess ? 'Berhasil Diimpor!' : 'Terapkan JSON' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reset to Factory -->
    <div class="reset-card">
      <div>
        <h5 class="reset-title">Kembalikan ke Pengaturan Default</h5>
        <p class="reset-desc">Mereset semua stasiun, warna, dan posisi kamera ke kondisi awal bawaan sistem.</p>
      </div>
      <button class="reset-btn" @click="handleReset">
        <RotateCcw :size="15" />
        <span>Reset ke Default</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tab-presets {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.preset-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
}

.text-cyan {
  color: #00f2fe;
}

.preset-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.preset-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
}

.preset-card:hover {
  border-color: #00f2fe;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
}

.preset-banner {
  height: 50px;
  width: 100%;
}

.preset-info {
  padding: 14px;
}

.preset-name {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.preset-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.4;
}

.backup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.backup-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.backup-heading {
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 700;
  color: #f1f5f9;
}

.backup-text {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.5;
}

.btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mt-2 {
  margin-top: 8px;
  align-self: flex-start;
}

.reset-card {
  background: rgba(244, 63, 94, 0.06);
  border: 1px solid rgba(244, 63, 94, 0.25);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.reset-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fda4af;
  margin-bottom: 2px;
}

.reset-desc {
  font-size: 0.76rem;
  color: #94a3b8;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #fda4af;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.reset-btn:hover {
  background: rgba(244, 63, 94, 0.25);
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.3);
}
</style>
