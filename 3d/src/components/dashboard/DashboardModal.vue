<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSceneConfig } from '../../composables/useSceneConfig'
import { useAudioSynth } from '../../composables/useAudioSynth'
import TabOverview from './TabOverview.vue'
import TabSections from './TabSections.vue'
import TabSceneSettings from './TabSceneSettings.vue'
import TabPresets from './TabPresets.vue'
import { X, LayoutDashboard, Layers, Sliders, Palette, Eye } from 'lucide-vue-next'

const { isDashboardOpen } = useSceneConfig()
const { playUiClick } = useAudioSynth()

const currentTab = ref('sections') // default to sections CRUD

const tabs = [
  { id: 'overview', name: 'Ringkasan & Metrik', icon: LayoutDashboard },
  { id: 'sections', name: 'Stasiun & Konten', icon: Layers },
  { id: 'scene', name: 'Pengaturan 3D', icon: Sliders },
  { id: 'presets', name: 'Preset & Cadangan', icon: Palette }
]

function handleSelectTab(tabId) {
  playUiClick()
  currentTab.value = tabId
}

function handleClose() {
  playUiClick()
  isDashboardOpen.value = false
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && isDashboardOpen.value) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isDashboardOpen" class="dashboard-backdrop" @click.self="handleClose">
      <div class="dashboard-modal glass-panel">
        <!-- Top Bar -->
        <div class="modal-topbar">
          <div class="topbar-title-group">
            <h2 class="modal-title">Dashboard Manajemen Spasial 3D</h2>
            <div class="live-status">
              <span class="live-dot"></span>
              <span>Live Synced to 3D Viewport</span>
            </div>
          </div>

          <button class="close-btn" @click="handleClose" title="Tutup Dashboard (Esc)">
            <X :size="20" />
          </button>
        </div>

        <!-- Body: Sidebar + Content -->
        <div class="modal-body">
          <!-- Sidebar Tabs -->
          <aside class="dashboard-sidebar">
            <nav class="sidebar-nav">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-btn"
                :class="{ active: currentTab === tab.id }"
                @click="handleSelectTab(tab.id)"
              >
                <component :is="tab.icon" :size="18" />
                <span>{{ tab.name }}</span>
              </button>
            </nav>

            <div class="sidebar-footer">
              <div class="shortcut-tip">
                <span>Tekan <code>ESC</code> untuk kembali ke Landing Page</span>
              </div>
            </div>
          </aside>

          <!-- Main Content View -->
          <main class="dashboard-main-view">
            <transition name="tab-fade" mode="out-in">
              <TabOverview v-if="currentTab === 'overview'" />
              <TabSections v-else-if="currentTab === 'sections'" />
              <TabSceneSettings v-else-if="currentTab === 'scene'" />
              <TabPresets v-else-if="currentTab === 'presets'" />
            </transition>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.dashboard-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(3, 4, 8, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.dashboard-modal {
  width: 100%;
  max-width: 1100px;
  height: 90vh;
  max-height: 780px;
  border-radius: 20px;
  background: rgba(14, 16, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-topbar {
  height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
}

.live-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
  border-color: rgba(244, 63, 94, 0.4);
}

.modal-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.dashboard-sidebar {
  width: 240px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.tab-btn.active {
  background: rgba(0, 242, 254, 0.12);
  border-color: rgba(0, 242, 254, 0.3);
  color: #00f2fe;
}

.sidebar-footer {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.shortcut-tip {
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.4;
}

.shortcut-tip code {
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
  color: #cbd5e1;
}

.dashboard-main-view {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: rgba(14, 16, 26, 0.5);
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
