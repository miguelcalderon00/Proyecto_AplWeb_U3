
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App)
    .use(router)
    .mount('#app')

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => {
                console.log('Service Worker registrado correctamente')
            })
            .catch((error) => {
                console.error('Error al registrar el Service Worker:', error)
            })
    })
}

