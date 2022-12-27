import Projectile from "@/lib/models/Projectile"
import Factory from "@/lib/factories/Factory"
import { createCircle } from "@/helpers/Graphics"

export default class BulletProjectileFactory extends Factory {
    static create(angle: number, speed = 10, damage = 1, lifeTime = 0.5 * 1000) {
        const element = createCircle()

        return new Projectile(angle, speed, damage, lifeTime, element)
    }
}