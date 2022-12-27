import type { Point } from "@/types"
import type { DisplayObject } from "pixi.js"

export const move = (element: DisplayObject, vector: Point, modificator = 1) => {
    if (vector.x !== 0) {
        element.x += vector.x * modificator
    }

    if (vector.y !== 0) {
        element.y += vector.y * modificator
    }
}