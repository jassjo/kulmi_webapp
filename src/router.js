import { createRouter, createWebHistory } from 'vue-router'

import KulmiGrid from './components/KulmiGrid.vue'
import LandingScreen from './components/LandingScreen.vue'
import SubmitForm from './components/SubmitForm.vue'

const routes = [
    { path: '/', name: 'home', component: LandingScreen },
    { path: '/revanche', name: 'revanche', component: LandingScreen },
    { path: '/jass', name: 'jass', component: KulmiGrid },
    { path: '/eintragen', name: 'eintragen', component: SubmitForm },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
