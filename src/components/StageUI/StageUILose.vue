<template>
    <Menu :items="menu" />
</template>

<script setup lang="ts">
    import { useStageStore } from "@/store/useStageStore"
    import { useRouter } from "vue-router"
    import Menu from "@/components/Menu.vue"

    const store = useStageStore()
    const router = useRouter()

    const menu = [
        {
            text: 'Restart',
            onClick: () => {
                store.restart()
                router.push({ name: 'stage-game' })
            },
        },
        {
            text: 'Exit',
            onClick: () => {
                router.push({ name: 'menu' })
            },
        },
    ]
</script>
