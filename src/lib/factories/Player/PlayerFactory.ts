import Factory from "@/lib/factories/Factory"
import { createCircle } from "@/helpers/Graphics"
import Stats from "@/lib/models/Stats"
import Player from "@/lib/models/Player"

export default class PlayerFactory extends Factory {
    static create(): Player {
        const element = createCircle(10, 0xFFFFFF)

        const stats = new Stats({
            health: 10,
            maxHealth: 10,
            damage: 1,
            speed: 3,
        })

        return new Player(stats, element)
    }
}