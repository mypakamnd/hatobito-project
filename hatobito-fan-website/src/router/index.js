// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import KoiiroGoodsForm from '../components/OrderKoiiro.vue'
import KoiiroPlanner from '../components/PlannerKoiiro.vue'
import OrderAngevil from '../components/OrderAngevil.vue'

const routes = [
  { path: '/', name: 'KoiiroGoodsForm', component: KoiiroGoodsForm },
  { path: '/koiiro-planner', name: 'KoiiroPlanner', component: KoiiroPlanner },
  { path: '/order-angevil', name: 'KoiiroPlanner', component: OrderAngevil }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
