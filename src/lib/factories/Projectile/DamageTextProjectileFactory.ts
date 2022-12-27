import Factory from "@/lib/factories/Factory"
import ActingObject from "@/lib/models/ActingObject"
import { Text } from "pixi.js"

export default class DamageTextProjectileFactory extends Factory {
    static create(text, angle = 0) {
        const element = new Text(text, {
            fontFamily: 'sbc-font',
            fontSize: 14,
            fill: 0xFFFFFF,
            align: 'center',
        })

        return new ActingObject(angle, 0.5, 0.5 * 1000, element)
    }
}