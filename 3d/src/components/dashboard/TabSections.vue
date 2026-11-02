<script setup>
import { ref } from 'vue'
import { useSceneConfig } from '../../composables/useSceneConfig'
import { useAudioSynth } from '../../composables/useAudioSynth'
import { Plus, Trash2, ArrowUp, ArrowDown, Edit3, Check, Box } from 'lucide-vue-next'

const { sections, activeSectionIndex, addSection, removeSection, moveSection, updateSection, setActiveIndex } = useSceneConfig()
const { playUiClick } = useAudioSynth()

const editingIndex = ref(0)

const availableShapes = [
  { value: 'torusKnot', label: 'Kinetic Torus Knot' },
  { value: 'icosahedron', label: 'Quantum Icosahedron' },
  { value: 'cyberMonolith', label: 'Cyber Monolith Pillar' },
  { value: 'chromeSphere', label: 'Liquid Chrome Sphere & Ring' },
  { value: 'portalRing', label: 'Spatial Portal Ring' },
  { value: 'wireframeCube', label: 'Hypercube Wireframe Matrix' }
]

function handleSelectEdit(idx) {
  playUiClick()
  editingIndex.value = idx
  setActiveIndex(idx) // Arahkan kamera 3D ke stasiun yang sedang diedit!
}

function handleAdd() {
  playUiClick()
  addSection()
  editingIndex.value = sections.value.length - 1
  setActiveIndex(editingIndex.value)
}

function handleDelete(idx) {
  playUiClick()
  if (confirm(`Yakin ingin menghapus stasiun "${sections.value[idx]?.title}"?`)) {
    removeSection(idx)
    editingIndex.value = Math.max(0, editingIndex.value - 1)
  }
}

function handleMove(idx, direction) {
  playUiClick()
  moveSection(idx, idx + direction)
  editingIndex.value = idx + direction
}
</script>

<template>
  <div class="tab-sections">
    <div class="sections-layout">
      <!-- Left: Station List -->
      <div class="station-list-panel">
        <div class="list-header">
          <h4 class="list-title">Daftar Stasiun ({{ sections.length }})</h4>
          <button class="add-btn" @click="handleAdd" title="Tambah Stasiun Baru">
            <Plus :size="16" />
            <span>Tambah</span>
          </button>
        </div>

        <div class="station-items">
          <div
            v-for="(sec, idx) in sections"
            :key="sec.id || idx"
            class="station-item"
            :class="{ active: idx === editingIndex }"
            @click="handleSelectEdit(idx)"
          >
            <div class="station-item-left">
              <span class="idx-badge">{{ idx + 1 }}</span>
              <div>
                <h5 class="station-item-title">{{ sec.title }}</h5>
                <span class="station-item-sub">{{ sec.shapeType }}</span>
              </div>
            </div>

            <div class="station-item-actions" @click.stop>
              <button
                class="icon-action-btn"
                :disabled="idx === 0"
                @click="handleMove(idx, -1)"
                title="Geser Kiri (Sebelumnya)"
              >
                <ArrowUp :size="14" />
              </button>

              <button
                class="icon-action-btn"
                :disabled="idx === sections.length - 1"
                @click="handleMove(idx, 1)"
                title="Geser Kanan (Berikutnya)"
              >
                <ArrowDown :size="14" />
              </button>

              <button
                class="icon-action-btn danger"
                :disabled="sections.length <= 1"
                @click="handleDelete(idx)"
                title="Hapus Stasiun"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Station Editor -->
      <div class="station-editor-panel" v-if="sections[editingIndex]">
        <div class="editor-header">
          <h4 class="editor-title">Edit Stasiun #{{ editingIndex + 1 }}: {{ sections[editingIndex].title }}</h4>
          <span class="live-pill">Sinkronisasi Real-Time</span>
        </div>

        <div class="editor-form">
          <!-- Title & Badge -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Judul Stasiun</label>
              <input
                v-model="sections[editingIndex].title"
                type="text"
                class="form-input"
                placeholder="Contoh: Schroling Horizontal 3D"
              />
            </div>

            <div class="form-group w-36">
              <label class="form-label">Teks Badge</label>
              <input
                v-model="sections[editingIndex].badge"
                type="text"
                class="form-input"
                placeholder="01 // ORIGIN"
              />
            </div>
          </div>

          <!-- Tagline -->
          <div class="form-group">
            <label class="form-label">Sub-Judul / Tagline</label>
            <input
              v-model="sections[editingIndex].tagline"
              type="text"
              class="form-input"
              placeholder="Tagline singkat"
            />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Deskripsi Narasi</label>
            <textarea
              v-model="sections[editingIndex].description"
              class="form-input textarea"
              rows="3"
              placeholder="Jelaskan stasiun atau fitur ini..."
            ></textarea>
          </div>

          <!-- 3D Shape & Wireframe -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Geometri 3D (Three.js)</label>
              <select v-model="sections[editingIndex].shapeType" class="form-input select">
                <option v-for="shape in availableShapes" :key="shape.value" :value="shape.value">
                  {{ shape.label }}
                </option>
              </select>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="sections[editingIndex].wireframe"
                  type="checkbox"
                  class="custom-checkbox"
                />
                <span>Wireframe Shading</span>
              </label>
            </div>
          </div>

          <!-- Colors -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Warna Utama (Primary Color)</label>
              <div class="color-picker-row">
                <input
                  v-model="sections[editingIndex].primaryColor"
                  type="color"
                  class="color-input"
                />
                <input
                  v-model="sections[editingIndex].primaryColor"
                  type="text"
                  class="form-input color-text"
                />
              </div>
            </div>

            <div class="form-group flex-1">
              <label class="form-label">Warna Aksen / Cahaya</label>
              <div class="color-picker-row">
                <input
                  v-model="sections[editingIndex].accentColor"
                  type="color"
                  class="color-input"
                />
                <input
                  v-model="sections[editingIndex].accentColor"
                  type="text"
                  class="form-input color-text"
                />
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Teks Tombol Aksi (CTA)</label>
              <input
                v-model="sections[editingIndex].ctaText"
                type="text"
                class="form-input"
                placeholder="Contoh: Eksplorasi Sekarang"
              />
            </div>

            <div class="form-group w-48">
              <label class="form-label">Aksi Tombol</label>
              <select v-model="sections[editingIndex].ctaAction" class="form-input select">
                <option value="next">Stasiun Berikutnya</option>
                <option value="dashboard">Buka Dashboard</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-sections {
  height: 100%;
}

.sections-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  height: 100%;
}

/* List Panel */
.station-list-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.list-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 242, 254, 0.15);
  border: 1px solid rgba(0, 242, 254, 0.3);
  color: #00f2fe;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: rgba(0, 242, 254, 0.25);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.2);
}

.station-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 480px;
  padding-right: 4px;
}

.station-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.station-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.station-item.active {
  background: rgba(0, 242, 254, 0.12);
  border-color: #00f2fe;
}

.station-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.idx-badge {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  color: #00f2fe;
  width: 20px;
}

.station-item-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.station-item-sub {
  font-size: 0.68rem;
  color: #64748b;
  display: block;
}

.station-item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-action-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.icon-action-btn.danger:hover:not(:disabled) {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
}

.icon-action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Editor Panel */
.station-editor-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  max-height: 520px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.editor-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.live-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flex-1 { flex: 1; }
.w-36 { width: 140px; }
.w-48 { width: 190px; }

.form-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.textarea {
  resize: vertical;
  min-height: 70px;
}

.select {
  cursor: pointer;
}

.checkbox-group {
  padding-top: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: #cbd5e1;
  cursor: pointer;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #00f2fe;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.color-text {
  flex: 1;
  font-family: monospace;
}
</style>
