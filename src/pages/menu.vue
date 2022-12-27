<template>
    <UI class="flex items-center justify-center">
        <div class="m-auto w-[200px] text-lg font-bold flex flex-col gap-2 text-center">
            <RouterLink
                :to="{ name: 'stage' }"
                class="p-4 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer"
            >
                Start
            </RouterLink>
            <div
                class="p-4 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer"
            >
                Exit
            </div>
        </div>
    </UI>
</template>

<script setup>
    import UI from "@/components/UI.vue"
</script>