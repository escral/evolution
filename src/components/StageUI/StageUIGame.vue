<template>
    <div v-if="store.player" class="w-1/4 max-w-[200px] text-center">
        <ProgressBar health :progress="health" :max="maxHealth" />
        <div class="font-bold">
            {{ health }} / {{ maxHealth }}
        </div>
    </div>
    <div class="font-bold flex items-center">
        <VueFeather class="text-white mr-1" size="18" type="dollar-sign" />
        {{ money }}
    </div>
</template>

<script setup lang="ts">
    import ProgressBar from "@/components/ProgressBar.vue"
    import { useStageStore } from "@/store/useStageStore"

    const store = useStageStore()

    const money = computed(() => store.money)
    const health = computed(() => store.player?.stats.health)
    const maxHealth = computed(() => store.player?.stats.maxHealth)
</script>
