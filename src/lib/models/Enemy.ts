import type { DisplayObject } from "pixi.js"
import type Stats from "@/lib/models/Stats"
import Collidable from "@/lib/models/Collidable"

export default class Enemy extends Collidable {
    declare stats: Stats
    declare reward: number

    constructor(stats: Stats, element: DisplayObject, reward = 1) {
        super()

        this.stats = stats
        this.element = element
        this.reward = reward
    }

    takeDamage(damage: number) {
        const damageTaken = damage

        this.stats.health -= damageTaken

        return damageTaken
    }

    get isAlive() {
        return this.stats.health > 0
    }

    destroy() {
        this.element.destroy()
    }
}