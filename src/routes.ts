import menu from "@/pages/menu.vue"
import stage from "@/pages/stage.vue"

export default [
    {
        path: '/',
        component: menu,
        name: 'menu',
    },
    {
        path: '/stage',
        component: stage,
        name: 'stage',
    },
]