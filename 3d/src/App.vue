<script setup>
import LandingView from './components/LandingView.vue'
import DashboardModal from './components/dashboard/DashboardModal.vue'
</script>

<template>
  <div class="app-root">
    <!-- Main 3D Horizontal Landing Experience -->
    <LandingView />

    <!-- Management Dashboard Modal -->
    <DashboardModal />
  </div>
</template>

<style scoped>
.app-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #07080e;
}
</style>
