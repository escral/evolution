<template>
    <div class="w-full text-sm">
        <div class="w-full bg-gray-300 rounded font-normal">
            <div
                class="rounded bg-green-400 text-xs leading-none pt-1 text-center text-white whitespace-no-wrap"
                :style="{width: percent + '%'}"
                :class="percent < 100 ? activeColor : ''"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        progress: number,
        max?: number,
        health?: boolean,
    }>(), {
        max: null,
        health: false,
    })

    const activeColor = computed(() => {
        if (props.health) {
            return 'bg-red-400'
        }

        return 'bg-blue-400'
    })

    const percent = computed(() => {
        if (props.max) {
            return props.progress / props.max * 100
        }

        return props.progress * 100
    })
</script>
