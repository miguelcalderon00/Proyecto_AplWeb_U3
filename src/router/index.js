import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '../views/InicioView.vue'
import TareasView from '../views/TareasView.vue'

const routes = [
    {
        path: '/',
        name: 'inicio',
        component: InicioView
    },
    {
        path: '/tareas',
        name: 'tareas',
        component: TareasView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
