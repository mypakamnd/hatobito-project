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
    <!-- tap -->
    <!-- <div class="tabs-container">
      <button class="tab-button" :class="{ active: activeTab === '/' }" @click="goTo('/')">HatoBito</button>
      <button class="tab-button" :class="{ active: activeTab === '/order-angevil' }" @click="goTo('/order-angevil')">Angevil</button>
    </div> -->

    <div class="tab-content">
      <router-view />
    </div>
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

/* สไตล์แท็บ */
.tabs-container {
  display: flex;
  background-color: #a8f1ff;
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
  color: #4ed7f1;
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
</style>
