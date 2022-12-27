import type { DisplayObject } from "pixi.js"
import type Stats from "@/lib/models/Stats"
import Collidable from "@/lib/models/Collidable"

export default class Player extends Collidable {
    declare stats: Stats

    constructor(stats: Stats, element: DisplayObject) {
        super()

        this.stats = reactive(stats)
        this.element = element
    }

    takeDamage(damage: number) {
        this.stats.health -= damage
    }

    get isAlive() {
        return this.stats.health > 0
    }

    heal() {
        this.stats.health = this.stats.maxHealth
    }

    destroy() {
        this.element.destroy()
    }
}