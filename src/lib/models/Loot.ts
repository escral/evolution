import Collidable from "@/lib/mixins/Collidable"
import { applyMixins } from "@/helpers/Architecture"
import Element from "@/lib/models/Element"
import type { DisplayObject } from "pixi.js"

interface Loot extends Collidable {}

class Loot extends Element {
    item_id: number
    quantity: number

    constructor(item_id: number, quantity: number, element: DisplayObject) {
        super(element)

        this.item_id = item_id
        this.quantity = quantity
    }
}

applyMixins(Loot, [Collidable])

export default Loot