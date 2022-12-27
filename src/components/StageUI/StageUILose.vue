<template>
    <div class="text-lg font-bold flex flex-col gap-2 text-center w-full h-full items-center justify-center bg-slate-600">
        <div
            class="p-4 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer w-full max-w-[200px]"
            @click="restart"
        >
            Restart
        </div>
        <div
            class="p-4 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer w-full max-w-[200px]"
        >
            Exit
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useStageStore } from "@/store/useStageStore"
    import { useRouter } from "vue-router"

    const store = useStageStore()
    const router = useRouter()

    const restart = () => {
        store.restart()
        router.push({ name: 'stage-game' })
    }
</script>
