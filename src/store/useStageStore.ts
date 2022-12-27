import { defineStore } from "pinia"
import { move } from "@/helpers/Movement"
import { placementInfo } from "@/helpers/Positioning"
import useInput from "@/composables/useInput"
import BulletProjectileFactory from "@/lib/factories/Projectile/BulletProjectileFactory"
import EnemyFactory from "@/lib/factories/Enemy/EnemyFactory"
import PlayerFactory from "@/lib/factories/Player/PlayerFactory"
import Timer from "@/lib/models/Timer"
import Vector from "@/lib/core/Vector"

import type { Application } from "pixi.js"
import type { Input, Point } from "@/types"
import type { Raw } from "vue"
import type Projectile from "@/lib/models/Projectile"
import type Enemy from "@/lib/models/Enemy"
import type Player from "@/lib/models/Player"
import type { Router } from "vue-router"

const enemySpawnTimer = new Timer()
const shootTimer = new Timer()
const immunityTimer = new Timer()

export const useStageStore = defineStore('stage-stats', {
    state: () => ({
        wave: 5,
        difficulty: 1,
        speed: 1,

        //

        money: 0,

        //

        app: null as Raw<Application>,
        router: null as Raw<Router>,
        input: null as Input,

        //

        player: null as Raw<Player>,
        projectiles: markRaw([]) as Raw<Projectile[]>,
        enemies: markRaw([]) as Raw<Enemy[]>,
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
        init({ app, router }: {
            app: Application,
            router: Router,
        }) {
            this.app = markRaw(app)
            this.router = markRaw(router)

            // Init movements
            const controller = useInput()
            controller.listenToKeyboard()

            this.input = controller.input

            // Init player
            this.player = markRaw(PlayerFactory.create())

            // Init game loop
            this.app.ticker.add(this.onTick.bind(this))

            // Start
            this.start()
        },

        onTick(delta) {
            const elapsedMS = this.app.ticker.elapsedMS

            this.movePlayer(delta)
            this.spawnEnemies(delta)
            this.collidePlayer(delta, elapsedMS)
            this.castProjectiles(delta)
            this.handleProjectiles(delta, elapsedMS)
        },

        // On tick ========================================

        movePlayer(delta) {
            // Move player
            const playerSpeed = 3

            move(this.player.element, {
                x: this.input.right - this.input.left,
                y: this.input.down - this.input.up,
            }, delta * playerSpeed)
        },

        handleProjectiles(delta, elapsedMS) {
            for (const projectile of this.projectiles) {
                this.moveProjectile(projectile, delta, elapsedMS)
                this.collideProjectile(projectile)
            }
        },

        moveProjectile(projectile, delta, elapsedMS) {
            projectile.update(delta)

            if (!projectile.checkIsAlive(elapsedMS)) {
                this.destroyProjectile(projectile)
            }
        },

        collideProjectile(projectile) {
            for (const enemy of this.enemies) {
                if (projectile.collidesWith(enemy.element)) {
                    enemy.takeDamage(projectile.damage)

                    this.destroyProjectile(projectile)

                    if (!enemy.isAlive) {
                        this.destroyEnemy(enemy)

                        this.money += enemy.reward
                    }
                }
            }
        },

        collidePlayer(delta, elapsedMS) {
            immunityTimer.increment(delta)

            const rate = 20

            if (!immunityTimer.enoughTimePassed(rate)) {
                return
            }

            for (const enemy of this.enemies) {
                if (enemy.collidesWith(this.player.element)) {
                    immunityTimer.reset()

                    this.player.takeDamage(enemy.stats.damage)

                    if (!this.player.isAlive) {
                        this.lose()
                    }
                }
            }
        },

        spawnEnemies(delta) {
            enemySpawnTimer.increment(delta)

            const spawnRate = 50

            if (enemySpawnTimer.enoughTimePassed(spawnRate)) {
                enemySpawnTimer.reset()

                this.spawnEnemy()
            }
        },

        castProjectiles(delta) {
            shootTimer.increment(delta)

            const rate = 30

            if (shootTimer.enoughTimePassed(rate)) {
                shootTimer.reset()

                const closestEnemy = this.getClosestEnemy()

                const direction = closestEnemy?.direction ?? new Vector(1, 0)

                this.castProjectile(direction)
            }
        },

        // Other ========================================

        spawnEnemy() {
            const enemy = EnemyFactory.create(this.difficulty * this.wave)

            this.place(enemy.element, {
                x: Math.random() * this.app.screen.width,
                y: Math.random() * this.app.screen.height,
            })

            this.enemies.push(enemy)
        },

        castProjectile(direction: Vector) {
            const projectile = BulletProjectileFactory.create(direction.angle)

            this.projectiles.push(projectile)

            this.place(projectile.element, this.player.element.position)
        },

        destroyEnemy(enemy) {
            enemy.destroy()
            this.enemies.splice(this.enemies.indexOf(enemy), 1)
        },

        destroyProjectile(projectile) {
            projectile.destroy()
            this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
        },

        getClosestEnemy() {
            let minDistance = Infinity
            let closestEnemy = null
            let closestEnemyDirection = null

            for (const enemy of this.enemies) {
                const { distance, direction } = placementInfo(this.player.element, enemy.element)

                if (distance < minDistance) {
                    minDistance = distance
                    closestEnemy = enemy
                    closestEnemyDirection = direction
                }
            }

            if (!closestEnemy) {
                return null
            }

            return {
                enemy: closestEnemy,
                direction: closestEnemyDirection,
                distance: minDistance,
            }
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

        // Game process ========================================

        play() {
            this.app.ticker.start()
        },

        pause() {
            this.app.ticker.stop()
        },

        start() {
            this.place(this.player.element, 'center')
            this.play()
        },

        resetStage() {
            this.stage.removeChildren()
            this.projectiles = []
            this.enemies = []
        },

        restart() {
            this.resetStage()
            this.player.heal()
            this.start()
            this.app.render()
        },

        lose() {
            this.pause()

            this.router.push({ name: 'stage-lose' })
        },
    },
})