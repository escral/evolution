<template>
    <div class="relative">
        <UI>
            <StageUI />
        </UI>

        <div id="game" />
    </div>
</template>

<script setup lang="ts">
    import useApp from '@/composables/useApp'
    import UI from "@/components/UI.vue"
    import StageUI from "@/components/StageUI.vue"

    const { mount, init } = useApp()

    onMounted(() => {
        mount()
        init()
    })
</script>