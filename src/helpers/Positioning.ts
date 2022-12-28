import Vector from "@/lib/core/Vector"
import type { Point } from "@/types"

export const placementInfo = (from: { position: Point }, to: { position: Point }) => {
    const vector = Vector.fromPoints(from.position, to.position)

    return {
        distance: vector.length,
        direction: vector.normalize(),
    }
}

export const distanceBetween = (from: { position: Point }, to: { position: Point }) => {
    const a = from.position.x - to.position.x
    const b = from.position.y - to.position.y

    return Math.sqrt(a * a + b * b)
}