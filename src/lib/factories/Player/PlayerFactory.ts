import Factory from "@/lib/factories/Factory"
import { createCircle } from "@/helpers/Graphics"
import Player from "@/lib/models/Player"
import PlayerStats from "@/lib/models/PlayerStats"

export default class PlayerFactory extends Factory {
    static create(): Player {
        const element = createCircle(10, 0xFFFFFF)

        const stats = new PlayerStats({
            health: 10,
            maxHealth: 10,
            damage: 1,
            speed: 3,

            //

            pickupDistance: 50,
        })

        return new Player(stats, element)
    }
}