import Vector from "@/lib/core/Vector"
import type { Point } from "@/types"

export const placementInfo = (from: { position: Point }, to: { position: Point }) => {
    const vector = Vector.fromPoints(from.position, to.position)

    return {
        distance: vector.length,
        direction: vector.normalize(),
    }
}