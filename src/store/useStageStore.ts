import { defineStore } from "pinia"
import { move } from "@/helpers/Movement"
import { placementInfo } from "@/helpers/Positioning"
import useInput from "@/composables/useInput"
import BulletProjectileFactory from "@/lib/factories/Projectile/BulletProjectileFactory"
import EnemyFactory from "@/lib/factories/Enemy/EnemyFactory"
import PlayerFactory from "@/lib/factories/Player/PlayerFactory"
import Timer from "@/lib/models/Timer"
import Vector from "@/lib/core/Vector"
import DamageTextProjectileFactory from "@/lib/factories/Projectile/DamageTextProjectileFactory"

import type { Application } from "pixi.js"
import type { Input, Point } from "@/types"
import type { Raw } from "vue"
import type Enemy from "@/lib/models/Enemy"
import type Player from "@/lib/models/Player"
import type { Router } from "vue-router"
import type ActingObject from "@/lib/models/ActingObject"
import type Projectile from "@/lib/models/Projectile"
import LootFactory from "@/lib/factories/Loot/LootFactory"
import type Loot from "@/lib/models/Loot"
import { useStageLootStore } from "@/store/useStageLootStore"
import type Zone from "@/types/models/Zone"
import zones from "@/zones"

const enemySpawnTimer = new Timer()
const shootTimer = new Timer()
const immunityTimer = new Timer()

const events = []

const shake = {
    durationMs: null,
    intensity: null,
    initialPosition: null,
}

export const useStageStore = defineStore('stage', {
    state: () => ({
        wave: 2,
        difficulty: 1,
        speed: 1,

        //

        money: 0,

        //

        app: null as Raw<Application>,
        router: null as Raw<Router>,
        input: null as Input,
        inputController: null as ReturnType<typeof useInput>,

        //

        player: null as Raw<Player>,
        actingObjects: markRaw([]) as Raw<ActingObject[]>,
        projectiles: markRaw([]) as Raw<Projectile[]>,
        enemies: markRaw([]) as Raw<Enemy[]>,
        loot: markRaw([]) as Raw<Loot[]>,

        //

        stores: markRaw({
            loot: useStageLootStore(),
        }),
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

        zone(state): Zone {
            const zoneId = Number(state.router.currentRoute.value.params.zone)

            return zones.find(zone => zone.id === zoneId)
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
            this.inputController = useInput()
            this.inputController.listenToKeyboard()
            this.input = this.inputController.input

            // Init hotkeys
            this.initHotkeys()

            // Init player
            this.player = markRaw(PlayerFactory.create())

            // Init game loop
            this.app.ticker.add(this.onTick.bind(this))

            // Init stores
            Object.values(this.stores).forEach(store => store.init())
        },

        destroy() {
            this.destroyHotkeys()
            this.inputController.destroy()
        },

        onTick(delta) {
            const elapsedMS = this.app.ticker.elapsedMS

            this.movePlayer(delta)
            this.spawnEnemies(delta)
            this.collidePlayer(delta, elapsedMS)
            this.castProjectiles(delta)
            this.handleProjectiles(delta, elapsedMS)
            this.handleActingObjects(delta, elapsedMS)
            this.handleShake(delta, elapsedMS)
        },

        initHotkeys() {
            const event = this.onKeyUp.bind(this)
            events.push(event)
            window.addEventListener('keyup', event)
        },

        destroyHotkeys() {
            events.forEach(event => {
                window.removeEventListener('keyup', event)
            })

            events.splice(0, events.length)
        },

        // Input Events

        onKeyUp(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                if (this.app.ticker.started) {
                    this.pause()
                } else {
                    this.play()
                }
            }
        },

        // On tick ========================================

        handleShake(delta, elapsedMS) {
            if (shake.durationMs === null) {
                return
            }

            const dampingSpeed = 1

            if (shake.durationMs > 0) {
                shake.durationMs -= elapsedMS * dampingSpeed
                this.stage.position.set(
                    (Math.random() > 0.5 ? 1 : -1) * shake.intensity * delta,
                    (Math.random() > 0.5 ? 1 : -1) * shake.intensity * delta,
                )
            } else {
                shake.durationMs = null
                this.stage.position.set(shake.initialPosition.x, shake.initialPosition.y)
            }
        },

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
                this.handleProjectile(projectile, delta, elapsedMS)
                this.collideProjectile(projectile)
            }
        },

        handleActingObjects(delta, elapsedMS) {
            for (const actingObject of this.actingObjects) {
                this.handleActingObject(actingObject, delta, elapsedMS)
            }
        },

        handleActingObject(projectile, delta, elapsedMS) {
            projectile.update(delta)

            if (!projectile.checkIsAlive(elapsedMS)) {
                this.destroyActingObject(projectile)
            }
        },

        handleProjectile(projectile, delta, elapsedMS) {
            projectile.update(delta)

            if (!projectile.checkIsAlive(elapsedMS)) {
                this.destroyProjectile(projectile)
            }
        },

        collideProjectile(projectile) {
            for (const enemy of this.enemies) {
                if (projectile.collidesWith(enemy.element)) {
                    const damageTaken = enemy.takeDamage(projectile.damage)

                    this.castDamageTextProjectile(damageTaken, projectile.angle, enemy.element.position)

                    this.destroyProjectile(projectile)

                    if (!enemy.isAlive) {
                        this.stores.loot.spawnLoot(enemy.element.position)
                        this.destroyEnemy(enemy)
                    }
                }
            }
        },

        collidePlayer(delta, elapsedMS) {
            immunityTimer.increment(delta)

            const rate = 60

            if (!immunityTimer.enoughTimePassed(rate)) {
                return
            }

            for (const enemy of this.enemies) {
                if (enemy.collidesWith(this.player.element)) {
                    immunityTimer.reset()

                    this.player.takeDamage(enemy.stats.damage)

                    this.shakeScreen()

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

        spawnLoot(enemy) {
            const loot = LootFactory.create(enemy.reward)
            console.log(loot)
            this.place(loot.element, enemy.element.position)

            this.loot.push(loot)
        },

        shakeScreen(intensity = 1, durationMs = 100) {
            shake.durationMs = durationMs
            shake.intensity = intensity
            shake.initialPosition = this.stage.position.clone()
        },

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

        castDamageTextProjectile(damage, angle: number, position: Point) {
            const projectile = DamageTextProjectileFactory.create(damage, angle)

            this.actingObjects.push(projectile)

            this.place(projectile.element, position)
        },

        destroyEnemy(enemy) {
            enemy.destroy()
            this.enemies.splice(this.enemies.indexOf(enemy), 1)
        },

        destroyProjectile(projectile) {
            projectile.destroy()
            this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
        },

        destroyActingObject(projectile) {
            projectile.destroy()
            this.actingObjects.splice(this.actingObjects.indexOf(projectile), 1)
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
            if (this.app.ticker.started) {
                return
            }

            this.router.push({ name: 'stage-game' })
            this.app.ticker.start()
        },

        pause() {
            this.app.ticker.stop()
            this.router.push({ name: 'stage-pause' })
        },

        start() {
            this.resetStage()
            this.place(this.player.element, 'center')
            this.play()
        },

        resetStage() {
            this.player.heal()
            this.stage.removeChildren()
            this.projectiles = []
            this.actingObjects = []
            this.enemies = []
        },

        restart() {
            this.start()
            this.app.render()
        },

        lose() {
            this.pause()

            this.router.push({ name: 'stage-lose' })
        },
    },
})