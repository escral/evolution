import { createApp } from 'vue'
import { createPinia } from "pinia"
import { createRouter, createWebHashHistory } from "vue-router"

import routes from "@/routes"

// import core & assets styles
import '@/assets/styles/App.pcss'

// Plugins
import Toast from 'vue-toastification'
import FloatingVue from 'floating-vue'
import ModalPlugin from '@/plugins/ModalPlugin'
import ConfirmPlugin from '@/plugins/ConfirmPlugin'

// Components
import App from '@/App.vue'
import VueFeather from 'vue-feather'

//

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

app.component('VueFeather', VueFeather)

app.use(router)
app.use(pinia)
app.use(ModalPlugin)
app.use(ConfirmPlugin)
app.use(Toast, {
    hideProgressBar: true,
    transition: "Vue-Toastification__fade",
    timeout: 2000,
})
app.use(FloatingVue, {
    themes: {
        tooltip: {
            html: true,
            delay: {
                show: 0,
                hide: 0,
            },
        },
    },
})

app.mount('#app')
