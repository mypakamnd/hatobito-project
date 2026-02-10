// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import KoiiroGoodsForm from '../components/OrderKoiiro.vue'
import KoiiroPlanner from '../components/PlannerKoiiro.vue'
import OrderAngevil from '../components/OrderAngevil.vue'
import TabGaming from '../components/TapGaming.vue'

const routes = [
  { path: '/', name: 'KoiiroGoodsForm', component: KoiiroGoodsForm },
  { path: '/koiiro-planner', name: 'KoiiroPlanner', component: KoiiroPlanner },
  { path: '/order-angevil', name: 'KoiiroPlanner', component: OrderAngevil },
  // {path: '/tab-gaming', name: 'TabGaming', component: TabGaming }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
