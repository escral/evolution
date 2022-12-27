import menu from "@/pages/menu.vue"

// Stage
import stage from "@/pages/stage/index.vue"
import stageGame from "@/pages/stage/game.vue"
import stageLose from "@/pages/stage/lose.vue"

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
        children: [
            {
                path: '',
                component: stageGame,
                name: 'stage-game',
            },
            {
                path: 'lose',
                component: stageLose,
                name: 'stage-lose',
            },
        ],
    },
]