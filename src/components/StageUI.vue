<template>
    <div class="w-1/4 max-w-[200px] text-center">
        <ProgressBar health :progress="health" />
        <div class="font-bold">
            {{ health }} / {{ healthTotal }}
        </div>
    </div>
    <div class="font-bold flex items-center">
        <VueFeather class="text-white mr-1" size="18" type="dollar-sign" />
        {{ money }}
    </div>
</template>

<script setup lang="ts">
    import ProgressBar from "@/components/ProgressBar.vue"
    import { useStatsStore } from "@/store/useStatsStore"
    import { useStageStore } from "@/store/useStageStore"

    const { health, healthTotal } = useStatsStore()

    const { money } = useStageStore()
</script>
