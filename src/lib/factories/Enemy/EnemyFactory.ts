import Factory from "@/lib/factories/Factory"
import { createCircle } from "@/helpers/Graphics"
import Enemy from "@/lib/models/Enemy"
import Stats from "@/lib/models/Stats"

export default class EnemyFactory extends Factory {
    static create(level = 1): Enemy {
        const element = createCircle(12, 0xFF0000)

        const stats = new Stats({
            health: 1 * level,
            maxHealth: 1 * level,
            damage: Math.ceil(1 * level * 0.2),
            speed: 2,
        })

        return new Enemy(stats, element, level)
    }
}