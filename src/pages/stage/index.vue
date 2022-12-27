<template>
    <div class="relative">
        <UI class="z-10">
            <RouterView />
        </UI>

        <div id="game" />
    </div>
</template>

<script setup lang="ts">
    import useApp from '@/composables/useApp'
    import UI from "@/components/UI.vue"
    import { useRouter } from "vue-router"

    const { mount, init, destroy } = useApp({
        router: useRouter(),
    })

    onMounted(() => {
        mount()
        init()
    })

    onUnmounted(() => {
        destroy()
    })
</script>