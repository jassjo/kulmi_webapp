import { createRouter, createWebHistory } from 'vue-router'

import KulmiGrid from './components/KulmiGrid.vue'
import LandingScreen from './components/LandingScreen.vue'

const routes = [
  { path: '/', name: 'home', component: LandingScreen },
  { path: '/revanche', name: 'revanche', component: LandingScreen },
  { path: '/jass', name: 'jass', component: KulmiGrid, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
