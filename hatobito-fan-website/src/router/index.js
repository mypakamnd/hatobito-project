// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import KoiiroPlanner from '../components/PlannerKoiiro.vue'
import OrderForm from '../components/OrderForm.vue'
import CardGame from '../components/CardGame.vue'

const routes = [
  { path: '/', name: 'orderForm', component: OrderForm },
  { path: '/card-game', name: 'CardGame', component: CardGame },
  // { path: '/koiiro-planner', name: 'KoiiroPlanner', component: KoiiroPlanner },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
