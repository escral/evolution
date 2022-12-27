import type { DisplayObject } from "pixi.js"
import { move } from "@/helpers/Movement"
import { useStageStore } from "@/store/useStageStore"

export default class Projectile {
    declare angle: number
    declare speed: number
    declare damage: number
    declare lifeTime: number

    declare element: DisplayObject

    startAt: number | null = null

    constructor(
        angle: number,
        speed: number,
        damage: number,
        lifeTime: number,
        element: DisplayObject,
    ) {
        this.angle = angle
        this.speed = speed
        this.damage = damage
        this.lifeTime = lifeTime
        this.element = element
    }

    update(delta: number) {
        move(this.element, {
            x: Math.cos(this.angle),
            y: Math.sin(this.angle),
        }, delta * this.speed)
    }

    destroy() {
        this.element.destroy()
    }

    //

    checkIsAlive(elapsed) {
        if (this.startAt === null) {
            this.startAt = elapsed
        } else {
            this.startAt += elapsed
        }

        if (this.startAt >= this.lifeTime) {
            return true
        }

        return true
    }
}