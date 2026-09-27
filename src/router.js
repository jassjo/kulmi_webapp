import { createRouter, createWebHashHistory } from 'vue-router'

const KulmiGrid = () => import('./components/KulmiGrid.vue');
const LandingScreen = () => import('./components/LandingScreen.vue');
const SubmitForm = () => import( './components/SubmitForm.vue');

const routes = [
    { path: '/', name: 'home', component: LandingScreen },
    { path: '/revanche', name: 'revanche', component: LandingScreen },
    { path: '/jass', name: 'jass', component: KulmiGrid },
    { path: '/eintragen', name: 'eintragen', component: SubmitForm },
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
