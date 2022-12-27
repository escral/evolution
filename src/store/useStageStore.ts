import { defineStore } from "pinia"
import usePlayer from "@/composables/usePlayer"
import type { Application, DisplayObject } from "pixi.js"
import useInput from "@/composables/useInput"
import type { Input, Point } from "@/types"
import { move } from "@/helpers/Movement"
import type { Raw } from "vue"
import BulletProjectileFactory from "@/lib/factories/Projectile/BulletProjectileFactory"
import type Projectile from "@/lib/models/Projectile"

export const useStageStore = defineStore('stage-stats', {
    state: () => ({
        wave: 1,
        difficulty: 1,
        speed: 1,

        //

        money: 0,

        //

        app: null as Raw<Application>,
        input: null as Input,

        //

        player: null as Raw<DisplayObject>,
        projectiles: [] as Projectile[],
    }),

    getters: {
        stage(state): Application['stage'] {
            if (!state.app) {
                throw new Error('App is not initialized')
            }

            return state.app.stage as Application['stage']
        },

        center(state): Point {
            return {
                x: state.app.screen.width / 2,
                y: state.app.screen.height / 2,
            }
        },
    },

    actions: {
        init(app: Application) {
            this.app = markRaw(app)

            // Init movements
            const controller = useInput()
            controller.listenToKeyboard()

            this.input = controller.input

            // Init player
            this.player = markRaw(usePlayer().create())
            this.place(this.player, 'center')

            // Init game loop
            this.app.ticker.add(this.onTick.bind(this))
        },

        onTick(delta) {
            const elapsedMS = this.app.ticker.elapsedMS

            // Move player
            const playerSpeed = 3

            move(this.player, {
                x: this.input.right - this.input.left,
                y: this.input.down - this.input.up,
            }, delta * playerSpeed)

            // Cast projectiles
            if (this.input.space) {
                this.castProjectile()
                console.log('fire')
            }

            // Move projectiles
            for (const projectile of this.projectiles) {
                projectile.update(delta)

                if (!projectile.checkIsAlive(elapsedMS)) {
                    projectile.destroy()
                    this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
                }
            }
        },

        castProjectile() {
            const projectile = BulletProjectileFactory.create(0)

            this.projectiles.push(projectile)

            this.place(projectile.element, 'center')
        },

        place(element, position: Point | 'center' = null) {
            if (position === 'center') {
                position = this.center
            }

            if (position) {
                element.position.set(position.x, position.y)
            }

            this.stage.addChild(element)
        },

        play() {
            this.app.ticker.start()
        },

        pause() {
            this.app.ticker.stop()
        },
    },
})