import type Loot from "@/types/models/LootDefinition"
import type Item from "@/types/models/Item"

export default interface Zone {
    id: number,
    title: string,
    description: string,
    loot: Loot[],
    requirements: {
        level: number,
        items: Item[],
    },
}