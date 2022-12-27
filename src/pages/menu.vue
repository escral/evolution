<template>
    <UI class="flex items-center justify-center">
        <Menu :items="menu" />
    </UI>
</template>

<script setup>
    import Menu from "@/components/Menu.vue"
    import UI from "@/components/UI.vue"
    import { useRouter } from "vue-router"

    const router = useRouter()

    const menu = [
        {
            text: 'Start',
            onClick: () => {
                router.push({ name: 'stage-game' })
            },
        },
        {
            text: 'Exit',
        },
    ]
</script>