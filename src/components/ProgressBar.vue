<template>
    <div class="w-full text-sm">
        <div class="w-full bg-gray-300 rounded font-normal">
            <div
                class="rounded bg-green-400 text-xs leading-none pt-1 text-center text-white whitespace-no-wrap"
                :style="{width: progress.percent + '%'}"
                :class="progress.percent < 100 ? 'bg-blue-400' : ''"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import Progress from "~/types/models/Progress"

    defineProps<{
        progress: Progress,
    }>()
</script>
