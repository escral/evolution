<template>
    <UI class="flex items-center justify-center">
        <div class="flex flex-wrap gap-4 w-full h-full p-24">
            <div
                v-for="(zone, $i) of zones"
                :key="$i"
                class="cursor-pointer bg-black/10 rounded-lg hover:bg-black/20 w-1/4 flex flex-col items-center justify-center self-start h-48 p-4"
                @click="selectZone(zone)"
            >
                <div class="text-2xl">
                    {{ zone.title }}
                </div>
                <div class="text-gray-400 mt-2">
                    {{ zone.description }}
                </div>
            </div>
        </div>
    </UI>
</template>

<script setup lang="ts">
    import UI from "@/components/UI.vue"
    import { useRouter } from "vue-router"
    import type Zone from "@/types/models/Zone"
    import zones from "@/zones"

    const router = useRouter()

    const selectZone = (zone: Zone) => {
        router.push({
            name: "stage-game",
            params: {
                zone: zone.id,
            },
        })
    }
</script>