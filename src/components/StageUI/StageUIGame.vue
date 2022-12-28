<template>
    <div v-if="store.player" class="flex justify-between">
        <div class="w-1/4 max-w-[200px]">
            <div class="text-center">
                <ProgressBar health :progress="health" :max="maxHealth" />
                <div class="font-bold">
                    {{ health }} / {{ maxHealth }}
                </div>
            </div>
            <div class="font-bold flex items-center">
                <VueFeather class="text-white mr-1" size="18" type="dollar-sign" />
                {{ money }}
            </div>
        </div>
        <div>
            <div class="flex items-center gap-4">
                <div v-for="item in items" :key="item.info.id" class="flex items-center">
                    <div class="text-gray-300 mr-1 text-xs">
                        {{ item.info.title }}:
                    </div>
                    <div class="font-bold">
                        {{ item.quantity }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ProgressBar from "@/components/ProgressBar.vue"
    import { useStageStore } from "@/store/useStageStore"

    const store = useStageStore()

    const money = computed(() => store.money)
    const health = computed(() => store.player.stats.health)
    const maxHealth = computed(() => store.player.stats.maxHealth)
    const items = computed(() => [...store.player.inventory.items.values()])
</script>
