import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', redirect: `/day/${new Date().toISOString().split('T')[0]}` },
  { path: '/day/:date', component: HomeView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
