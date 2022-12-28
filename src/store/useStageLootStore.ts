import { defineStore } from "pinia"
import LootFactory from "@/lib/factories/Loot/LootFactory"
import type Loot from "@/lib/models/Loot"
import { useStageStore } from "@/store/useStageStore"
import type { Point } from "@/types"
import { distanceBetween } from "@/helpers/Positioning"
import itemsCatalog from "@/itemsCatalog"

export const useStageLootStore = defineStore('stage-loot', () => {
    // State ============
    const items = ref<Loot[]>([])

    // Shared
    const stage = useStageStore()

    // Lifecycle ============

    const init = () => {
        stage.app.ticker.add(onTick)
    }

    const destroy = () => {
        //
    }

    const onTick = () => {
        for (const index in items.value) {
            const loot = items.value[index]

            const distance = distanceBetween(loot.element, stage.player.element)

            if (distance < stage.player.stats.pickupDistance) {
                const item = itemsCatalog.find(item => item.id === loot.item_id)

                stage.player.inventory.addItem(item)

                loot.destroy()
                items.value.splice(parseInt(index), 1)
            }
        }
    }

    // Methods ============

    const spawnLoot = (position: Point) => {
        const lootDefinition = stage.zone.loot.at(Math.round((stage.zone.loot.length - 1) * Math.random()))

        const loot = LootFactory.create(lootDefinition)

        stage.place(loot.element, position)

        items.value.push(loot)
    }

    return {
        items,
        //
        init,
        destroy,
        onTick,
        //
        spawnLoot,
    }
})