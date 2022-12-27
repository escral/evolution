import type { DisplayObject } from "pixi.js"
import ActingObject from "@/lib/models/ActingObject"

export default class Projectile extends ActingObject {
    declare damage: number

    constructor(
        angle: number,
        speed: number,
        damage: number,
        lifeTime: number,
        element: DisplayObject,
    ) {
        super(
            angle,
            speed,
            lifeTime,
            element,
        )

        this.angle = angle
        this.speed = speed
        this.damage = damage
        this.lifeTime = lifeTime
        this.element = element
    }
}