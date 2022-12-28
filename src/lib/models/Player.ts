import type { DisplayObject } from "pixi.js"
import type PlayerStats from "@/lib/models/PlayerStats"
import { applyMixins } from "@/helpers/Architecture"
import Element from "@/lib/models/Element"

// Mixins
import Collidable from "@/lib/mixins/Collidable"
import Inventory from "@/lib/models/Inventory"

//

interface Player extends Element, Collidable {}

class Player extends Element {
    declare stats: PlayerStats
    declare inventory: Inventory

    constructor(stats: PlayerStats, element: DisplayObject) {
        super(element)

        this.stats = reactive(stats)
        this.inventory = reactive(new Inventory())
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