import type { DisplayObject } from "pixi.js"
import type Stats from "@/lib/models/Stats"
import { applyMixins } from "@/helpers/Architecture"
import Element from "@/lib/models/Element"

// Mixins
import Collidable from "@/lib/mixins/Collidable"

//

interface Player extends Element, Collidable {}

class Player extends Element {
    declare stats: Stats

    constructor(stats: Stats, element: DisplayObject) {
        super()

        this.stats = reactive(stats)
        this.element = element
    }

    takeDamage(damage: number) {
        const damageTaken = damage

        this.stats.health -= damageTaken

        return damageTaken
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

applyMixins(Player, [Collidable])

export default Player