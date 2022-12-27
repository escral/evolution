import type { DisplayObject } from "pixi.js"
import { move } from "@/helpers/Movement"
import Collidable from "@/lib/models/Collidable"

export default class Projectile extends Collidable {
    declare angle: number
    declare speed: number
    declare damage: number
    declare lifeTime: number

    startAt: number | null = null

    constructor(
        angle: number,
        speed: number,
        damage: number,
        lifeTime: number,
        element: DisplayObject,
    ) {
        super()

        this.angle = angle
        this.speed = speed
        this.damage = damage
        this.lifeTime = lifeTime
        this.element = element
    }

    update(delta: number) {
        move(this.element, {
            x: -Math.sin(this.angle),
            y: Math.cos(this.angle),
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

        return this.startAt < this.lifeTime
    }
}