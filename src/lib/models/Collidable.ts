import type { DisplayObject } from "pixi.js"

export default class Collidable {
    declare element: DisplayObject

    collidesWith(object: DisplayObject) {
        if (! object._bounds || ! this.element._bounds) {
            return false
        }

        const rect = this.element.getBounds(true)
        const rect2 = object.getBounds(true)

        return rect.x + rect.width > rect2.x &&
            rect.x < rect2.x + rect2.width &&
            rect.y + rect.height > rect2.y &&
            rect.y < rect2.y + rect2.height
    }
}