<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goTo(path) {
  router.push(path);
}
</script>

<template>
  <div>
    <label class="hatobito-heading">Hatobito Fanclub Website</label>
    <div class="space-x-2 mb-4">
      <button @click="goTo('/')" class="btn-click">คำนวณ Goods</button>
      <button @click="goTo('/koiiro-planner')" class="btn-click">วางแพลน Summer Booth</button>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.btn-click {
  color: #ffffff;
  background-color: #098ba2;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  border-radius: 5px;
  margin: 10px 10px 20px 0px;
}

.btn-click:hover {
  background-color: #65c8da;
}

.hatobito-heading {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
}
</style>
