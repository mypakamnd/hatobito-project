<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

function goTo(path) {
  router.push(path);
}

const activeTab = computed(() => route.path);
</script>

<template>
  <div class="card-container">
    <div class="tabs-container">
      <!-- indicator -->
      <div class="tab-indicator" :class="{ right: activeTab === '/card-game' }"></div>

      <button class="tab-button" :class="{ active: activeTab === '/' }" @click="goTo('/')">Goods</button>

      <button class="tab-button" :class="{ active: activeTab === '/card-game' }" @click="goTo('/card-game')">Card Game</button>
    </div>

    <router-view />
  </div>
</template>
<style scoped>
.hatobito-heading {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  display: block;
}

.tabs-container {
  display: flex;
  background-color: #c00707;
  border-radius: 2em;
  padding: 5px;
  width: fit-content;
}

.tab-button {
  border: none;
  background: transparent;
  padding: 10px 20px;
  border-radius: 2em;
  font-weight: 600;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  background-color: white;
  color: #c00707;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.card-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.tab-content {
  width: 100%;
  overflow-x: auto;
}

.tabs-container {
  position: relative;
  display: flex;
  background-color: #c00707;
  border-radius: 2em;
  padding: 5px;
  width: 220px;
  overflow: hidden;
}

/* ตัวแถบขาวที่เลื่อน */
.tab-indicator {
  position: absolute;
  top: 5px;
  left: 5px;
  width: calc(50% - 5px);
  height: calc(100% - 10px);
  background: white;
  border-radius: 2em;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 0;
}

.tab-indicator.right {
  transform: translateX(100%);
}

.tab-button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 0;
  border-radius: 2em;
  font-weight: 600;
  font-size: 16px;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.5s ease;
}

.tab-button.active {
  color: #c00707;
}
</style>
