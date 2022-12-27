<template>
    <div class="text-lg font-bold flex flex-col gap-2 text-center w-full h-full items-center justify-center bg-slate-600">
        <button
            v-for="(option, $i) in items"
            :key="$i"
            type="button"
            class="block p-4 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer w-full max-w-[200px]"
            :class="option.class"
            @click="handleClick(option)"
        >
            <span class="context-menu__item__text">
                {{ option.text }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
    import type MenuItem from "@/types/structures/MenuItem"

    defineProps<{
        items: MenuItem[],
    }>()

    const handleClick = (option) => {
        option.onClick ? option.onClick() : {}
    }
</script>