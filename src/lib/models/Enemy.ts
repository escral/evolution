import type { DisplayObject } from "pixi.js"
import type Stats from "@/lib/models/Stats"
import Element from "@/lib/models/Element"
import Collidable from "@/lib/mixins/Collidable"
import { applyMixins } from "@/helpers/Architecture"

interface Enemy extends Element, Collidable {}

class Enemy extends Element {
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

applyMixins(Enemy, [Collidable])

export default Enemy