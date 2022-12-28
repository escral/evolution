import Factory from "@/lib/factories/Factory"
import { createCircle } from "@/helpers/Graphics"
import type LootDefinition from "@/types/models/LootDefinition"
import Loot from "@/lib/models/Loot"

export default class LootFactory extends Factory {
    static create(loot: LootDefinition): Loot {
        const element = createCircle(3, 0x00FF00)

        return new Loot(loot.item_id, 1, element)
    }
}